from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client
import os
import json

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
client = create_client(os.environ["SUPABASE_URL"].strip(), os.environ["SUPABASE_SECRET_KEY"].strip())

for table in ["users", "conversations"]:
    res = client.table(table).select("*").limit(1).execute()
    row = (res.data or [{}])[0]
    print("TABLE", table, "KEYS", sorted(row.keys()))

# Try common SQL execution RPCs
for fn in ["exec_sql", "execute_sql", "sql"]:
    try:
        res = client.rpc(fn, {"query": "select 1"}).execute()
        print("RPC_OK", fn, res.data)
    except Exception as exc:
        print("RPC_FAIL", fn, str(exc)[:200])
