from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from labeler import label_review
from supabaseClient import *
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

@app.route("/reviews", methods=["GET"])
def get_reviews_route():
    reviews = get_reviews()
    return jsonify(reviews)

@app.route("/review", methods=["GET"])
def get_review():
    data = {
        "asin": "B00004U8G0",
        "rating": 5,
        "text": "first the bad indoor no flash pictures are poor we took about 60 pictures this weekend for my brothers graduation about half inside with no flash and only 4 of them came out okay even the good ones werent particularly sharp when i reduced them to 800x600 we mostly took pictures of people any movement on the part of the subject or the camera made the picture very blurry guess its using a slow shutter speed to compensate for the low light though im surprised that its as bad as it is though this is the only digital camera that ive used so it might just be that i had high expectationsbesides indoor no flash shots this camera is great its pretty it has some weight to it which makes it feel more solid its smallit easily slips into a jeans or shirt pocket the lithium battery that comes with the battery is greatit lasts forever the camera comes with a charger i used the camera off and on over the weekend 60 pictures and didnt run out of battery outdoor shots are sharp and the colors are good the memory is pretty speedy i transferred over 100 meg worth of pictures in just a few minutes oh and since the battery is so good you dont need to worry about buying one of those special download hookups just plug the usb cable into the camera and start downloadingone thing that i particularly love being the computer geek that i am is that i can mount the camera as a usb drive under linux no special software needed i just mount t vfat devsda1 mntusb and copy the files over no hassling with windowsin summary if you dont mind using the flash for indoor pictures this is a great little camera well worth the money",     
        "verified": "True",
        "created_at": "2000-10-07 14:21:50.000"
    }
    text = data["text"]
    advise = label_review(text)
    return jsonify(advise)

@app.route("/review", methods=["POST"])
def post_review():
    data = request.get_json()
    text = f"Title - {data["title"]} Text - {data["text"]}"
    advise = label_review(text)
    data['advise'] = advise
    response = insert_review(data)
    return jsonify(response)

# Small chhange 
@app.route("/reviews", methods=["POST"])
def post_reviews():
    try:
        reviews = get_unlabel_reviews() 
        count = 1
        for review in reviews:
            advise = label_review(f"title: {review['title']} - Text: {review['text']}")
            review['advise'] = advise
            print(f"Done {count}/{len(reviews)}")
            count += 1
        print(reviews)
        response = insert_reviews(reviews)
        return jsonify(response)
    except Exception as e:
        print(f"Error in post_reviews: {e}")
        return jsonify({"error": str(e)}), 500

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