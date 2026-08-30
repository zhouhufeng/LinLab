#!/usr/bin/env python3
"""Turn the raw snapshots in data/raw/ into data/content.json.

The Harvard Chan site is WordPress: the interesting content sits inside
<main>, wrapped in `wp-block-*` markup. This keeps the structure that matters
(people cards, accordion sections, rich-text bodies) and throws away the theme
chrome, then sanitises what is left down to a small tag whitelist so the React
app can render it with dangerouslySetInnerHTML safely.

Image URLs come out pointing at hsph.harvard.edu; scripts/fetch_images.py
downloads them and rewrites this file to local /images/... paths.

    pip install beautifulsoup4 lxml
    python3 scripts/extract_content.py
"""
import gzip, json, os, re
from urllib.parse import urljoin, unquote

from bs4 import BeautifulSoup, Tag

BASE = 'https://hsph.harvard.edu/research/lin-lab/'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'data', 'raw')
OUT = os.path.join(ROOT, 'data', 'content.json')

# Tags that survive sanitisation. Everything else is unwrapped (kept text,
# dropped element) or, for scripts and theme widgets, removed outright.
KEEP = {'p', 'ul', 'ol', 'li', 'a', 'strong', 'b', 'em', 'i', 'br', 'h2', 'h3',
        'h4', 'h5', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote',
        'code', 'pre', 'sup', 'sub', 'figure', 'img', 'figcaption', 'hr'}


def clean(s):
    return re.sub(r'\s+', ' ', s).strip()


def unproof(url):
    """Unwrap Proofpoint URL-defense links back to the real destination.

    Harvard's mail gateway rewrote several consortium links before they were
    pasted into the CMS, so the page ships 500-character redirector URLs.
    """
    if not url or 'urldefense.proofpoint.com' not in url:
        return url
    m = re.search(r'[?&]u=([^&]+)', url)
    if not m:
        return url
    raw = m.group(1)
    for a, b in (('-3A', ':'), ('-2D', '-'), ('-5F', '_'), ('-3F', '?'),
                 ('-3D', '='), ('-26', '&'), ('_', '/')):
        raw = raw.replace(a, b)
    return unquote(raw)


def sanitize(root):
    """Whitelist tags, drop every attribute but href/src/alt, absolutise URLs."""
    soup = BeautifulSoup(str(root), 'lxml')
    body = soup.body or soup
    for t in body(['script', 'style', 'noscript', 'svg', 'button', 'nav']):
        t.decompose()
    for el in body.find_all(True):
        if el.name in ('html', 'body'):
            continue
        if el.name not in KEEP:
            el.unwrap()
            continue
        attrs = {}
        if el.name == 'a':
            href = unproof(urljoin(BASE, el.get('href', '')))
            if href:
                attrs['href'] = href
            if href.startswith('http') and 'hsph.harvard.edu' not in href:
                attrs['target'] = '_blank'
                attrs['rel'] = 'noopener noreferrer'
        if el.name == 'img':
            attrs['src'] = urljoin(BASE, el.get('src', ''))
            attrs['alt'] = el.get('alt', '')
        el.attrs = attrs
    html = ''.join(str(c) for c in body.children)
    return re.sub(r'>\s+<', '><', re.sub(r'\s+', ' ', html)).strip()


def links_in(el):
    out = []
    for a in el.find_all('a'):
        label = clean(a.get_text(' '))
        if label:
            out.append({'label': label,
                        'href': unproof(urljoin(BASE, a.get('href', '')))})
    return out


def load(name):
    """Parse one snapshot and return <main> with the theme chrome stripped."""
    with gzip.open(os.path.join(RAW, f'{name}.html.gz'), 'rt',
                   encoding='utf-8', errors='replace') as f:
        soup = BeautifulSoup(f.read(), 'lxml')
    main = soup.find('main')
    for t in main(['script', 'style', 'noscript', 'svg']):
        t.decompose()
    for n in main.select('nav, .wp-block-hsph-complex-topper, .page-footer-cta'):
        n.decompose()
    # The school-wide "Unleash your potential" CTA is appended to every page.
    for h in main.find_all('h2'):
        if 'Unleash your potential' in h.get_text():
            sec = h
            for _ in range(6):
                if sec.parent and sec.parent.name != 'main':
                    sec = sec.parent
            sec.decompose()
            break
    return soup, main


def person(item):
    name = item.select_one('.wp-block-hsph-people-list-item__name')
    img = item.select_one('figure img')
    body = item.select_one('.wp-block-hsph-accordion__content')
    bio = [clean(p.get_text(' ')) for p in body.find_all('p')] if body else []
    return {
        'id': item.get('id', ''),
        'name': clean(name.get_text(' ')) if name else '',
        'meta': [clean(m.get_text(' '))
                 for m in item.select('.wp-block-hsph-people-list-item__meta')],
        'image': img.get('src') if img else None,
        'alt': img.get('alt') if img else None,
        'bio': [b for b in bio if b],
        'links': links_in(body) if body else [],
    }


def sections(main):
    """Walk <main> in document order, emitting {title, html, links} sections.

    Accordion items keep their title; loose blocks come through untitled, which
    lets the renderer decide whether to draw a heading.
    """
    out, seen = [], set()

    def walk(node):
        for ch in node.children:
            if not isinstance(ch, Tag):
                continue
            cls = ch.get('class') or []
            if 'wp-block-hsph-accordion-item' in cls:
                title = ch.select_one('.wp-block-hsph-accordion__title')
                body = ch.select_one('.wp-block-hsph-accordion__content')
                out.append({'title': clean(title.get_text(' ')) if title else '',
                            'html': sanitize(body) if body else '',
                            'links': links_in(body) if body else []})
            elif ch.name == 'h1':
                continue
            elif ch.name in ('p', 'ul', 'ol', 'table', 'h2', 'h3', 'h4', 'figure'):
                html = sanitize(ch)
                if html and html not in seen:
                    seen.add(html)
                    out.append({'title': None, 'html': html, 'links': links_in(ch)})
            else:
                walk(ch)

    walk(main)
    # Drop blocks that carry no visible text — e.g. the <ul> shell the news
    # feed leaves behind once its <li> contents have been pulled out.
    return [s for s in out
            if s['title'] or BeautifulSoup(s['html'], 'lxml').get_text(strip=True)]


def people_page(name):
    _, main = load(name)
    groups, cur = [], {'group': None, 'people': []}
    for el in main.find_all(['h2', 'div']):
        cls = el.get('class') or []
        if el.name == 'h2' and 'wp-block-heading' in cls:
            if cur['people']:
                groups.append(cur)
            cur = {'group': clean(el.get_text(' ')) or None, 'people': []}
        elif el.name == 'div' and 'wp-block-hsph-people-list-item' in cls:
            cur['people'].append(person(el))
    if cur['people']:
        groups.append(cur)
    h1 = main.find('h1')
    return {'title': clean(h1.get_text()) if h1 else name, 'groups': groups}


def main_():
    data = {}
    data['members'] = people_page('current-lab-members')
    data['alumni'] = people_page('alumni')

    for name, key in (('software', 'software'),
                      ('research', 'research'),
                      ('projects', 'projects'),
                      ('consortia-and-affiliates', 'consortia'),
                      ('open-positions', 'openPositions'),
                      ('grants_research-grants', 'researchGrants'),
                      ('grants_genomics-training-grant', 'genomicsTrainingGrant'),
                      ('grants_pqg-student-postdoc-travel-fund', 'pqgTravelFund')):
        _, main = load(name)
        h1 = main.find('h1')
        data[key] = {'title': clean(h1.get_text()) if h1 else key,
                     'sections': sections(main)}

    soup, main = load('home')
    news = []
    for pi in main.select('.post-item'):
        a = pi.select_one('.post-item__link')
        img = pi.select_one('.post-item__media img')
        date = pi.select_one('.post-item__date')
        news.append({'title': clean(a.get_text(' ')) if a else '',
                     'href': a.get('href') if a else '',
                     'date': clean(date.get_text()) if date else '',
                     'image': img.get('src') if img else None,
                     'alt': (img.get('alt') or '') if img else ''})
        pi.decompose()
    gallery = [{'src': i.get('src'), 'alt': i.get('alt', '')} for i in main.select('img')]
    for f in main.select('figure'):
        f.decompose()
    # The gallery gets its own component, heading included.
    for h in main.find_all('h2'):
        if 'Photo Gallery' in h.get_text():
            h.decompose()
    data['home'] = {'sections': sections(main), 'news': news, 'gallery': gallery}

    top = soup.select_one('.wp-block-hsph-complex-topper')
    if top is None:  # load() strips it, so re-parse for the hero copy
        with gzip.open(os.path.join(RAW, 'home.html.gz'), 'rt', encoding='utf-8') as f:
            top = BeautifulSoup(f.read(), 'lxml').select_one('.wp-block-hsph-complex-topper')
    blurb = top.select_one('.wp-block-hsph-complex-topper__content p') if top else None
    data['site'] = {
        'name': 'Lin Lab',
        'department': 'Department of Biostatistics',
        'blurb': clean(blurb.get_text(' ')) if blurb else '',
        'email': 'dpcohen@hsph.harvard.edu',
        'location': '655 Huntington Ave, Boston, MA 02115',
    }

    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'wrote {os.path.relpath(OUT, ROOT)}  ({os.path.getsize(OUT)//1024} KB)')
    for k, v in data.items():
        n = (sum(len(g['people']) for g in v['groups']) if 'groups' in v
             else len(v.get('sections', [])))
        print(f'  {k:24} {n}')


if __name__ == '__main__':
    main_()
