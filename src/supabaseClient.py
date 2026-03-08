from supabase import create_client

url = "https://mapoolyysoregqfxwhxr.supabase.co"
key = "sb_publishable_ReLLFWA6VIc2BHeoBZn7Ug_BRc7uWkN"

def insert_review():
    supabase = create_client(url, key)
    data = {
        "asin": "B00004U8G0",
        "rating": 5,
        "text": "if you love listening to motivational tapes want to switch to listening to talk radio and then relax with a cd then this is the baby boombox for you with a remote control what more could you ask for i found this to be very reasonable it makes you almost want to buy two my husband steals mine to take with him when he does open houses in real estate so i just might have to get him one for his birthday i need my entertainment while working on my computer yes i need to get better speakers for my laptopi knowthe rebecca review",
        "verified": True,
        "created_at": "2000-10-07 14:21:50.000"
    }

    response = supabase.table("Reviews").insert(data).execute()

    return response

def get_reviews():
    supabase = create_client(url, key)
    response = supabase.table("Reviews").select("*").execute()

    return response
