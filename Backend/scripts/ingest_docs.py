import os
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
from pypdf import PdfReader
from app.db.database import get_db

def ingest_legal_docs():
    # Ensure env is loaded
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
    
    client = get_db()
    
    legal_data_dir = Path(__file__).resolve().parents[1] / "legal_data"
    
    if not legal_data_dir.exists():
        print(f"Directory not found: {legal_data_dir}")
        return
        
    pdf_files = list(legal_data_dir.rglob("*.pdf"))
    if not pdf_files:
        print(f"No PDFs found in {legal_data_dir}.")
        return
        
    print(f"Found {len(pdf_files)} PDF(s) to ingest.")
    
    for pdf_path in pdf_files:
        print(f"Processing {pdf_path.name}...")
        try:
            reader = PdfReader(str(pdf_path))
            text = ""
            for page in reader.pages:
                text += (page.extract_text() or "") + "\n\n"
                
            # Naive chunking for FTS
            chunk_size = 2000
            overlap = 200
            
            chunks = []
            start = 0
            while start < len(text):
                end = min(start + chunk_size, len(text))
                chunks.append(text[start:end])
                start += chunk_size - overlap
                
            for i, chunk in enumerate(chunks):
                if not chunk.strip():
                    continue
                    
                try:
                    client.table("legal_chunks").insert({
                        "act": pdf_path.stem,
                        "section": f"Chunk {i+1}",
                        "title": pdf_path.name,
                        "content": chunk.strip(),
                        "category": "General Law"
                    }).execute()
                    print(f" Inserted chunk {i+1}/{len(chunks)} for {pdf_path.name}")
                except Exception as e:
                    print(f" Failed to insert chunk {i+1}: {e}")
                    
        except Exception as e:
            print(f"Failed to process {pdf_path.name}: {e}")

if __name__ == "__main__":
    ingest_legal_docs()
