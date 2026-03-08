from model import classifier, candidate_labels
import csv

def label_reviews():
    with open('src/electronics_reviews_clean.csv', mode='r', newline='', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        heaaders = csv_reader.fieldnames
        count = 0
        output = [["asin", "rating", "title", "text", "verified_purchase", "label"]]
        with open("electronics_reviews_labeled.csv", mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["asin", "rating", "title", "text", "verified_purchase", "label"])
            for row in csv_reader:
                ID = row['asin']
                rating = row['rating']
                title = row['title']
                review = row['text']
                verified_purchase = row['verified_purchase']
                date = row['timestamp']
                result = classifier(review, candidate_labels, multi_label=True)
                print(f"Review {count} - {review}, Label - {result['labels'][0]}, Score - {result['scores'][0]:.4f} \n\n")
                writer = csv.writer(file)
                # Write all rows at once
                writer.writerow([ID, rating, title, review, verified_purchase, date, result['labels'][0]])
                count += 1
    
def label_review(review):
    result = classifier(review, candidate_labels, multi_label=True)
    return result['labels'][0], result['scores'][0]