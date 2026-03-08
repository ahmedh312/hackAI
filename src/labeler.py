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
    
def label_review(review_text):
    labeled_review = classifier(review_text, candidate_labels, multi_label=True)
    label = labeled_review['labels'][0]
    if label in ["Nothing Negative"]:
        return "Nothing"
    elif label in ["Late delivery"]:
        return "Reviews indicate common late delivery issues. We recommend improving logistics and shipping processes to ensure timely delivery."
    elif label in ["durability"]:
        return "Reviews indicate common durability issues. We recommend enhancing product materials and construction to improve durability and customer satisfaction."
    elif label in ["weight"]:
        return "Reviews indicate common weight issues. We recommend optimizing the product design to reduce weight while maintaining functionality."
    elif label in ["storage"]:
        return "Reviews indicate common storage issues. We recommend increasing storage capacity or improving storage efficiency."
    elif label in ["Broken"]:
        return "Reviews indicate common broken product issues. We recommend enhancing product quality control and repair services."
    elif label in ["Price"]:
        return "Reviews indicate common price issues. We recommend reviewing pricing strategies and offering more competitive deals."
    elif label in ["graphics"]:
        return "Reviews indicate common graphics issues. We recommend updating graphics drivers and improving visual performance."
    elif label in ["speed"]:
        return "Reviews indicate common speed issues. We recommend optimizing software and hardware for better performance."
    elif label in ["heating"]:
        return "Reviews indicate common heating issues. We recommend improving thermal management and cooling solutions."
    elif label in ["Bad Performance"]:
        return "Reviews indicate common performance issues. We recommend optimizing software and hardware for better performance."
    elif label in ["Size"]:
        return "Reviews indicate common size issues. We recommend optimizing the product design to improve fit and comfort."
    elif label in ["Signal"]:
        return "Reviews indicate common signal issues. We recommend updating firmware and improving reception capabilities."
    elif label in ["ease of use"]:
        return "Reviews indicate common ease of use issues. We recommend simplifying the user interface and providing clearer instructions."
    elif label in ["portability"]:
        return "Reviews indicate common portability issues. We recommend optimizing the product design to improve portability and convenience."
    elif label in ["noise"]:
        return "Reviews indicate common noise issues. We recommend improving sound insulation and reducing noise levels."
    else:        return "Uncategorized"
