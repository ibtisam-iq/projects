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
const SUFFIX = ' | Muhammad Ibtisam Iqbal'

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

// Pages serves 404.html on any unmatched path, where React Router renders NotFound.
// Copying index.html verbatim would hand crawlers the home page's title, canonical
// and `index, follow` on every dead URL, so build it here instead.
let notFound = template
for (const [pattern, replacement] of [
  [/<title>[\s\S]*?<\/title>/, `<title>Page Not Found${attr(SUFFIX)}</title>`],
  [
    /<meta name="description" content="[^"]*" \/>/,
    '<meta name="description" content="This page does not exist." />',
  ],
  [/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />'],
  // Self-referential rather than `/`, so a dead URL never claims to be the home page.
  [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}/404.html" />`],
  [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE}/404.html" />`],
  [
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="Page Not Found${attr(SUFFIX)}" />`,
  ],
]) {
  if (!pattern.test(notFound)) {
    throw new Error(`prerender-meta: 404 pattern ${pattern} did not match dist/index.html.`)
  }
  notFound = notFound.replace(pattern, replacement)
}
writeFileSync('dist/404.html', notFound)

// sitemap.xml comes from the same `routes` array as the shells, so a project can
// never be prerendered but missing from the sitemap, or the reverse. `/` is added
// here because it keeps the shell Vite emitted and so is not in `routes`.
// No <lastmod>: it would be the build date on every entry, telling crawlers that
// every page changed whenever any page did.
const locs = ['/', ...routes.map((m) => m.path)]
  .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
  .join('\n')
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs}\n</urlset>\n`
)

// Generated rather than kept in public/ for the same reason as sitemap.xml: with no
// file at that path the request falls through to the SPA fallback, so a crawler asking
// for /robots.txt is answered with an HTML document instead of plain text.
writeFileSync(
  'dist/robots.txt',
  [
    '# projects.ibtisam-iq.com',
    '# Generated by scripts/prerender-meta.js. Do not edit.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
    '# Full profile and the rest of the estate:',
    '# https://ibtisam-iq.com/llms.txt',
    '# https://ibtisam-iq.com/profile.json',
    '',
  ].join('\n')
)

console.log(
  `✅ Prerendered ${routes.length} routes, sitemap.xml (${locs.split('\n').length} URLs) and robots.txt`
)
