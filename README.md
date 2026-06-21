# projects.ibtisam-iq.com

> DevOps Projects Portfolio — Production-grade deployments, real CI/CD pipelines, and documented infrastructure work.

[![CI/CD](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml)
[![Live Site](https://img.shields.io/badge/live-projects.ibtisam-iq.com-7C3AED)](https://projects.ibtisam-iq.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## What Is This?

This repository contains the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) — a filterable, searchable DevOps projects showcase built with React, TypeScript, and Tailwind CSS.

The site is **data-driven**. Project content lives in [`data/projects.yaml`](./data/projects.yaml) — the single source of truth. Any change to that file automatically triggers a rebuild and redeployment of this site.

---

## Live Site

🌐 [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com)

---

## Features

- 🔍 **Search** — filter projects by title, description, or technology
- 🗂️ **Category filter** — Platform, Reference, Tool
- 🏷️ **Skills filter** — multi-select capability domain tags (ci-cd, gitops, kubernetes, etc.)
- 🔧 **Tools filter** — multi-select tech stack tags
- 📅 **Year filter** — filter by completion/update year
- ✅ **Status filter** — Completed / In Progress / Maintained / Archived
- 📄 **Detail pages** — full project page with highlights, skills, tech stack, and link buttons
- 📱 **Fully responsive** — mobile, tablet, desktop
- ⚡ **Auto-deploy** — any push to `data/projects.yaml` triggers a full rebuild automatically

---

## How to Add a New Project

> [!TIP]
> No source code changes needed to add a project.

1. Open [`data/projects.yaml`](./data/projects.yaml) in this repo
2. Add a new YAML entry:

```yaml
- slug: my-new-project
  title: "My New Project"
  category: platform                # platform | tool | reference
  status: completed                 # completed | in-progress | maintained | archived
  year: 2025
  shortDescription: "One line summary shown on the project card."
  description: "Longer description shown on the project detail page."
  highlights:
    - "Achievement 1 with measurable impact"
    - "Achievement 2 with measurable impact"
  tags:
    - ci-cd
    - kubernetes
  tech:
    - Docker
    - Kubernetes
    - Terraform
  links:
    - type: github
      url: "https://github.com/ibtisam-iq/my-new-project"
    - type: runbook                  # optional: runbook | blog | website
      url: "https://runbook.ibtisam-iq.com/my-new-project/"
  featured: true
```

3. Commit and push:

```bash
git add data/projects.yaml
git commit -m "feat: add my-new-project"
git push
```

The site rebuilds and deploys automatically within ~2 minutes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build tool | Vite |
| Routing | React Router v7 |
| Icons | React Icons |
| Data format | YAML → TypeScript (auto-generated at build time) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Custom domain | `projects.ibtisam-iq.com` |

---

## Project Structure

```
projects/
├── data/
│   └── projects.yaml           # Single source of truth — edit this to add/update projects
├── docs/
│   └── architecture.md         # Full architecture and pipeline documentation
├── scripts/
│   └── generate-projects.js    # Converts projects.yaml → src/data/projects.ts
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── projects.ts         # AUTO-GENERATED — do not edit manually
│   ├── types/
│   │   └── project.ts          # Project TypeScript interface
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── pages.yml          # CI/CD pipeline
├── public/
│   └── CNAME
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.app.json
```

---

## Local Development

```bash
# Clone
git clone https://github.com/ibtisam-iq/projects.git
cd projects

# Install dependencies
npm install

# Generate projects.ts from YAML (run after any YAML changes)
node scripts/generate-projects.js

# Start dev server
npm run dev

# Production build
npm run build
```

> [!NOTE]
> After editing `data/projects.yaml`, always run `node scripts/generate-projects.js` to regenerate `src/data/projects.ts` before starting the dev server. In CI, this step runs automatically during the build pipeline.

---

## Local CI Testing (`act`)

The full build pipeline can be run locally using [`act`](https://github.com/nektos/act).

```bash
act push \
  -W .github/workflows/pages.yml
```

> [!NOTE]
> Artifact upload and GitHub Pages deployment are automatically skipped via `if: ${{ env.ACT != 'true' }}` guards — `act` sets this environment variable automatically.

---

## CI/CD Pipeline

The pipeline (`.github/workflows/pages.yml`) handles two triggers:

| Trigger | When |
|---|---|
| `push` to `main` | Any change pushed to the main branch |
| `workflow_dispatch` | Manual re-run from GitHub Actions UI |

Pipeline steps:
1. Checkout code
2. Setup Node.js 24
3. `npm ci`
4. `npm install yaml --no-save`
5. Run `generate-projects.js` → reads `data/projects.yaml`, writes `src/data/projects.ts`
6. `npm run build` (Vite)
7. Add `CNAME` and `404.html`
8. Deploy to GitHub Pages

---

## Architecture

For a detailed explanation of the data pipeline, why it was designed this way, and how to extend it, see:

📄 [`docs/architecture.md`](./docs/architecture.md)

---

## Related Repositories

| Repository | Purpose |
|---|---|
| [`portfolio-site`](https://github.com/ibtisam-iq/portfolio-site) | Main portfolio at `ibtisam-iq.com` |
| [`runbook`](https://github.com/ibtisam-iq/runbook) | Engineering runbook at `runbook.ibtisam-iq.com` |
| [`nectar`](https://github.com/ibtisam-iq/nectar) | Technical documentation at `nectar.ibtisam-iq.com` |

---

## Author

**Muhammad Ibtisam**
- 🌐 [ibtisam-iq.com](https://ibtisam-iq.com)
- 💼 [linkedin.com/in/ibtisam-iq](https://linkedin.com/in/ibtisam-iq)
- 🐙 [github.com/ibtisam-iq](https://github.com/ibtisam-iq)
