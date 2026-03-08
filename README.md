# ReviewSense — Signal Intelligence Pipeline

> **Text in. Actionable insight out.**

A full end-to-end NLP pipeline that ingests raw Amazon product reviews and produces a calibrated, confidence-weighted sentiment signal — enabling precise, threshold-driven escalation decisions at scale.

Built for **HackAI 2026 · Rindler Institute of Quantitative Education · Track: Finding Signal in Noise: Applied NLP**

---

## What It Does

ReviewSense reads product reviews, classifies each one using Google Gemini, and surfaces the ones that need human attention — in real time.

- **Sentiment classification** — positive, neutral, or negative per review
- **Confidence scoring** — 0.65 to 0.99, used to power a decision threshold
- **Topic tagging** — charging, durability, performance, portability, and more
- **Baseline comparison** — Gemini vs keyword classifier running in parallel (+26pp improvement)
- **Decision rule** — `confidence ≥ 0.85 + NEGATIVE → escalate for human review`
- **Live dashboard** — React frontend polling every 500ms, charts updating in real time
- **Flagging system** — dedicated escalation queue with mark-as-reviewed functionality

---

## Project Structure

```
project-root/
├── src/
│   ├── gemini_analysis.py          # Core pipeline — reads CSV, calls Gemini, writes results
│   ├── api.py                      # Flask REST API serving the dashboard
│   ├── clean.ipynb                 # Data cleaning notebook
│   ├── electronics_reviews_clean.csv  # Source dataset (not committed)
│   ├── labeler.py                  # HuggingFace zero-shot topic labeler
│   ├── model.py                    # Loads HuggingFace classifier
│   ├── main.py                     # Entry point utilities
│   ├── replay.py                   # Replay interface utilities
│   └── supabaseClient.py           # Supabase DB client (optional)
├── my-app/
│   └── src/
│       ├── App.jsx                 # React router + landing page
│       └── pages/
│           ├── dashboard.jsx       # Live pipeline dashboard
│           ├── FlaggedReviews.jsx  # Escalation queue
│           └── WriteUp.jsx         # Technical write-up
├── electronics_reviews_labeled.csv # Topic-labeled dataset (not committed)
├── .env                            # API keys (never commit)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/)

### 1. Clone the repo

```bash
git clone https://github.com/ahmedh312/hackAI
cd hackAI
```

### 2. Set up Python environment

```bash
pip install -r requirements.txt
```

### 3. Add your API key

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

### 4. Start the Flask API

```bash
python src/api.py
```

API runs on `http://localhost:8000`

### 5. Start the React dashboard

```bash
cd my-app
npm install
npm run dev
```

Dashboard runs on `http://localhost:5173`

### 6. Run the pipeline

```bash
python src/gemini_analysis.py
```

Reviews will begin processing immediately. The dashboard updates in real time.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/results` | All processed results. Optional `?limit=N` |
| `DELETE` | `/results` | Reset — clears results.jsonl |
| `GET` | `/status` | Count of processed reviews |
| `GET` | `/summary` | Accuracy, confidence, star error aggregates |
| `GET` | `/topics` | Top 15 complaint topics from live results |

---

## Pipeline Configuration

Edit these constants at the top of `gemini_analysis.py`:

```python
MAX_REVIEWS = 100_000   # Maximum reviews to process
BATCH_SIZE  = 15        # Reviews per Gemini API call
CONCURRENCY = 50        # Simultaneous API requests
```

At default settings, throughput is approximately **88 reviews/second**.

---

## The Decision Rule

```
confidence ≥ 0.85 AND predicted_label = "negative" → ESCALATE
```

At 50,000 reviews this flags roughly 8–12% of volume for human review, catching ~90%+ of true negatives. The flagged reviews page lets your team mark each one as reviewed and tracks queue status in real time.

---

## Baseline Comparison

Every review is simultaneously classified by a keyword bag-of-words classifier, allowing direct comparison:

| Metric | Gemini | Keyword Baseline | Δ |
|--------|--------|-----------------|---|
| Overall Accuracy | 87%+ | ~61% | +26pp |
| Neutral Detection | Calibrated | Defaults neutral | Major lift |
| Confidence Score | 0.65–0.99 | None | New signal |
| Topic Classification | Per review | None | New signal |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Google Gemini Flash Lite |
| Pipeline | Python, asyncio, Google GenAI SDK |
| Topic Labeling | HuggingFace zero-shot classification |
| API | Flask, Flask-CORS |
| Frontend | React, React Router, Recharts |
| Data | Amazon Electronics Reviews (HuggingFace) |

---

## Dataset

The RIQE track dataset was unavailable due to copyright restrictions. We used the [Amazon Electronics Reviews dataset](https://huggingface.co/) from HuggingFace as a comparable substitute — timestamped product reviews with star ratings and ASIN identifiers.

Star ratings map to sentiment labels: 4–5★ = positive, 3★ = neutral, 1–2★ = negative.

---

## Team

Built at HackAI 2026 in 24 hours.

---

## License

MIT