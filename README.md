# projects.ibtisam-iq.com

> DevOps Projects Portfolio — Production-grade deployments, real CI/CD pipelines, and documented infrastructure work.

[![CI/CD](https://github.com/ibtisam-iq/projects/actions/workflows/deploy.yml/badge.svg)](https://github.com/ibtisam-iq/projects/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/live-projects.ibtisam-iq.com-7C3AED)](https://projects.ibtisam-iq.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## What Is This?

This repository contains the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) — a filterable, searchable DevOps projects showcase built with React, TypeScript, and Tailwind CSS.

The site is **data-driven**. Project content lives in a separate repository ([silver-ops](https://github.com/ibtisam-iq/silver-ops)) as a YAML file. Any change to that YAML file automatically triggers a rebuild and redeployment of this site — without touching any code here.

---

## Live Site

🌐 [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com)

---

## Features

- 🔍 **Search** — filter projects by title, description, or technology
- 🗂️ **Category filter** — Open Source, Documentation, Production-grade
- 🏷️ **Technology filter** — multi-select tech stack tags
- ✅ **Status filter** — Completed / In Progress
- 📄 **Detail pages** — full project page with highlights, tech stack, GitHub and blog links
- 📱 **Fully responsive** — mobile, tablet, desktop
- ⚡ **Auto-deploy** — pushes to `silver-ops/data/projects.yaml` trigger a full rebuild automatically

---

## How to Add a New Project

> You never need to edit this repository to add a project.

1. Open [`silver-ops/data/projects.yaml`](https://github.com/ibtisam-iq/silver-ops/blob/main/data/projects.yaml)
2. Add a new YAML entry:

```yaml
- slug: my-new-project
  title: "My New Project"
  category: production-grade        # open-source | documentation | production-grade
  status: completed                 # completed | in-progress
  shortDescription: "One line summary shown on the project card."
  description: "Longer description shown on the project detail page."
  highlights:
    - "Achievement 1 with measurable impact"
    - "Achievement 2 with measurable impact"
  tech:
    - Docker
    - Kubernetes
    - Terraform
  githubUrl: "https://github.com/ibtisam-iq/my-new-project"
  blogUrl: "https://blog.ibtisam-iq.com/my-new-project"   # optional
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
│       └── deploy.yml          # CI/CD pipeline
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

# Start dev server
npm run dev

# Production build
npm run build
```

> The `generate-projects.js` script runs only inside GitHub Actions. For local development, `src/data/projects.ts` is used directly.

---

## CI/CD Pipeline

The pipeline (`.github/workflows/deploy.yml`) handles three triggers:

| Trigger | When |
|---|---|
| `push` to `main` | Code or UI changes pushed directly |
| `workflow_dispatch` | Manual re-run from GitHub Actions UI |
| `repository_dispatch` | Fired automatically by `silver-ops` when `projects.yaml` changes |

Pipeline steps:
1. Checkout code
2. Setup Node.js 20
3. `npm ci`
4. Fetch `projects.yaml` from `silver-ops` via GitHub API
5. Run `generate-projects.js` → writes `src/data/projects.ts`
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
| [`silver-ops`](https://github.com/ibtisam-iq/silver-ops) | Source of truth — `data/projects.yaml` lives here |
| [`portfolio-site`](https://github.com/ibtisam-iq/portfolio-site) | Main portfolio at `ibtisam-iq.com` |
| [`nectar`](https://github.com/ibtisam-iq/nectar) | Technical documentation at `nectar.ibtisam-iq.com` |

---

## Author

**Muhammad Ibtisam**
- 🌐 [ibtisam-iq.com](https://ibtisam-iq.com)
- 💼 [linkedin.com/in/ibtisam-iq](https://linkedin.com/in/ibtisam-iq)
- 🐙 [github.com/ibtisam-iq](https://github.com/ibtisam-iq)
