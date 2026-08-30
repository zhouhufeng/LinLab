# Lin Lab website

The Lin Lab site for **[lin.genohub.org](https://lin.genohub.org)** — a static
React build of the lab's Harvard Chan pages, served from the K3s node
behind the same Cloudflare zone as `api-v2.genohub.org`.

Lin Lab · Department of Biostatistics · Harvard T.H. Chan School of Public
Health · directed by Dr. Xihong Lin.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/ (plus dist/sitemap.xml)
npm run preview    # serve the build at http://localhost:4173
```

Node is not installed system-wide on every machine here. Without root:

```bash
V=v24.20.0
curl -sL https://nodejs.org/dist/$V/node-$V-darwin-arm64.tar.xz | tar xJ -C ~/.local/opt
ln -sfn ~/.local/opt/node-$V-darwin-arm64 ~/.local/opt/node
ln -sf ~/.local/opt/node/bin/{node,npm,npx} ~/.local/bin/
```

(Swap `darwin-arm64` for `linux-x64` on the workstation. `~/.local/bin` is
already on `PATH` via `.zshrc`.)

## Deploying

```bash
./scripts/deploy.sh
```

Builds, rsyncs a timestamped release to `/srv/lin-lab/releases/` on
`ORIGIN_IP`, flips the `current` symlink, and verifies at the origin and
through Cloudflare. `--rollback` moves the symlink back; `--list` shows what is
on the node.

One-time setup — the Cloudflare `lin` A record and `kubectl apply -f
deploy/k8s/linlab.yaml` — is in **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Layout

| Path | What it is |
|---|---|
| `src/` | React app — `App.tsx` holds the routes, `components/`, `pages/` |
| `src/data/content.ts` | Types over `data/content.json` |
| `src/data/nav.ts` | The menu — sidebar, footer and sitemap all read from it |
| `data/content.json` | **All site content**, generated from the Harvard Chan pages |
| `data/raw/*.html.gz` | The scraped pages the content was derived from |
| `public/images/` | Headshots and lab photos, downloaded and resized |
| `scripts/scrape.py` | Snapshot the upstream pages |
| `scripts/extract_content.py` | Snapshots → `data/content.json` |
| `scripts/fetch_images.py` | Download images, rewrite the JSON to local paths |
| `scripts/gen_sitemap.mjs` | `dist/sitemap.xml`, run as part of the build |
| `scripts/deploy.sh` | Build → node → symlink flip → verify |
| `deploy/k8s/linlab.yaml` | Namespace, nginx Deployment, Service, Ingress |
| `docs/DEPLOY.md` | Deployment runbook, DNS, troubleshooting |
| `docs/CONTENT.md` | Content pipeline and how to edit it |

## Updating the content

```bash
npm run refresh    # re-scrape upstream, re-extract, re-fetch images
npm run build
```

Or edit `data/content.json` directly. Both paths, and the shape of that file,
are documented in **[docs/CONTENT.md](docs/CONTENT.md)**.

## Design notes

Colours are the Harvard Chan theme's own tokens, read out of the source pages:
brick `#4b1b1b` for the banner, crimson `#a51c30` for links and controls, khaki
`#ffbf88` for labels, beige `#ffefd8` for the active-nav wash. The school's
Flecha M and Surt are not redistributable, so headings use Newsreader and body
text uses Inter — both open-licensed and close in feel.

The page shape follows the Harvard Chan lab template: a dark full-bleed topper
with the lab name and contact details, a sticky section menu on the left, and
accordion sections for people and software. On narrow screens the menu collapses
so you land on the content.

## Related

- Upstream: <https://hsph.harvard.edu/research/lin-lab/>
- FAVOR: <https://favor.genohub.org>
- Infrastructure this shares a node and a Cloudflare zone with:
  [`infrastructure repo`]((private infrastructure repo))
