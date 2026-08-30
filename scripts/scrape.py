#!/usr/bin/env python3
"""Snapshot the Harvard Chan Lin Lab pages into data/raw/*.html.gz.

This is the provenance step: everything in data/content.json is derived from
these files by scripts/extract_content.py, so a re-scrape plus a re-extract is
the whole content-refresh workflow.

    python3 scripts/scrape.py            # fetch all pages
    python3 scripts/scrape.py --force    # re-fetch even if a snapshot exists
"""
import gzip, os, sys, time
from urllib.request import urlopen, Request

BASE = 'https://hsph.harvard.edu/research/lin-lab/'
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'}

PAGES = {
    'home': '',
    'current-lab-members': 'current-lab-members/',
    'alumni': 'alumni/',
    'research': 'research/',
    'projects': 'projects/',
    'software': 'software/',
    'grants_research-grants': 'grants/research-grants/',
    'grants_genomics-training-grant': 'grants/genomics-training-grant/',
    'grants_pqg-student-postdoc-travel-fund': 'grants/pqg-student-postdoc-travel-fund/',
    'consortia-and-affiliates': 'consortia-and-affiliates/',
    'open-positions': 'open-positions/',
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'data', 'raw')


def main():
    force = '--force' in sys.argv
    os.makedirs(RAW, exist_ok=True)
    for name, path in PAGES.items():
        dest = os.path.join(RAW, f'{name}.html.gz')
        if os.path.exists(dest) and not force:
            print(f'  = {name} (cached)')
            continue
        with urlopen(Request(BASE + path, headers=UA), timeout=60) as r:
            html = r.read()
        with gzip.open(dest, 'wb') as f:
            f.write(html)
        print(f'  + {name}  ({len(html)//1024} KB -> {os.path.getsize(dest)//1024} KB gz)')
        time.sleep(1)  # be polite to the origin


if __name__ == '__main__':
    main()
