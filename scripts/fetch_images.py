#!/usr/bin/env python3
"""Lädt pro Rezept ein frei lizenziertes Foto von Wikimedia Commons.

Aufruf:  npx vite-node scripts/dump-recipes.ts > /tmp/recipes.json
         python3 scripts/fetch_images.py /tmp/recipes.json [--only id1,id2] [--force]

Speichert public/img/<id>.webp (480px breit) und Lizenzangaben in src/data/images.json.
Manuelle Festlegungen: scripts/image-overrides.json  { "<id>": "File:Dateiname.jpg" }
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request, hashlib
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'img')
MAP = os.path.join(ROOT, 'src', 'data', 'images.json')
OVR = os.path.join(ROOT, 'scripts', 'image-overrides.json')
# Wikimedia verlangt eine Kontaktangabe im User-Agent: https://w.wiki/4wJS
UA = os.environ.get('YAMI_UA', 'YamiRecipeApp/0.1 (private non-commercial recipe planner)') + ' python-urllib'
API = 'https://commons.wikimedia.org/w/api.php'
PAUSE = 1.5  # Sekunden zwischen Anfragen (Wikimedia drosselt sonst)
OK_LICENSE = re.compile(r'^(cc0|public domain|pd|cc by(-sa)? ?[1-4]\.0|cc by(-sa)?$|cc-by(-sa)?-[1-4]\.0)', re.I)
BAD_WORDS = re.compile(r'(logo|map|karte|svg|diagram|menu|speisekarte|packung|package|schild|sign|plakat|poster|stamp|briefmarke)', re.I)

def get(url, binary=False, tries=5):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except Exception as e:
            wait = 20 * (i + 1)
            print(f'   retry in {wait}s: {e}', file=sys.stderr)
            time.sleep(wait)
    return None

def strip_html(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()

def thumb_url(orig_url, width=500):
    # https://upload.wikimedia.org/wikipedia/commons/b/ba/Name.jpg -> .../commons/thumb/b/ba/Name.jpg/500px-Name.jpg
    m = re.match(r'(https://upload\.wikimedia\.org/wikipedia/commons)/(\w)/(\w\w)/([^?]+)', orig_url)
    if not m:
        return None
    base, a, ab, name = m.groups()
    return f'{base}/thumb/{a}/{ab}/{name}/{width}px-{name}'

def candidates_for(query, limit=12):
    params = {
        'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': '6',
        'gsrsearch': f'{query} filetype:bitmap', 'gsrlimit': str(limit),
        'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime',
    }
    time.sleep(PAUSE)
    data = get(API + '?' + urllib.parse.urlencode(params))
    pages = (data or {}).get('query', {}).get('pages', {})
    return sorted(pages.values(), key=lambda p: p.get('index', 99))

def info_for_title(title):
    params = {'action': 'query', 'format': 'json', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime'}
    data = get(API + '?' + urllib.parse.urlencode(params))
    pages = (data or {}).get('query', {}).get('pages', {})
    return list(pages.values())

def acceptable(p):
    ii = (p.get('imageinfo') or [{}])[0]
    if ii.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'):
        return None
    w, h = ii.get('width', 0), ii.get('height', 0)
    if w < 500 or h < 300 or not (0.6 <= w / max(h, 1) <= 2.2):
        return None
    if BAD_WORDS.search(p.get('title', '')):
        return None
    meta = ii.get('extmetadata', {})
    lic = strip_html(meta.get('LicenseShortName', {}).get('value', ''))
    if not OK_LICENSE.search(lic):
        return None
    return {
        'source': ii.get('descriptionurl'),
        'url': ii.get('url'),
        'author': strip_html(meta.get('Artist', {}).get('value', ''))[:120] or 'unbekannt',
        'license': lic,
        'commonsTitle': p.get('title'),
    }

def save_image(rid, cand):
    url = thumb_url(cand['url'])
    time.sleep(PAUSE)
    data = get(url, binary=True) if url else None
    if not data:
        return False
    try:
        im = Image.open(io.BytesIO(data)).convert('RGB')
    except Exception:
        return False
    # auf 4:3 zuschneiden (Kartenformat) und auf 480px skalieren
    w, h = im.size
    target = 4 / 3
    if w / h > target:
        nw = int(h * target); left = (w - nw) // 2; im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target); top = (h - nh) // 2; im = im.crop((0, top, w, top + nh))
    im = im.resize((480, 360), Image.LANCZOS)
    os.makedirs(OUT_DIR, exist_ok=True)
    im.save(os.path.join(OUT_DIR, f'{rid}.webp'), 'WEBP', quality=72, method=6)
    return True

def main():
    recipes = json.load(open(sys.argv[1]))
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    force = '--force' in sys.argv
    mapping = json.load(open(MAP)) if os.path.exists(MAP) else {}
    overrides = json.load(open(OVR)) if os.path.exists(OVR) else {}
    used_sources = {v['source'] for k, v in mapping.items() if v}
    for r in recipes:
        rid = r['id']
        if only and rid not in only:
            continue
        if rid in mapping and mapping[rid] and not force and os.path.exists(os.path.join(OUT_DIR, f'{rid}.webp')):
            continue
        print(f'· {rid}: {r["img"]}')
        chosen = None
        if rid in overrides:
            for p in info_for_title(overrides[rid]):
                c = acceptable(p) or None
                if c is None and p.get('imageinfo'):  # Override erzwingt Datei, Lizenz trotzdem prüfen
                    print('   override abgelehnt (Lizenz/Format)')
                chosen = c
        queries = [r['img'], r['title'].split(' mit ')[0].split(' (')[0]]
        for q in ([] if chosen else queries):
            for p in candidates_for(q):
                c = acceptable(p)
                if c and c['source'] not in used_sources:
                    chosen = c
                    break
            if chosen:
                break
        if chosen and save_image(rid, chosen):
            chosen['file'] = f'img/{rid}.webp'
            chosen.pop('url', None)
            mapping[rid] = chosen
            used_sources.add(chosen['source'])
            print(f'   ✓ {chosen["commonsTitle"]} ({chosen["license"]})')
        else:
            print('   ✗ kein passendes Bild')
            mapping[rid] = None
        json.dump(mapping, open(MAP, 'w'), ensure_ascii=False, indent=1, sort_keys=True)
    found = sum(1 for v in mapping.values() if v)
    print(f'Fertig: {found}/{len(mapping)} mit Bild')

if __name__ == '__main__':
    main()
