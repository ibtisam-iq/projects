// Runs AFTER `vite build`, as the last step of `npm run build`.
// Reads:  dist/index.html (the built shell) + data/projects.yaml
// Writes: dist/<route>/index.html, one per route, with route-specific meta.
//
// Why this exists: the site is a client-rendered SPA, so every route serves the
// same index.html. useCanonical fixes the tags in the browser, but crawlers that
// do not run JavaScript (LinkedIn, Slack, Twitter) read the raw HTML and see the
// site-root canonical and og:url on every page. Cloning the shell per route and
// swapping the meta block gives those crawlers the right values without adding a
// prerenderer, a headless browser, or any runtime dependency. React still renders
// the page itself on the client, exactly as before.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parse } from 'yaml'

const SITE = 'https://projects.ibtisam-iq.com'
const SUFFIX = ' | Muhammad Ibtisam'

// Escape for use inside a double-quoted HTML attribute.
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// metaTitle is optional. Fall back to the full title up to the first : or ,
// so a project added without one still produces a usable shell.
const titleFor = (p) => p.metaTitle?.trim() || p.title.split(/[:,]/)[0].trim()

// shortDescription runs 200-260 chars, past what crawlers display. The first
// sentence is self-contained and lands around 110-145 across every project.
const descFor = (p) => {
  const s = p.shortDescription.trim()
  const first = s.match(/^(.+?[.!?])(\s|$)/)
  return first ? first[1] : s.slice(0, 155)
}

const routeMeta = (path, title, description) => ({
  path,
  title: title + SUFFIX,
  description,
  url: `${SITE}${path}`,
})

const template = readFileSync('dist/index.html', 'utf8')
const projects = parse(readFileSync('data/projects.yaml', 'utf8'))

const routes = [
  routeMeta(
    '/how-i-work',
    'How I Work',
    'The method behind these projects: how each one is scoped, built, documented, and verified.'
  ),
  ...projects.map((p) => routeMeta(`/${p.slug}`, titleFor(p), descFor(p))),
]

// Each entry replaces exactly one tag in the built shell. A pattern that matches
// nothing is a failure, not a no-op: index.html changed and this script did not.
const rewrites = (m) => [
  [/<title>[\s\S]*?<\/title>/, `<title>${attr(m.title)}</title>`],
  [
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${attr(m.description)}" />`,
  ],
  [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${m.url}" />`],
  [
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${attr(m.title)}" />`,
  ],
  [
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${attr(m.description)}" />`,
  ],
  [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${m.url}" />`],
  [
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${attr(m.title)}" />`,
  ],
  [
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${attr(m.description)}" />`,
  ],
]

for (const m of routes) {
  let html = template
  for (const [pattern, replacement] of rewrites(m)) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender-meta: pattern ${pattern} did not match dist/index.html.\n` +
          `The head in index.html changed. Update scripts/prerender-meta.js to match.`
      )
    }
    html = html.replace(pattern, replacement)
  }
  mkdirSync(`dist${m.path}`, { recursive: true })
  writeFileSync(`dist${m.path}/index.html`, html)
}

console.log(`✅ Prerendered meta for ${routes.length} routes (og:url, canonical, title)`)
