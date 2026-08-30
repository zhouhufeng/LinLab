#!/usr/bin/env python3
"""Download every image referenced by data/content.json, resize it, and rewrite
the JSON to point at the local copy under public/images/.

Headshots are capped at 640px on the long edge, gallery/news photos at 1600px.
Run from the repo root:  python3 scripts/fetch_images.py
"""
import json, os, re, subprocess, sys, unicodedata
from urllib.parse import quote, urlsplit, urlunsplit
from urllib.request import urlopen, Request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'data', 'content.json')
PEOPLE = os.path.join(ROOT, 'public', 'images', 'people')
GALLERY = os.path.join(ROOT, 'public', 'images', 'gallery')
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s or 'image'


def encode(url):
    """Percent-encode a non-ASCII path so http.client can put it on the wire."""
    parts = urlsplit(url)
    return urlunsplit(parts._replace(path=quote(parts.path)))


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    with urlopen(Request(encode(url), headers=UA), timeout=90) as r, open(dest, 'wb') as f:
        f.write(r.read())
    return dest


def resize(path, maxpx):
    """macOS sips; a no-op elsewhere so the script still works on Linux."""
    try:
        subprocess.run(['sips', '-Z', str(maxpx), path],
                       check=True, capture_output=True)
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(f'  ! could not resize {os.path.basename(path)}: {e}', file=sys.stderr)


def to_jpeg(path):
    """Re-encode as JPEG; multi-MB PNG headshots shrink by ~10x."""
    if path.lower().endswith(('.jpg', '.jpeg')):
        return path
    out = os.path.splitext(path)[0] + '.jpg'
    try:
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80',
                        path, '--out', out], check=True, capture_output=True)
        os.remove(path)
        return out
    except (FileNotFoundError, subprocess.CalledProcessError):
        return path


def grab(url, outdir, name, maxpx, jpeg=False):
    ext = os.path.splitext(url.split('?')[0])[1].lower() or '.jpg'
    if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.gif'):
        ext = '.jpg'
    dest = os.path.join(outdir, name + ext)
    if jpeg and os.path.exists(os.path.splitext(dest)[0] + '.jpg'):
        dest = os.path.splitext(dest)[0] + '.jpg'
    before = os.path.exists(dest)
    download(url, dest)
    if not before:
        resize(dest, maxpx)
        if jpeg:
            dest = to_jpeg(dest)
    rel = '/images/' + os.path.relpath(dest, os.path.join(ROOT, 'public', 'images')).replace(os.sep, '/')
    print(f'  {rel}  ({os.path.getsize(dest)//1024} KB)')
    return rel


def main():
    os.makedirs(PEOPLE, exist_ok=True)
    os.makedirs(GALLERY, exist_ok=True)
    data = json.load(open(CONTENT, encoding='utf-8'))

    print('People:')
    for key in ('members', 'alumni'):
        for group in data[key]['groups']:
            for p in group['people']:
                if p.get('image', '').__class__ is str and p['image'].startswith('http'):
                    p['image'] = grab(p['image'], PEOPLE, p['id'] or slug(p['name']), 640, jpeg=True)

    print('Gallery:')
    for i, g in enumerate(data['home'].get('gallery', []), 1):
        if g.get('src', '').startswith('http'):
            g['src'] = grab(g['src'], GALLERY, f'lab-{i:02d}', 1600, jpeg=True)

    print('News thumbnails:')
    for n in data['home'].get('news', []):
        if n.get('image', '') and n['image'].startswith('http'):
            n['image'] = grab(n['image'], GALLERY, 'news-' + slug(n['title'])[:48], 1000, jpeg=True)

    json.dump(data, open(CONTENT, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
    print('\nRewrote', os.path.relpath(CONTENT, ROOT))


if __name__ == '__main__':
    main()
