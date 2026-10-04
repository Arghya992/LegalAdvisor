import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.db.database import get_db
from dotenv import load_dotenv

def debug():
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
    client = get_db()
    
    print("1. Checking rows in legal_chunks...")
    res = client.table("legal_chunks").select("id, act, section, title, category").limit(3).execute()
    print(res.data)
    
    print("\n2. Checking tsv column directly...")
    res2 = client.table("legal_chunks").select("id, tsv").limit(1).execute()
    has_tsv = bool(res2.data and res2.data[0].get("tsv"))
    print("Has tsv:", has_tsv)
    
    print("\n3. Testing RPC with simple query 'theft'...")
    res3 = client.rpc("match_legal_chunks", {"search_query": "theft", "match_count": 5}).execute()
    print(len(res3.data), "results found")
    
    print("\n4. Testing RPC with the exact query from test_rag.py...")
    test_query = "What is the punishment for theft under Indian law?"
    res4 = client.rpc("match_legal_chunks", {"search_query": test_query, "match_count": 5}).execute()
    print(len(res4.data), "results found")
    
    print("\n5. Testing RPC with OR on full sentence...")
    or_query = test_query.replace(" ", " OR ")
    res5 = client.rpc("match_legal_chunks", {"search_query": or_query, "match_count": 5}).execute()
    print(len(res5.data), "results found")

if __name__ == "__main__":
    debug()
