from google import genai
from dotenv import load_dotenv
import os

# --------------------------------------------------
# 1. Load the Backend/.env file
# --------------------------------------------------

env_path = os.path.join(os.path.dirname(__file__), ".env")

load_dotenv(env_path, override=True)

print("Looking for .env at:", env_path)

# --------------------------------------------------
# 2. Get Gemini API key
# --------------------------------------------------

api_key = os.getenv("GEMINI_API_KEY")

print("GEMINI_API_KEY found:", bool(api_key))

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from Backend/.env"
    )

# --------------------------------------------------
# 3. Create Gemini client
# --------------------------------------------------

client = genai.Client(
    api_key=api_key.strip()
)

# --------------------------------------------------
# 4. Create File Search Store
# --------------------------------------------------

store = client.file_search_stores.create(
    config={
        "display_name": "indian-legal-knowledge-base"
    }
)

# --------------------------------------------------
# 5. Print the Store name
# --------------------------------------------------

print("\nStore created successfully!")

print("Store name:")
print(store.name)