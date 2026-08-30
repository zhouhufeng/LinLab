# Where the content comes from, and how to change it

Everything on the site is generated from the public Harvard Chan Lin Lab pages
at <https://hsph.harvard.edu/research/lin-lab/>. Nothing is fetched at runtime —
the whole site is static.

```
  hsph.harvard.edu ──scrape.py──► data/raw/*.html.gz     provenance snapshot
                                        │
                            extract_content.py
                                        ▼
                                 data/content.json ◄──┐  the single source of truth
                                        │             │
                                 fetch_images.py ─────┘  rewrites image URLs to local
                                        ▼
                              public/images/{people,gallery}
                                        │
                                   vite build
                                        ▼
                                      dist/
```

## Refreshing from the upstream site

```bash
npm run refresh    # scrape --force, extract, fetch images
npm run build
git diff --stat data/content.json     # review before committing
```

Run the three steps in that order. `extract_content.py` writes image URLs
pointing at hsph.harvard.edu, and `fetch_images.py` is what rewrites them to
local `/images/...` paths — so extracting without then fetching leaves the site
hot-linking Harvard's server.

`fetch_images.py` skips files it already has, so a refresh only downloads what
is new. Delete `public/images/` to force a full re-fetch.

The scripts need `beautifulsoup4` and `lxml`:

```bash
pip3 install --user beautifulsoup4 lxml
```

Image resizing uses macOS `sips`. On Linux the download still works, it just
skips the resize step and prints a warning.

## Editing content directly

`data/content.json` is plain JSON and safe to hand-edit — that is the right move
for anything the lab wants to say here but not on the Harvard page. Two caveats:

- **A refresh overwrites it.** Keep local edits in a commit of their own so a
  refresh diff is easy to read and re-apply.
- **`html` fields are rendered with `dangerouslySetInnerHTML`.** They are safe
  because `extract_content.py` strips everything down to a whitelist of tags
  with only `href`/`src`/`alt` surviving. If you paste HTML in by hand, hold to
  that same whitelist.

### Shape of the file

| Key | Shape | Rendered by |
|---|---|---|
| `site` | lab name, department, blurb, email, location | `components/Topper.tsx`, `Footer.tsx` |
| `members`, `alumni` | `groups[] → people[]` with bio, links, headshot | `pages/People.tsx` |
| `home` | `sections[]`, `news[]`, `gallery[]` | `pages/Home.tsx` |
| everything else | `{title, sections[]}` | `pages/Standard.tsx` |

A `section` is `{title, html, links}`. A section **with** a title was an
accordion on the source page and stays collapsible; a section with `title: null`
renders as plain prose.

## Navigation

`src/data/nav.ts` is the single menu definition. The sidebar, the footer link
list and `dist/sitemap.xml` all read from it, so adding a page means adding a
route in `src/App.tsx` and an entry there — nothing else.

## Attribution and images

The text and photographs are the Lin Lab's own, republished from the lab's
Harvard Chan page. The news items on the home page are Harvard Chan School
newsroom headlines, captured at build time and linked back to the source; they
are a snapshot, not a live feed, so they go stale until the next refresh.

The Harvard Chan site sets its headings in Flecha M and its body text in Surt,
neither of which is licensed for redistribution. This site substitutes
Newsreader and Inter from Google Fonts, which read closely and are open-licensed.
