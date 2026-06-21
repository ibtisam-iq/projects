# Architecture — projects.ibtisam-iq.com

## Overview

This repository hosts the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) — a React + TypeScript + Tailwind CSS portfolio site that showcases DevOps projects.

The site is **data-driven**. Project content lives in [`data/projects.yaml`](../data/projects.yaml) — the single source of truth. A build-time script converts this YAML into a typed TypeScript module consumed by the React app.

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

## Why This Architecture?

### Problem with the naive approach
The simplest approach is to put all project data directly inside `src/data/projects.ts`. This works initially but has serious long-term problems:

- As projects grow (10, 20, 50+), the TypeScript file becomes extremely long and hard to maintain.
- Every time a project is added, TypeScript code has to be edited — even though no UI logic is changing.
- It mixes **content** (what the projects are) with **code** (how they are displayed). These are fundamentally different concerns.

### Solution: YAML as source of truth
YAML is the right format for structured content data because:
- It is human-readable and easy to write.
- It supports lists, nested objects, and multi-line strings natively.
- It is the same format used in Kubernetes manifests, GitHub Actions, Docker Compose — a familiar format in the DevOps world.
- It has no TypeScript syntax requirements, no brackets, no commas.

---

## Project Schema

Each project in `data/projects.yaml` follows this schema:

```yaml
- slug: my-project                     # URL-safe identifier (/project/<slug>)
  title: "My Project"                  # Display name
  category: platform                   # platform | tool | reference
  status: completed                    # completed | in-progress | maintained | archived
  year: 2025                           # Completion or last major update year
  shortDescription: "Card summary."    # One-liner for the project card
  description: "Full description."     # Full paragraph for the detail page
  highlights:                          # Achievements with measurable impact
    - "Achievement 1"
    - "Achievement 2"
  tags:                                # Capability domains (recruiter-level)
    - ci-cd
    - kubernetes
  tech:                                # Specific tools and platforms (engineer-level)
    - Docker
    - Terraform
  links:                               # Type + URL pairs
    - type: github                     # github | runbook | blog | website
      url: "https://github.com/..."
    - type: runbook
      url: "https://runbook.ibtisam-iq.com/..."
  imageUrl: "https://..."              # Optional hero image for detail page
  featured: true                       # Pinned to top of the project grid
```

### Categories

| Category | Description | Color |
|---|---|---|
| `platform` | Production-grade infrastructure deployments | Purple |
| `tool` | Open-source tools, dev environments, utilities | Green |
| `reference` | Documentation sites, runbooks, knowledge bases | Blue |

### Statuses

| Status | Description | Indicator |
|---|---|---|
| `completed` | Finished project | Green dot |
| `in-progress` | Currently being built | Yellow dot |
| `maintained` | Actively maintained | Blue dot |
| `archived` | No longer maintained | Gray dot |

---

## How to Add a New Project

> [!TIP]
> No source code changes needed to add a project.

**1. Edit `data/projects.yaml`** — add a new entry following the schema above.

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
- Utility functions: `getProjectsByCategory`, `getProjectsByStatus`, `getProjectsByTech`, `getFeaturedProjects`, `getAllTechTags`, `getAllCapabilityTags`, `getAllYears`

### `src/types/project.ts`
TypeScript interfaces defining the `Project` and `ProjectLink` types. All components reference these types.

### `src/data/projects.ts`
**AUTO-GENERATED** — do not edit manually. This file is the output of `generate-projects.js` and is the data layer consumed by all React components.

### `.github/workflows/pages.yml`
The CI/CD pipeline. Triggers on:
- `push` to `main` — for any code or data change
- `workflow_dispatch` — for manual re-runs from the GitHub Actions UI

---

## Component Architecture

```
App.tsx
├── Navbar.tsx           — Navigation bar with external links
├── Hero.tsx             — Title, subtitle, and category counters (All / Platform / Reference / Tool)
├── Sidebar.tsx          — Filters: search, category, skills, tools, year, status
├── ProjectCard.tsx      — Card view with category badge, year, tags, tech, and link buttons
├── ProjectDetail.tsx    — Full project page (accessed via /project/<slug>)
└── Footer.tsx           — Social links and quick navigation
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
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build tool | Vite |
| Routing | React Router v7 |
| Icons | React Icons (Font Awesome) |
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
