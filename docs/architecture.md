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
│  3. npm install yaml --no-save      │
│  4. node generate-projects.js       │
│     → writes src/data/projects.ts   │
│  5. npm run build (Vite)            │
│  6. Add CNAME + 404.html            │
│  7. Deploy to GitHub Pages          │
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

Each project in `data/projects.yaml` follows this schema:

```yaml
- slug: my-project                     # URL-safe identifier (/project/<slug>)
  title: "My Project"                  # Display name
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
  tags:                                # Capability domains (recruiter-level)
    - ci-cd
    - kubernetes
  tech:                                # Specific tools and platforms (engineer-level)
    - Docker
    - Terraform
  links:                               # Type + URL pairs
    - type: github                     # github | runbook | blog | website | playground | docs | app-repo | cd-repo
      url: "https://github.com/..."
    - type: runbook
      url: "https://runbook.ibtisam-iq.com/..."
  imageUrl: "/images/hero.png"         # Optional hero image for detail page
  featured: true                       # Pinned to top of the project grid
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
> No source code changes needed to add a project. For complete formatting rules and styling best practices, consult the official **[Project Card Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/)**.

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
A Node.js ESM script that reads `data/projects.yaml` and writes a fully-typed `src/data/projects.ts` file. The generated file includes:
- A warning comment ("DO NOT EDIT MANUALLY")
- The projects array typed as `Project[]`
- Utility functions: `getAllTechTags`, `getAllCapabilityTags`, `getAllYears`

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
App.tsx                    : Router, ScrollToTop, ThemeProvider wrapper
├── context/
│   └── ThemeContext.tsx    : Dark/light mode provider (class strategy on <html>)
├── hooks/
│   ├── useCountUp.ts      : requestAnimationFrame counter with easeOut curve
│   └── useInView.ts       : IntersectionObserver hook (fires once, respects prefers-reduced-motion)
├── components/
│   ├── Navbar.tsx          : Sticky nav with internal links + theme toggle
│   ├── Hero.tsx            : Heading, animated stat counters (projects, tech count), scroll indicator
│   ├── Sidebar.tsx         : Filter panel (search, category, skills, tech, year, status)
│   ├── ProjectCard.tsx     : Card with scroll-triggered reveal, hover lift, staggered tech badges
│   ├── ProjectDetail.tsx   : Full project page with overview paragraphs, dynamic sections, sidebar metadata
│   ├── HowIWork.tsx        : /how-i-work methodology page with SVG pipeline and typewriter terminal
│   └── Footer.tsx          : Social links and external site navigation
```

### Filter Flow
1. `App.tsx` (`HomePage`) manages all filter state (`useState`)
2. `Sidebar` receives state + setters, renders filter controls
3. `filteredProjects` is computed via `useMemo` combining all active filters
4. Matching projects are rendered as `ProjectCard` components

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Styling | Tailwind CSS v3 (dark mode via `class` strategy) |
| Build tool | Vite 7 |
| Routing | React Router v7 |
| Icons | React Icons |
| Fonts | Inter, DM Sans, JetBrains Mono (Google Fonts) |
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
