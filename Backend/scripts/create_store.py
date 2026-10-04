import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing from .env file.")

client = genai.Client(api_key=api_key)

store = client.file_search_stores.create(
    config={
        "display_name": "indian-legal-knowledge-base",
        "embedding_model": "models/gemini-embedding-2",
    }
)

print("Store created successfully!")
print("Store name:", store.name)