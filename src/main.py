from ingestion import fetch_data
from processor import generate_signal
from rich.console import Console

# Console handles the "headless" visualization for the team
console = Console()

def run_pipeline():
    # 1. Fetch the data from your source
    console.print("[bold cyan]Fetching raw data...[/bold cyan]")
    data_stream = fetch_data() # This returns a list of text entries
    
    # 2. Process each item one-by-one to simulate real-time arrival
    for entry in data_stream:
        # Pass the entry to our processor logic
        result = generate_signal(entry['content'])
        
        # 3. Decision Logic: Determine the "Actionable Insight"
        # If the signal is high, we flag it for the user.
        if result['score'] > 0.8:
            console.print(f"[bold red] ALERT: High Risk Detected! [/bold red] Score: {result['score']}")
            console.print(f"Reason: {result['verdict']}")
        else:
            console.print(f"Status: Normal (Score: {result['score']})")

if __name__ == "__main__":
    run_pipeline()