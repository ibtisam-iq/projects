# projects.ibtisam-iq.com

> DevOps Projects Portfolio. Production-grade deployments, real CI/CD pipelines, and documented infrastructure work.

[![CI/CD](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml)
[![Live Site](https://img.shields.io/badge/live-projects.ibtisam-iq.com-7C3AED)](https://projects.ibtisam-iq.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## What Is This?

This repository contains the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com). It serves as a filterable, searchable DevOps projects showcase built with **React**, **TypeScript**, and **Tailwind CSS**.

The site is entirely data-driven. Project content lives in [`data/projects.yaml`](./data/projects.yaml), acting as the single source of truth. Any commit modifying that file automatically triggers a rebuild and redeployment of the frontend.

---

## Live Site

🌐 [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com)

---

## Features

- 🔍 **Search**: Filters projects by title, short description, or technology.
- 🗂️ **Category filter**: Platform, Tool.
- 🏷️ **Skills filter**: Multi-select capability domain tags (ci-cd, gitops, kubernetes, etc.).
- 🔧 **Tools filter**: Multi-select tech stack tags.
- 📅 **Year filter**: Filters by completion or update year.
- ✅ **Status filter**: Completed, In Progress, Maintained, Archived.
- 📄 **Detail pages**: Full project page rendering dynamic sections, skills, tech stack, and link buttons.
- 🛠️ **Methodology page**: Dedicated `/how-i-work` section outlining the engineering pipeline.
- 📱 **Fully responsive**: Mobile, tablet, desktop.
- ⚡ **Auto-deploy**: Pushes to `data/projects.yaml` trigger a full rebuild automatically.

---

## How to Add a New Project

> [!NOTE]
> No source code changes are required to add a project.

Projects are added by editing [`data/projects.yaml`](./data/projects.yaml) in this repository. New projects are appended as YAML entries following the specified schema:

```yaml
- slug: my-new-project
  title: "My New Project"
  category: platform                # platform | tool
  status: completed                 # completed | in-progress | maintained | archived
  year: 2026
  shortDescription: "One line summary shown on the project card."
  description: "Longer description shown on the project detail page."
  sections:                         # Flexible content blocks
    - title: "Key Achievements"
      items:
        - "Achievement 1 with measurable impact"
        - "Achievement 2 with measurable impact"
    - title: "Architecture"
      items:
        - "Designed a modular architecture..."
  tags:                             # capability domains (recruiter-level)
    - ci-cd
    - kubernetes
  tech:                             # specific tools (engineer-level)
    - Docker
    - Kubernetes
    - Terraform
  links:                            # type + url pairs: github, runbook, blog, website, playground, docs, etc.
    - type: github
      url: "https://github.com/ibtisam-iq/my-new-project"
    - type: runbook                  
      url: "https://runbook.ibtisam-iq.com/my-new-project/"
  imageUrl: "/images/hero.png"      # optional
  featured: true                    # pinned to top
```

The site rebuilds and deploys automatically within approximately 2 minutes upon pushing the commit.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v3** |
| Build tool | **Vite** |
| Routing | **React Router v7** |
| Icons | **React Icons** |
| Data format | YAML to TypeScript (auto-generated at build time) |
| Hosting | **GitHub Pages** |
| CI/CD | **GitHub Actions** |
| Custom domain | `projects.ibtisam-iq.com` |

---

## Project Structure

```text
projects/
├── data/
│   └── projects.yaml           # Single source of truth. Modified to add or update projects.
├── docs/
│   └── architecture.md         # Full architecture and pipeline documentation.
├── scripts/
│   └── generate-projects.js    # Converts projects.yaml to src/data/projects.ts.
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── HowIWork.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── projects.ts         # AUTO-GENERATED. Do not edit manually.
│   ├── types/
│   │   └── project.ts          # Project TypeScript interface.
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── pages.yml          # CI/CD pipeline.
├── public/
│   └── (favicon, icons, web manifest)
├── CNAME
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.app.json
```

---

## Local Development

```bash
git clone https://github.com/ibtisam-iq/projects.git
cd projects

npm install

# Generate projects.ts from YAML (run after any YAML changes)
node scripts/generate-projects.js

npm run dev
npm run build
```

> [!NOTE]
> The generated TypeScript code must be updated after editing `data/projects.yaml` by executing `node scripts/generate-projects.js`. This step executes automatically within the CI build pipeline.

---

## Local CI Testing (`act`)

The full build pipeline can be verified locally using [`act`](https://github.com/nektos/act).

```bash
act push \
  -W .github/workflows/pages.yml
```

> [!NOTE]
> Artifact upload and GitHub Pages deployment are automatically skipped via `if: ${{ env.ACT != 'true' }}` guards. The `act` utility configures this environment variable automatically.

---

## CI/CD Pipeline

The pipeline (`.github/workflows/pages.yml`) handles two triggers:

| Trigger | When |
|---|---|
| `push` to `main` | Any change pushed to the main branch. |
| `workflow_dispatch` | Manual re-run from GitHub Actions UI. |

Pipeline steps:
1. Checkout code.
2. Setup **Node.js 24**.
3. Run `npm ci`.
4. Run `npm install yaml --no-save`.
5. Run `generate-projects.js`. This reads `data/projects.yaml` and writes `src/data/projects.ts`.
6. Run `npm run build` using **Vite**.
7. Add `CNAME` and `404.html`.
8. Deploy to **GitHub Pages**.

---

## Architecture

For a detailed explanation of the data pipeline, the design constraints, and extension points, see the documentation:

📄 [`docs/architecture.md`](./docs/architecture.md)

---

## Related Repositories

| Repository | Purpose |
|---|---|
| [`portfolio-site`](https://github.com/ibtisam-iq/portfolio-site) | Main portfolio at `ibtisam-iq.com`. |
| [`runbook`](https://github.com/ibtisam-iq/runbook) | Engineering runbook at `runbook.ibtisam-iq.com`. |
| [`nectar`](https://github.com/ibtisam-iq/nectar) | Technical documentation at `nectar.ibtisam-iq.com`. |

---

## Author

**Muhammad Ibtisam**
- 🌐 [ibtisam-iq.com](https://ibtisam-iq.com)
- 💼 [linkedin.com/in/ibtisam-iq](https://linkedin.com/in/ibtisam-iq)
- 🐙 [github.com/ibtisam-iq](https://github.com/ibtisam-iq)
