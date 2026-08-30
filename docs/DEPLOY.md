# Deploying lin.genohub.org

The site is static. It is built locally, rsynced to the the cloud node, and
served by an nginx pod behind the K3s Traefik ingress — the same ingress that
already fronts `api-v2.genohub.org` and `hcloud.genohub.org`.

```
  you            Cloudflare              origin node (ORIGIN_IP)
  ───            ──────────              ────────────────────────────
  npm run build
  rsync dist/ ──────────────────────────► /srv/lin-lab/releases/<ts>/
                                          /srv/lin-lab/current ─┐
  browser ──► lin.genohub.org ──► Traefik ──► Service ──► nginx ┘
              (proxied, Full TLS)   :443       :80        :8080
```

## One-time setup

### 1. Cloudflare DNS

In the **genohub.org** zone → **DNS → Records → Add record**:

| Field | Value |
|---|---|
| Type | `A` |
| Name | `lin` |
| IPv4 | `ORIGIN_IP` |
| Proxy status | **Proxied** (orange cloud) |
| TTL | Auto |

Keep it proxied. Traefik serves a **self-signed** certificate, so a grey-clouded
record would hand that certificate straight to browsers and every visit would
throw a trust error. Proxied, Cloudflare presents its own valid certificate and
talks to the origin over the self-signed hop.

> The zone already has a wildcard `*` record, so `lin.genohub.org` *resolves*
> before you add anything. That is exactly the trap that bit the `hcloud` record
> during the FAVOR migration: **the gate is a successful `curl`, never a DNS
> lookup.**

The zone's SSL/TLS mode must stay on **Full** (not Full (strict)), which is how
it is already configured — see `infrastructure repo/Docs/CloudFlare/config.md`.

### 2. Cluster objects

```bash
# from a machine with the K3s kubeconfig
kubectl apply -f deploy/k8s/linlab.yaml
kubectl -n web rollout status deploy/linlab
```

The pod will not become ready until `/srv/lin-lab/current` exists, so run the
first deploy right after. That is expected, not a failure.

`current` must be a **relative** symlink (`releases/<ts>`, not
`/srv/lin-lab/releases/<ts>`). nginx resolves it inside the container, where the
release sits at `/site/releases/<ts>`; an absolute link points at a path that
does not exist there and every request 404s while the pod still reports ready.
`scripts/deploy.sh` gets this right — it is only a trap if you flip the symlink
by hand.

## Deploying

```bash
./scripts/deploy.sh              # build, upload, flip the symlink, verify
./scripts/deploy.sh --no-build   # publish the dist/ already on disk
./scripts/deploy.sh --list       # what is on the node, and what is live
./scripts/deploy.sh --rollback   # point current/ back at the previous release
```

Each deploy lands in `/srv/lin-lab/releases/<UTC timestamp>/` and then moves the
`current` symlink onto it. nginx resolves the symlink per request, so the switch
takes effect immediately with no pod restart, and a rollback is the same move
backwards. The last five releases are kept.

Environment overrides: `ORIGIN_IP`, `ORIGIN_USER`, `ORIGIN_KEY`, `REMOTE_ROOT`,
`SITE_HOST`, `KEEP_RELEASES`.

## Verifying

**Check the content, not the status code.** Because of the zone wildcard,
`https://lin.genohub.org/` returned a perfectly healthy **200 from a completely
different origin** before the `lin` record existed. A status code cannot tell
the two apart; the page title can.

```bash
# origin, bypassing Cloudflare entirely
ssh -i ~/.ssh/origin_key ubuntu@ORIGIN_IP \
  "curl -s -H 'Host: lin.genohub.org' http://127.0.0.1/ | grep -o '<title>[^<]*'"
# -> <title>Lin Lab | Harvard T.H. Chan School of Public Health

# through Cloudflare — same test, and this is the one that gates the DNS change
curl -s https://lin.genohub.org/ | grep -o '<title>[^<]*'

# SPA fallback: an unknown path must return the app with a 200, not a 404
curl -sI https://lin.genohub.org/software | head -1
curl -s  https://lin.genohub.org/sitemap.xml | head -3
```

`scripts/deploy.sh` runs both of these itself and says plainly when the edge is
answering from the wildcard rather than from this site.

A 404 on `/software` while `/` returns 200 means the `try_files … /index.html`
fallback is not in effect — check that the ConfigMap applied and the pod picked
it up (`kubectl -n web rollout restart deploy/linlab`).

## Troubleshooting

| Symptom | Where to look |
|---|---|
| Pod `CrashLoopBackOff` or never ready | `/srv/lin-lab/current` missing — run a deploy |
| 404 from Traefik | `kubectl -n web get ingress linlab` — host must be `lin.genohub.org` |
| 502 through Cloudflare | `kubectl -n web get pods,endpoints` |
| Browser certificate warning | The DNS record is grey-clouded; set it to Proxied |
| Old content after a deploy | `./scripts/deploy.sh --list`, then purge the Cloudflare cache |
| `Host key verification failed` | The script disables strict checking; check `ORIGIN_KEY` instead |

## Cost

One nginx pod: 10m CPU requested, 32 MiB memory. Against the ACCESS allocation
that is inside the noise of what the FAVOR stack already burns on that node.
