import requests
import time

url = "http://127.0.0.1:8000/review"

# Your list of reviews
reviews = [
    {
        "asin": "B09TEST123",
        "rating": "2",
        "title": "ear cups too tight",
        "text": "they feel very tight on my head and after a few minutes of listening my ears hurt, uncomfortable for long sessions",
        "datestamp": "2024-12-02 11:05:10.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "3",
        "title": "sound okay, build weak",
        "text": "the audio is fine for casual listening but the headband bends too easily and feels cheap",
        "datestamp": "2024-12-03 14:22:45.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "1",
        "title": "broke after first use",
        "text": "one of the ear cups stopped working after the very first day of light use, extremely disappointed",
        "datestamp": "2024-12-04 09:18:55.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "2",
        "title": "too hot for long sessions",
        "text": "after 20 minutes my ears were sweating and the ear pads get very warm, uncomfortable for gaming",
        "datestamp": "2024-12-05 12:33:40.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "3",
        "title": "average headphones",
        "text": "sound quality is decent and comfortable enough for short listening, but the build quality is not impressive",
        "datestamp": "2024-12-06 16:50:12.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "1",
        "title": "left ear stopped working",
        "text": "after about a week the left speaker stopped producing sound, very disappointing for the price",
        "datestamp": "2024-12-07 08:12:21.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "2",
        "title": "microphone unreliable",
        "text": "the mic stops picking up sound randomly, difficult to use for calls or gaming chat",
        "datestamp": "2024-12-08 10:45:33.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "3",
        "title": "okay for short use",
        "text": "good for short listening sessions, but after 30 minutes my ears feel very warm and uncomfortable",
        "datestamp": "2024-12-09 13:20:55.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "1",
        "title": "broke quickly",
        "text": "plastic hinge cracked after two weeks, the headphones feel extremely fragile",
        "datestamp": "2024-12-10 15:33:01.000",
        "advise": None
    },
    {
        "asin": "B09TEST123",
        "rating": "2",
        "title": "uncomfortable for long use",
        "text": "ear cups trap heat and the headband presses too much, not suitable for long listening sessions",
        "datestamp": "2024-12-11 09:55:10.000",
        "advise": None
    }
]

for review in reviews:
    try:
        response = requests.post(url, json=review)
        print("Inserted:", review["title"], "| Status:", response.status_code)
    except Exception as e:
        print("Error inserting:", review["title"], e)
    
    # Wait 10 seconds before sending the next review
    time.sleep(10)