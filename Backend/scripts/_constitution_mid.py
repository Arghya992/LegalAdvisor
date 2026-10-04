from pathlib import Path
from pypdf import PdfReader

pdf = Path(__file__).resolve().parents[1] / "legal_data" / "constitution" / "Constitution_of_India.pdf"
reader = PdfReader(str(pdf))
out = Path(__file__).resolve().parents[1] / "scripts" / "_constitution_mid.txt"
parts = []
for i in [15, 16, 17, 18, 19, 20, 40, 80]:
    if i < len(reader.pages):
        text = reader.pages[i].extract_text() or ""
        parts.append(f"===== PAGE {i+1} =====\n{text}\n")
out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out, "pages", len(reader.pages))
