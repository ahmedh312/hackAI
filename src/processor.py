import openai # Assuming you are using an LLM to generate the signal
import json

# This function defines the "Quant logic" of your system.
# It takes a single piece of text and converts it into a structured dictionary.
def generate_signal(raw_text):
    """
    Args: raw_text (str): The raw text data (e.g., tweet, support ticket, news headline)
    Returns: dict: Contains a 'score' (0-1) and 'verdict' (str)
    """
    
    # 1. Define the prompt that creates the "Signal"
    # This acts as your "quant model" that interprets the text.
    prompt = f"""
    Analyze the following text and assign a risk score from 0.0 to 1.0.
    Text: {raw_text}
    
    Return ONLY a JSON object with two keys:
    1. 'score': The numerical risk probability.
    2. 'verdict': A short (1-sentence) reasoning for the score.
    """

    # 2. Call the AI service
    # We use a standard API call to convert the unstructured text to structured output.
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" } # Ensures we get clean JSON back
    )

    # 3. Parse the output
    # This transforms the LLM string output into a Python-friendly dictionary.
    data = json.loads(response.choices[0].message.content)
    
    return data