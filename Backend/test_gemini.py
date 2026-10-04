from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Say exactly: Gemini connection works."
)

print(response.text)
