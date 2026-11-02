#!/usr/bin/env python3
"""
Compress every image in assets/img and update the HTML to point at the new files.

Run from the repo root (the folder that contains index.html):
    pip install pillow
    python optimize_images.py

What it does
  * Backs up the untouched originals to ./_img_backup/ (delete it once you are happy).
  * Resizes: photos max 1600px wide, team portraits max 800px, logo max 400px.
  * Converts JPG/JPEG/PNG photos to WebP (quality 78) and rewrites the .html references.
  * Keeps the logo as PNG (it is also used as the favicon / apple-touch-icon).
  * Prints the size saved per file and in total.
"""
import re, shutil, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
IMG = ROOT / "assets" / "img"
BACKUP = ROOT / "_img_backup"
EXTS = {".jpg", ".jpeg", ".png"}
QUALITY = 78

if not IMG.exists():
    sys.exit("assets/img not found. Run this from the repo root.")

def max_width(path: Path) -> int:
    parts = path.relative_to(IMG).parts
    if parts[0] == "logo": return 400
    if parts[0] == "team": return 800
    return 1600

files = [p for p in IMG.rglob("*") if p.is_file() and p.suffix.lower() in EXTS]
html_files = list(ROOT.glob("*.html"))
html = {f: f.read_text(encoding="utf-8") for f in html_files}
before = after = 0

for src in sorted(files):
    rel = src.relative_to(IMG)
    bak = BACKUP / rel
    bak.parent.mkdir(parents=True, exist_ok=True)
    if not bak.exists():
        shutil.copy2(src, bak)
    size_before = src.stat().st_size
    im = ImageOps.exif_transpose(Image.open(bak))
    w = max_width(src)
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

    if rel.parts[0] == "logo":
        im.save(src, optimize=True)               # stays PNG
        new = src
    else:
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "transparency" in im.info or im.mode in ("P", "LA") else "RGB")
        new = src.with_suffix(".webp")
        # keep names unique even if two files share a stem (a.jpg + a.png)
        if new.exists() and new != src:
            new = src.with_name(src.name + ".webp")
        im.save(new, "WEBP", quality=QUALITY, method=6)
        if new != src:
            src.unlink()
        old_ref = "assets/img/" + rel.as_posix()
        new_ref = "assets/img/" + new.relative_to(IMG).as_posix()
        for f in html:
            html[f] = html[f].replace(old_ref + '"', new_ref + '"')

    size_after = new.stat().st_size
    before += size_before; after += size_after
    print(f"{rel.as_posix():60s} {size_before/1024:8.0f} KB -> {size_after/1024:6.0f} KB")

for f, text in html.items():
    f.write_text(text, encoding="utf-8")

print(f"\nTotal: {before/1048576:.1f} MB -> {after/1048576:.1f} MB "
      f"({100 - after*100/max(before,1):.0f}% smaller)")
print("Originals are in _img_backup/. Open every page and check the images before deleting it.")
