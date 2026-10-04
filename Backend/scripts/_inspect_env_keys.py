from pathlib import Path

root = Path(__file__).resolve().parents[2]
backend = root / "Backend"

print("ROOT CONTENTS:")
for p in sorted(root.iterdir()):
    print(" ", p.name, "DIR" if p.is_dir() else "FILE")

print("\nBACKEND CONTENTS:")
for p in sorted(backend.iterdir()):
    print(" ", p.name, "DIR" if p.is_dir() else "FILE")

legal = backend / "legal_data"
print("\nLEGAL_DATA EXISTS:", legal.exists())
if legal.exists():
    for p in sorted(legal.rglob("*")):
        if p.is_file():
            print(" ", p.relative_to(legal), p.stat().st_size)

env = backend / ".env"
print("\nENV EXISTS:", env.exists())
if env.exists():
    for line in env.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            print(line)
        else:
            print(s.split("=", 1)[0] + "=SET")
