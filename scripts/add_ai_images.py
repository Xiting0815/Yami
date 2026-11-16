#!/usr/bin/env python3
"""Übernimmt selbst erzeugte Bilder (z. B. von Gemini) als Rezeptfotos.

Aufruf:  python3 scripts/add_ai_images.py <Ordner> [Quelle]

Im Ordner liegt pro Rezept eine Bilddatei, benannt nach der Rezept-ID,
z. B. oats-apfel-zimt.png oder chia-mango.jpg (png/jpg/jpeg/webp).
Jedes Bild wird auf 480 px Breite verkleinert, als public/img/<id>.webp
gespeichert und in src/data/images.json als „KI-generiert“ eingetragen.
Vorhandene Fotos zum selben Rezept werden ersetzt.
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'img')
MAP = os.path.join(ROOT, 'src', 'data', 'images.json')

if len(sys.argv) < 2:
    sys.exit(__doc__)
src = os.path.expanduser(sys.argv[1])
origin = sys.argv[2] if len(sys.argv) > 2 else 'Gemini'
images = json.load(open(MAP))
done = 0
for name in sorted(os.listdir(src)):
    rid, ext = os.path.splitext(name)
    if ext.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
        continue
    im = Image.open(os.path.join(src, name)).convert('RGB')
    # auf 4:3 zuschneiden (wie die übrigen Fotos), dann 480 px breit
    w, h = im.size
    target = 4 / 3
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((480, 360), Image.LANCZOS)
    out = os.path.join(OUT_DIR, rid + '.webp')
    im.save(out, 'WEBP', quality=72)
    images[rid] = {'author': origin, 'file': f'img/{rid}.webp', 'license': 'KI', 'source': ''}
    print(f'✓ {rid}  ({os.path.getsize(out) // 1024} KB)')
    done += 1
open(MAP, 'w').write(json.dumps(images, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
print(f'{done} Bilder übernommen.')
