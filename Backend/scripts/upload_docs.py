import os
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from google import genai
from app.core.config import get_settings

def upload_legal_docs():
    settings = get_settings()
    if not settings.GEMINI_API_KEY or not settings.GEMINI_FILE_SEARCH_STORE:
        print("ERROR: GEMINI_API_KEY or GEMINI_FILE_SEARCH_STORE is missing in .env")
        return

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    store_name = settings.GEMINI_FILE_SEARCH_STORE
    
    legal_data_dir = Path(__file__).resolve().parents[1] / "legal_data"
    
    if not legal_data_dir.exists():
        print(f"Directory not found: {legal_data_dir}")
        return

    supported_extensions = {".pdf", ".txt", ".md", ".docx"}
    files_to_upload = [
        f for f in legal_data_dir.rglob("*") 
        if f.is_file() and f.suffix.lower() in supported_extensions
    ]

    if not files_to_upload:
        print(f"No documents found in {legal_data_dir}.")
        return

    print(f"Found {len(files_to_upload)} document(s) to upload.")

    for file_path in files_to_upload:
        rel_path = file_path.relative_to(legal_data_dir)
        print(f"Uploading and indexing: {rel_path}...")
        try:
            # Correct parameter: file_search_store_name
            operation = client.file_search_stores.upload_to_file_search_store(
                file_search_store_name=store_name,
                file=str(file_path)
            )
            print(f" Successfully indexed: {file_path.name}")
        except Exception as e:
            print(f" Failed to process {file_path.name}: {e}")

    print("\nUpload process finished!")

if __name__ == "__main__":
    upload_legal_docs()