from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
url = os.getenv("SUPABASE_URL", "").strip()
key = os.getenv("SUPABASE_SECRET_KEY", "").strip()
print("SUPABASE_URL_SET", bool(url))
print("SUPABASE_SECRET_KEY_SET", bool(key))
client = create_client(url, key)
tables = [
    "users",
    "conversations",
    "legal_resources",
    "legal_chunks",
    "student_tools",
]
for table in tables:
    try:
        res = client.table(table).select("*").limit(1).execute()
        n = 0 if res.data is None else len(res.data)
        print("OK", table, "sample_rows", n)
    except Exception as exc:
        print("FAIL", table, type(exc).__name__, str(exc)[:300])
