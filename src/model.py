from transformers import pipeline
import os

# Load the zero-shot model once at startup
classifier = pipeline(
    "zero-shot-classification",
    token=os.getenv("HUGG")
)

candidate_labels = [
    "charging", "durability", "weight", "storage", "Broken", "Price",
    "graphics", "speed", "heating", "Bad Performance", "Size", "Signal",
    "ease of use", "portability", "noise", "Nothing Negative", "Late delivery",

]