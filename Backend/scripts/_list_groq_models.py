import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
client = Groq(api_key=os.environ["GROQ_API_KEY"].strip())
models = client.models.list()
ids = sorted(m.id for m in models.data)
print("MODEL_COUNT", len(ids))
for mid in ids:
    print(mid)
print("CONFIGURED_GROQ_MODEL", os.getenv("GROQ_MODEL", ""))
print("HOST", os.getenv("HOST", ""))
print("PORT", os.getenv("PORT", ""))
print("FRONTEND_URL", os.getenv("FRONTEND_URL", ""))
print("ENV", os.getenv("ENV", os.getenv("ENVIRONMENT", "")))
