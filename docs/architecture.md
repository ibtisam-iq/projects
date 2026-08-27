# Architecture: projects.ibtisam-iq.com

## Overview

This repository hosts the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com), a React + TypeScript + Tailwind CSS portfolio site that showcases DevOps projects.

The site is **data-driven**. Project content lives in [`data/projects.yaml`](../data/projects.yaml) (the single source of truth). A build-time script converts this YAML into a typed TypeScript module consumed by the React app.

---

## Data Flow

```
┌─────────────────────────────────────┐
│  ibtisam-iq/projects                │
│                                     │
│  data/projects.yaml  ◄── Edit here  │
│         │                           │
│  scripts/generate-projects.js       │
│         │ (reads YAML, writes TS)   │
│         ▼                           │
│  src/data/projects.ts (generated)   │
│         │                           │
│  GitHub Actions: pages.yml          │
│         │                           │
│  1. Checkout code                   │
│  2. npm ci                          │
│     → postinstall runs generate     │
│  3. npm run build                   │
│     ├─ generate-projects.js         │
│     ├─ tsc -b && vite build         │
│     └─ prerender-meta.js            │
│        → dist/<route>/index.html    │
│  4. Verify per-route og:url         │
│  5. Add CNAME + 404.html            │
│  6. Deploy to GitHub Pages          │
│         │                           │
└─────────┼───────────────────────────┘
          │
          ▼
  projects.ibtisam-iq.com (live)
```

---

## Architecture Rationale

### Limitations of Hardcoded TypeScript Data
The simplest approach is to put all project data directly inside `src/data/projects.ts`. This works initially but has serious long-term problems:

- As projects grow (10, 20, 50+), the TypeScript file becomes extremely long and hard to maintain.
- Every time a project is added, TypeScript code has to be edited, even though no UI logic is changing.
- It mixes **content** (what the projects are) with **code** (how they are displayed). These are fundamentally different concerns.

### Decoupled Content Layer (YAML Source of Truth)
YAML is the right format for structured content data because:
- It is human-readable and easy to write.
- It supports lists, nested objects, and multi-line strings natively.
- It is the same format used in Kubernetes manifests, GitHub Actions, and Docker Compose. Familiar territory in the DevOps world.
- It has no TypeScript syntax requirements, no brackets, no commas.

---

## Project Schema

Each project in `data/projects.yaml` follows this schema. Several of these fields are
read by another repository; see [`consumers.md`](./consumers.md) before renaming any.



```yaml
- slug: my-project                     # URL-safe identifier (/project/<slug>)
  title: "My Project"                  # Display name
  metaTitle: "My Project on AWS"       # Optional, ~45-55 chars. <title> and og:title
  shortName: "My Project"              # Required, max 28 chars. Chips and card headings
  homepage: false                      # Feature on the portfolio site's homepage
  category: platform                   # platform | tool
  status: completed                    # completed | in-progress | maintained | archived
  year: 2026                           # Completion or last major update year
  shortDescription: "Card summary."    # Shown on the project card
  description: "Full overview."        # Shown on the project detail page (supports \n\n for paragraphs)
  sections:                            # Flexible content blocks (any number of sections/items)
    - title: "Section Heading"
      items:
        - "Bullet point describing what was built and why."
        - "Another bullet point with specific tools and decisions."
  tags:                                # Discipline/practice, from the closed
    - ci-cd                            #   ALLOWED_TAGS vocabulary in taxonomy.ts
    - orchestration
  tech:                                # Concrete tool, must exist in TECH_REGISTRY
    - Docker                           #   in taxonomy.ts (also assigns its domain)
    - Terraform
  links:                               # Type + URL pairs
    - type: github                     # github | runbook | blog | website | playground | docs | app-repo | cd-repo
      url: "https://github.com/..."
    - type: runbook
      url: "https://runbook.ibtisam-iq.com/..."
  imageUrl: "/images/hero.png"         # Optional hero image for detail page
  featured: true                       # Styles the card here. See homepage for the portfolio site
```

### Categories

| Category | Description |
|---|---|
| `platform` | Infrastructure deployments, CI/CD pipelines, cloud architectures |
| `tool` | Open-source tools, dev environments, utilities |

### Statuses

| Status | Description | Indicator |
|---|---|---|
| `completed` | Finished project | Green dot |
| `in-progress` | Currently being built | Yellow dot |
| `maintained` | Actively maintained | Blue dot |
| `archived` | No longer maintained | Gray dot |

---

## Content Management Workflow

> [!TIP]
> No source code changes needed to add a project. For the full contract for a
> new entry (schema, taxonomy rules, tech ordering), see the
> **[Authoring Guide](./authoring-guide.md)**. For prose and formatting style,
> see the **[Project Card Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/)**.

**1. Edit `data/projects.yaml`** and add a new entry following the schema above.

**2. Regenerate TypeScript data (local dev only):**

```bash
node scripts/generate-projects.js
```

**3. Commit and push:**

```bash
git add data/projects.yaml
git commit -m "feat: add my-new-project"
git push
```

**4. That's it.** The CI pipeline automatically:
- Runs `generate-projects.js` to rebuild `src/data/projects.ts`
- Builds the Vite production bundle
- Deploys to GitHub Pages
- Site is live within ~2 minutes

---

## File Reference

### `data/projects.yaml`
The single source of truth. Contains all project entries in YAML format. Edit this file to add, update, or remove projects.

### `scripts/generate-projects.js`
A Node.js ESM script that reads `data/projects.yaml` and writes a fully-typed `src/data/projects.ts` file. Before writing, it validates every project's `tech` and `tags` against `src/data/taxonomy.ts` and fails the build (naming the project and the offending string) on anything not registered there, the same posture as the per-route `og:url` check in the deploy workflow. The generated file includes:
- A warning comment ("DO NOT EDIT MANUALLY")
- The projects array typed as `Project[]`
- Utility functions: `getAllTechTags`, `getAllCapabilityTags`, `getAllYears`, `getAllStatuses`

### `src/data/taxonomy.ts`
The single source of truth for the tech/tag taxonomy, hand-authored and imported by both `generate-projects.js` (build-time validation) and `toolCategories.ts` (UI grouping). A tool is added to the project the moment it's added here, in one place. Exports:
- `DOMAINS`: the 6 groupings used by the Technologies popover
- `TECH_REGISTRY`: every allowed `tech` string mapped to a `{ domain, showcase }` record. `showcase` is consumed by ibtisam-iq.com to decide what appears on its visible tools page
- `ALLOWED_TAGS`: the closed vocabulary every project's `tags` must draw from

### `scripts/prerender-meta.js`
A Node.js ESM script that runs after `vite build`. The site is client-rendered, so every route serves the same `index.html`; `useCanonical` corrects the tags in the browser, but crawlers that do not execute JavaScript (LinkedIn, Slack, Twitter) read the raw HTML and see the site-root `canonical` and `og:url` on every page.

The script clones `dist/index.html` once per route and rewrites eight tags: `<title>`, `description`, `canonical`, `og:title`, `og:description`, `og:url`, `twitter:title`, and `twitter:description`. Output is `dist/<route>/index.html`, one per project slug plus `/how-i-work`. React still renders the page on the client, unchanged.

Titles come from `metaTitle`, falling back to `title` up to the first `:` or `,`. Descriptions come from the first sentence of `shortDescription`. `og:image` remains site-wide. If a tag pattern stops matching, the build fails rather than emitting a shell with stale metadata.

### `src/types/project.ts`
TypeScript interfaces defining the `Project`, `ProjectSection`, and `ProjectLink` types. All components reference these types.

### `src/data/projects.ts`
**AUTO-GENERATED.** Do not edit manually. This file is the output of `generate-projects.js` and is the data layer consumed by all React components.

### `.github/workflows/pages.yml`
The CI/CD pipeline. Triggers on:
- `push` to `main` (any code or data change)
- `workflow_dispatch` (manual re-runs from the GitHub Actions UI)

---

## Component Architecture

```
App.tsx                        : Router, ScrollToTop wrapper, skip-link
├── hooks/
│   ├── useCanonical.ts        : Keeps <link rel="canonical"> in sync on route change
│   ├── useCountUp.ts          : requestAnimationFrame counter with easeOut curve
│   └── useInView.ts           : IntersectionObserver hook (fires once, respects prefers-reduced-motion)
├── data/
│   └── taxonomy.ts            : Single source of truth for tech domains and the tag vocabulary
├── utils/
│   └── toolCategories.ts      : Groups the tech list into taxonomy.ts domains; computes per-option facet counts
├── components/
│   ├── Navbar.tsx             : Sticky nav, scroll-progress bar, repository link, mobile menu
│   ├── Hero.tsx               : Heading, animated stat counters (projects, tech count), scroll indicator
│   ├── TopFilterBar.tsx       : Owns dropdown state; hosts the desktop filter deck and mobile trigger
│   │   ├── ToolsMegaPopover.tsx   : Technology selector grouped by taxonomy domain (column count adapts to domain count), with in-popover search
│   │   ├── ActiveFilterChips.tsx  : Match count, removable chips, quick presets, reset-all
│   │   └── MobileFilterDrawer.tsx : Full-screen drawer below `lg`, portalled to <body>
│   ├── ProjectCard.tsx        : Card with scroll-triggered reveal, hover lift, staggered tech badges
│   ├── ProjectDetail.tsx      : Full project page with overview paragraphs, dynamic sections, sidebar metadata
│   ├── HowIWork.tsx           : /how-i-work methodology page with SVG pipeline and typewriter terminal
│   └── Footer.tsx             : Social links and external site navigation
```

> [!NOTE]
> There is no theme provider or theme toggle. The site is locked to dark:
> `<html class="dark">` in `index.html`, `color-scheme: dark` and a fixed body
> gradient in `index.css`. `darkMode: 'class'` remains in the Tailwind config
> only so the existing `dark:` variants keep resolving.

### Filter Flow
1. `App.tsx` (`HomePage`) owns all filter state (`useState`) and computes `filteredProjects` via `useMemo`
2. `TopFilterBar` receives that state plus setters, and owns only local UI state (which dropdown is open, whether the mobile drawer is open)
3. It forwards state down to `ToolsMegaPopover`, `ActiveFilterChips` and `MobileFilterDrawer`, so desktop and mobile controls always read and write the same source
4. `calculateProjectCounts` (in `utils/toolCategories.ts`) derives the per-option counts shown beside every filter
5. Matching projects are rendered as `ProjectCard` components

### Why the drawer is portalled
`TopFilterBar`'s root is `relative z-30`, which creates a stacking context. A
`fixed inset-0 z-50` child rendered inside it still cannot rise above the
`z-50` sticky navbar, because its z-index is scoped to the parent context.
`MobileFilterDrawer` therefore renders through `createPortal(..., document.body)`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Styling | Tailwind CSS v4, loaded via `@import "tailwindcss"` + `@config` bridge to `tailwind.config.js`. Locked to dark. |
| Build tool | Vite 8 |
| Routing | React Router v7 |
| Icons | React Icons |
| Fonts | Plus Jakarta Sans (sans), JetBrains Mono (mono), Inter (fallback); Google Fonts |
| Data format | YAML → TypeScript (auto-generated at build time) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Custom domain | `projects.ibtisam-iq.com` (Cloudflare DNS) |

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/ibtisam-iq/projects.git
cd projects

# Install dependencies
npm install

# Generate projects.ts from YAML (run after any YAML changes)
node scripts/generate-projects.js

# Start dev server
npm run dev

# Build for production
npm run build
```

> [!NOTE]
> After editing `data/projects.yaml`, always run `node scripts/generate-projects.js` before starting the dev server. In CI, this step runs automatically.

---

## Local CI Testing (`act`)

The full build pipeline can be tested locally using [`act`](https://github.com/nektos/act):

```bash
act push -W .github/workflows/pages.yml
```

> [!NOTE]
> Artifact upload and GitHub Pages deployment are automatically skipped via `if: ${{ env.ACT != 'true' }}` guards.
