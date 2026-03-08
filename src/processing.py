# analysis.py
import pandas as pd
from transformers import pipeline as hf_pipeline

# ─────────────────────────────────────────────
# Load FinBERT once at startup
# (do NOT put this inside the function — it would reload on every call)
# ─────────────────────────────────────────────
sentiment_model = hf_pipeline(
    "text-classification",
    model="ProsusAI/finbert",
    return_all_scores=True
)

def generate_signal(headline: str) -> dict:
    """
    Analyzes a single financial headline.
    
    Args:    headline (str): cleaned text from processing.py
    Returns: dict with score, signal, price_direction, verdict
    """
    # Run FinBERT
    raw = sentiment_model(headline[:512])[0]
    scores = {r["label"]: r["score"] for r in raw}
    
    # Compound score: -1 (bearish) to +1 (bullish)
    compound = round(scores.get("positive", 0) - scores.get("negative", 0), 4)
    
    # Normalize to 0-1 scale for your score field
    score = round((compound + 1) / 2, 4)
    
    # Market signal
    if compound > 0.15:
        signal, direction = "BUY", "INCREASE"
    elif compound < -0.15:
        signal, direction = "SELL", "DECREASE"
    else:
        signal, direction = "HOLD", "NEUTRAL"
    
    # Human readable verdict
    dominant = max(scores, key=scores.get)
    confidence = round(scores[dominant] * 100, 1)
    verdict = f"{confidence}% confident this headline is {dominant}."

    return {
        "score":           score,        # 0.0 to 1.0
        "signal":          signal,        # BUY / SELL / HOLD
        "price_direction": direction,     # INCREASE / DECREASE / NEUTRAL
        "verdict":         verdict,       # human readable explanation
        "pos":             round(scores.get("positive", 0), 4),
        "neg":             round(scores.get("negative", 0), 4),
        "neu":             round(scores.get("neutral",  0), 4),
    }


def analyze(df: pd.DataFrame) -> pd.DataFrame:
    """
    Runs generate_signal on every row coming from processing.py
    """
    results = []
    for _, row in df.iterrows():
        signal = generate_signal(row["headline"])
        results.append({**row.to_dict(), **signal})

    out = pd.DataFrame(results)
    print(f"[analysis] {len(out)} headlines analyzed")
    return out