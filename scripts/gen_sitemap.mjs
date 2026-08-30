// Writes dist/sitemap.xml from the same nav table the site renders.
// Run automatically after `vite build` (see package.json "build").
import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = process.env.SITE_ORIGIN ?? 'https://lin.genohub.org'

// Pull the paths straight out of src/data/nav.ts so the two cannot drift.
const navSrc = readFileSync(resolve(ROOT, 'src/data/nav.ts'), 'utf8')
const paths = [...navSrc.matchAll(/to: '([^']+)'/g)].map((m) => m[1])

const today = new Date().toISOString().slice(0, 10)
const urls = [...new Set(paths)]
  .map(
    (p) =>
      `  <url>\n    <loc>${ORIGIN}${p === '/' ? '/' : p}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <priority>${p === '/' ? '1.0' : '0.7'}</priority>\n  </url>`,
  )
  .join('\n')

writeFileSync(
  resolve(ROOT, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log(`sitemap.xml: ${paths.length} urls -> ${ORIGIN}`)
