from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1] / "legal_data"
out = Path(__file__).resolve().parents[1] / "scripts" / "_pdf_sample.txt"
out.write_text("", encoding="utf-8")
for pdf in sorted(root.rglob("*.pdf")):
    reader = PdfReader(str(pdf))
    print("=" * 80)
    print(pdf.name, "pages=", len(reader.pages), "size=", pdf.stat().st_size)
    sample = []
    for i, page in enumerate(reader.pages[:3]):
        text = page.extract_text() or ""
        sample.append(f"--- page {i+1} ({len(text)} chars) ---\n{text[:1500]}")
    out = Path(__file__).resolve().parents[1] / "scripts" / "_pdf_sample.txt"
    with out.open("a", encoding="utf-8") as fh:
        fh.write("=" * 80 + "\n")
        fh.write(f"{pdf.name} pages={len(reader.pages)} size={pdf.stat().st_size}\n")
        fh.write("\n".join(sample)[:6000])
        fh.write("\n\n")
    print("sampled", pdf.name, "pages", len(reader.pages))
