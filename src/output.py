# src/output.py
from rich.console import Console

console = Console()

def display_results(signal):
    # Only print these if this function is actually called
    console.print("[bold cyan]Analysis Complete:[/bold cyan]")
    console.print(f"Score: {signal.get('score')}")
    console.print(f"Verdict: {signal.get('verdict')}")
    console.print("-" * 20)