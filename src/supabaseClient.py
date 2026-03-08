from supabase import create_client

url = "https://mapoolyysoregqfxwhxr.supabase.co"
key = "sb_publishable_ReLLFWA6VIc2BHeoBZn7Ug_BRc7uWkN"

def insert_review(data):
    supabase = create_client(url, key)
    try:
        response = supabase.table("Reviews").insert(data).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_reviews():
    supabase = create_client(url, key)
    try:
        response = supabase.table("Reviews").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return []

def get_unlabel_reviews():
    supabase = create_client(url, key)
    response = supabase.table("Reviews").select("*").is_("advise",None).execute()
    reviews = response.data
    return reviews

def insert_reviews(reviews):
    supabase = create_client(url, key)
    for r in reviews:
        print(f"Updating review ID {r.get('id')} with advise: {r['advise']}")
        try:
            supabase.table("Reviews") \
                .update({"advise": r['advise']}) \
                .eq("id", r["id"]) \
                .execute()
        except Exception as e:
            print(f"Error updating review {r.get('id')}: {e}")
    return "Updated Successfully"

