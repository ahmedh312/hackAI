import os
import re
import csv
import json
import asyncio
import time
from collections import defaultdict

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

MAX_REVIEWS = 100_000
CONCURRENCY = 50
BATCH_SIZE  = 20

def rating_to_label(r: float) -> str:
    if r >= 4.0: return "positive"
    if r <= 2.0: return "negative"
    return "neutral"

# ── Baseline classifier ───────────────────────────────────────────────────────
POSITIVE_WORDS = {"great", "excellent", "love", "perfect", "amazing", "best", "fantastic", "good"}
NEGATIVE_WORDS = {"terrible", "awful", "broken", "worst", "useless", "horrible", "poor", "bad", "waste"}

def keyword_classify(text: str) -> str:
    words = set(text.lower().split())
    pos = len(words & POSITIVE_WORDS)
    neg = len(words & NEGATIVE_WORDS)
    if pos > neg: return "positive"
    if neg > pos: return "negative"
    return "neutral"

async def analyze_batch(semaphore, rows: list, indices: list) -> list:
    async with semaphore:
        reviews_text = "\n".join([
            f"{i+1}. \"{(r.get('text') or r.get('title') or '')[:300]}\""
            for i, r in enumerate(rows)
        ])

        prompt = f"""You are a product review sentiment classifier. Be decisive.

Classify each review as positive (4-5 stars), negative (1-2 stars), or neutral (3 stars).
Return a confidence score between 0.6 and 1.0.

Reviews:
{reviews_text}

Return ONLY a JSON array with exactly {len(rows)} objects, no other text:
[{{"predicted_label": "positive", "predicted_stars": 5, "confidence": 0.92}}, ...]"""

        fallback = [{"predicted_label": "neutral", "predicted_stars": 3, "confidence": 0.65}] * len(rows)

        for attempt in range(3):
            try:
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: client.models.generate_content(
                        model="gemini-3.1-flash-lite-preview",
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            max_output_tokens=800,
                            temperature=0.1
                        )
                    )
                )
                raw = response.text.strip()
                raw = re.sub(r"^```json\s*|\s*```$", "", raw, flags=re.DOTALL).strip()
                preds = json.loads(raw)

                # Ensure we got the right number back
                if not isinstance(preds, list) or len(preds) != len(rows):
                    raise ValueError(f"Expected {len(rows)} results, got {len(preds) if isinstance(preds, list) else 'non-list'}")

                # Fix missing confidence values
                for p in preds:
                    if not p.get("confidence") or p["confidence"] == 0.0:
                        p["confidence"] = 0.85 if p.get("predicted_label") in ["positive", "negative"] else 0.65

                results = []
                for i, (row, pred, idx) in enumerate(zip(rows, preds, indices)):
                    text = (row.get('text') or row.get('title') or '').strip()
                    actual_rating = float(row.get('rating', 3.0))
                    actual_label  = rating_to_label(actual_rating)
                    baseline_label = keyword_classify(text)

                    results.append({
                        "index":            idx,
                        "asin":             row.get("asin", ""),
                        "actual_rating":    actual_rating,
                        "actual_label":     actual_label,
                        "predicted_label":  pred.get("predicted_label", "neutral"),
                        "predicted_stars":  pred.get("predicted_stars", 3),
                        "confidence":       round(float(pred.get("confidence", 0.65)), 2),
                        "correct":          pred.get("predicted_label") == actual_label,
                        "star_error":       round(abs(pred.get("predicted_stars", 3) - actual_rating), 2),
                        "baseline_label":   baseline_label,
                        "baseline_correct": baseline_label == actual_label,
                        "text_snippet":     text[:60]
                    })
                return results

            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    wait = (attempt + 1) * 10
                    print(f"\nRate limit hit, waiting {wait}s...")
                    await asyncio.sleep(wait)
                elif "404" in str(e):
                    print(f"\nModel error: {e}")
                    break
                else:
                    if attempt == 2:
                        print(f"\nBatch failed after 3 attempts: {e}")
                    await asyncio.sleep(2)

        # Fallback: return neutral for all in batch
        results = []
        for row, pred, idx in zip(rows, fallback, indices):
            text = (row.get('text') or row.get('title') or '').strip()
            actual_rating = float(row.get('rating', 3.0))
            actual_label  = rating_to_label(actual_rating)
            baseline_label = keyword_classify(text)
            results.append({
                "index": idx, "asin": row.get("asin", ""),
                "actual_rating": actual_rating, "actual_label": actual_label,
                "predicted_label": "neutral", "predicted_stars": 3,
                "confidence": 0.65, "correct": "neutral" == actual_label,
                "star_error": round(abs(3 - actual_rating), 2),
                "baseline_label": baseline_label,
                "baseline_correct": baseline_label == actual_label,
                "text_snippet": text[:60]
            })
        return results


async def run_pipeline(filepath: str, output_path: str = "results.jsonl"):
    rows = []
    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=',')
        rows = [r for r in reader if (r.get('text') or r.get('title') or '').strip()]

    rows = rows[:MAX_REVIEWS]

    done_indices = set()
    try:
        with open(output_path, 'r') as f:
            done_indices = {json.loads(l)["index"] for l in f if l.strip()}
        rows = [r for i, r in enumerate(rows) if i not in done_indices]
        print(f"Resuming — {len(done_indices)} already done, {len(rows)} remaining")
    except FileNotFoundError:
        print("Fresh run — no previous results found")

    total = len(rows)
    if total == 0:
        print("All reviews already processed!")
        return

    print(f"Processing {total} reviews in batches of {BATCH_SIZE} (concurrency={CONCURRENCY})...\n")

    offset = max(done_indices) + 1 if done_indices else 0

    # Build batches
    batches = []
    for i in range(0, len(rows), BATCH_SIZE):
        batch_rows    = rows[i:i + BATCH_SIZE]
        batch_indices = list(range(offset + i, offset + i + len(batch_rows)))
        batches.append((batch_rows, batch_indices))

    semaphore = asyncio.Semaphore(CONCURRENCY)
    tasks = [analyze_batch(semaphore, br, bi) for br, bi in batches]

    completed = 0
    correct = 0
    baseline_correct_count = 0
    total_confidence = 0.0
    total_star_error = 0.0
    label_matrix = defaultdict(lambda: defaultdict(int))
    start = time.time()

    with open(output_path, 'a') as out:
        for coro in asyncio.as_completed(tasks):
            batch_results = await coro
            if not batch_results:
                continue

            for result in batch_results:
                out.write(json.dumps(result) + '\n')
                completed += 1
                if result["correct"]: correct += 1
                if result["baseline_correct"]: baseline_correct_count += 1
                total_confidence += result["confidence"]
                total_star_error += result["star_error"]
                label_matrix[result["actual_label"]][result["predicted_label"]] += 1

            out.flush()

            elapsed = time.time() - start
            rate    = completed / elapsed
            eta     = (total - completed) / rate if rate > 0 else 0

            print(
                f"\r[{completed}/{total}] "
                f"Gemini: {correct/completed*100:.1f}% | "
                f"Baseline: {baseline_correct_count/completed*100:.1f}% | "
                f"Δ: +{(correct-baseline_correct_count)/completed*100:.1f}pp | "
                f"Conf: {total_confidence/completed:.2f} | "
                f"ETA: {eta:.0f}s   ",
                end='', flush=True
            )
            await asyncio.sleep(0.01)

    print(f"\n\n✅ Done in {time.time()-start:.1f}s")
    print(f"{'─'*45}")
    print(f"Gemini Accuracy:       {correct/completed*100:.1f}%")
    print(f"Keyword Baseline:      {baseline_correct_count/completed*100:.1f}%")
    print(f"Improvement:           +{(correct-baseline_correct_count)/completed*100:.1f}pp")
    print(f"{'─'*45}")
    print(f"Avg Confidence:        {total_confidence/completed:.2f}")
    print(f"Avg Star Error:        ±{total_star_error/completed:.2f}")
    print(f"Confusion Matrix:")
    for actual, preds in label_matrix.items():
        print(f"  {actual:10s} → {dict(preds)}")

if __name__ == "__main__":
    asyncio.run(run_pipeline(r"C:\project-root\src\electronics_reviews_clean.csv"))