"""Try to apply SQL to Supabase without printing secrets."""
from pathlib import Path
import os
from urllib.parse import urlparse

from dotenv import load_dotenv
import httpx

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
url = os.environ["SUPABASE_URL"].strip().rstrip("/")
key = os.environ["SUPABASE_SECRET_KEY"].strip()
parsed = urlparse(url)
host = parsed.hostname or ""
ref = host.split(".")[0] if host else ""
print("HOST_KIND", "supabase" if host.endswith("supabase.co") else host[-20:])
print("REF_LEN", len(ref))

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
}

candidates = [
    f"{url}/pg/query",
    f"{url}/pg-meta/default/query",
    f"{url}/rest/v1/rpc/graphql",
]

sql = "select 1 as ok;"
for endpoint in candidates:
    try:
        r = httpx.post(endpoint, headers=headers, json={"query": sql}, timeout=20)
        print("TRY", endpoint.replace(url, "<URL>"), r.status_code, r.text[:180].replace("\n", " "))
    except Exception as exc:
        print("ERR", endpoint.replace(url, "<URL>"), type(exc).__name__)

# Try postgres ports without printing password
try:
    import socket
    db_host = f"db.{ref}.supabase.co"
    for port in (5432, 6543):
        s = socket.socket()
        s.settimeout(5)
        try:
            s.connect((db_host, port))
            print("TCP_OPEN", "db.<ref>.supabase.co", port)
        except Exception as exc:
            print("TCP_FAIL", "db.<ref>.supabase.co", port, type(exc).__name__)
        finally:
            s.close()
except Exception as exc:
    print("SOCKET_ERR", type(exc).__name__)
