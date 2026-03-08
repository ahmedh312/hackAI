from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from collections import Counter

app = Flask(__name__)
CORS(app, methods=["GET", "POST", "DELETE", "OPTIONS"])

RESULTS_FILE = r"C:\project-root\src\results.jsonl"

@app.route("/results")
def get_results():
    results = []
    limit = request.args.get("limit", type=int)
    try:
        with open(RESULTS_FILE, 'r') as f:
            for line in f:
                line = line.strip()
                if line:
                    results.append(json.loads(line))
    except FileNotFoundError:
        pass
    if limit:
        results = results[-limit:]
    return jsonify(results)

@app.delete("/results")
def reset_results():
    try:
        os.remove(RESULTS_FILE)
    except FileNotFoundError:
        pass
    # ✅ Create a fresh empty file immediately so pipeline resume logic
    #    sees index 0 and starts from scratch instead of appending
    open(RESULTS_FILE, 'w').close()
    return jsonify({"status": "reset"})

@app.route("/status")
def get_status():
    try:
        with open(RESULTS_FILE, 'r') as f:
            count = sum(1 for line in f if line.strip())
        return jsonify({"count": count, "running": True})
    except FileNotFoundError:
        return jsonify({"count": 0, "running": False})

@app.route("/summary")
def get_summary():
    total = correct = 0
    confidence_sum = star_error_sum = 0.0
    try:
        with open(RESULTS_FILE, 'r') as f:
            for line in f:
                if not line.strip(): continue
                r = json.loads(line)
                total += 1
                if r.get("correct"): correct += 1
                confidence_sum += r.get("confidence", 0)
                star_error_sum += r.get("star_error", 0)
    except FileNotFoundError:
        pass
    return jsonify({
        "total": total,
        "correct": correct,
        "accuracy": round(correct / total * 100, 1) if total else 0,
        "avg_confidence": round(confidence_sum / total, 2) if total else 0,
        "avg_star_error": round(star_error_sum / total, 2) if total else 0,
    })

@app.route("/topics")
def get_topics():
    counts = Counter()
    try:
        with open(RESULTS_FILE, 'r') as f:
            for line in f:
                if not line.strip(): continue
                r = json.loads(line)
                topic = (r.get("topic") or "").strip().lower()
                if topic and topic != "unknown":
                    counts[topic] += 1
    except FileNotFoundError:
        return jsonify([])
    data = [{"topic": k, "count": v} for k, v in counts.most_common(15)]
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=8000, debug=True)