# projects.ibtisam-iq.com

> DevOps Projects Portfolio. Kubernetes deployments, AWS infrastructure, CI/CD pipelines, and GitOps workflows. Built from scratch with source code and runbooks.

[![CI/CD](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml)
[![Live Site](https://img.shields.io/badge/live-projects.ibtisam-iq.com-7C3AED)](https://projects.ibtisam-iq.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vite.dev)

---

## Overview

This repository contains the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com). It serves as a filterable, searchable DevOps projects showcase built with **React**, **TypeScript**, and **Tailwind CSS**.

The site is entirely data-driven. Project content lives in [`data/projects.yaml`](./data/projects.yaml), acting as the single source of truth. Any commit modifying that file automatically triggers a rebuild and redeployment of the frontend.

---

## Features

- **Search**: Filters projects by title, short description, or technology.
- **Category filter**: Platform, Tool.
- **Skills filter**: Multi-select capability domain tags (ci-cd, gitops, kubernetes, etc.).
- **Tools filter**: Multi-select tech stack tags.
- **Year filter**: Filters by completion or update year.
- **Status filter**: Completed, In Progress, Maintained, Archived.
- **Detail pages**: Full project page rendering dynamic sections, skills, tech stack, and link buttons.
- **Methodology page**: Dedicated `/how-i-work` section outlining the engineering pipeline.
- **Dark/Light mode**: Theme toggle with system preference detection via `ThemeContext`.
- **Animated stats**: Count-up animations on hero stats using `requestAnimationFrame` with easeOut curve.
- **Scroll reveals**: Cards animate in on scroll via `IntersectionObserver` with staggered delays.
- **Fully responsive**: Mobile sidebar overlay, tablet, desktop.
- **Auto-deploy**: Pushes to `data/projects.yaml` trigger a full rebuild automatically.

---

## Content Management Workflow

> [!NOTE]
> No source code changes are required to add a project.

Projects are managed centrally through [`data/projects.yaml`](./data/projects.yaml), acting as the single source of truth. New entries are appended to this file and are automatically validated, compiled to TypeScript, and deployed via GitHub Actions within approximately 2 minutes upon pushing to the main branch.

For complete schema specifications, field formatting guidelines, and engineering writing conventions, refer to:

- **[Project Card Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/)**: Official authoring guide and writing standards.
- **[Architecture & Schema Reference](./docs/architecture.md#project-schema)**: Internal data pipeline and schema specification.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React 19** + **TypeScript 5.9** |
| Styling | **Tailwind CSS v3** (dark mode via `class` strategy) |
| Build tool | **Vite 7** |
| Routing | **React Router v7** |
| Icons | **React Icons** |
| Fonts | **Inter**, **DM Sans**, **JetBrains Mono** (Google Fonts) |
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
│   │   ├── Navbar.tsx          # Top nav with theme toggle and mobile menu.
│   │   ├── Hero.tsx            # Landing section with animated stat counters and scroll indicator.
│   │   ├── Sidebar.tsx         # Filter panel (search, category, skills, tech, year, status).
│   │   ├── ProjectCard.tsx     # Card with scroll-triggered reveal and hover effects.
│   │   ├── ProjectDetail.tsx   # Full project page with dynamic sections and sidebar metadata.
│   │   ├── HowIWork.tsx        # /how-i-work methodology page.
│   │   └── Footer.tsx
│   ├── context/
│   │   └── ThemeContext.tsx    # Dark/light mode provider with system preference detection.
│   ├── hooks/
│   │   ├── useCountUp.ts       # requestAnimationFrame counter with easeOut curve.
│   │   └── useInView.ts        # IntersectionObserver hook for scroll-triggered animations.
│   ├── data/
│   │   └── projects.ts         # AUTO-GENERATED. Do not edit manually.
│   ├── types/
│   │   └── project.ts          # Project TypeScript interface.
│   ├── App.tsx                 # Router setup, ScrollToTop, ThemeProvider wrapper.
│   ├── main.tsx
│   └── index.css               # Tailwind directives, custom properties, animations.
├── .github/
│   └── workflows/
│       └── pages.yml           # CI/CD pipeline.
├── public/
│   └── (favicon, icons, web manifest)
├── CNAME
├── index.html
├── package.json
├── tailwind.config.js          # Custom colors, fonts, keyframes (bounce-gentle, fade-in).
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

[`docs/architecture.md`](./docs/architecture.md)

---

## Author

**Muhammad Ibtisam**

- [ibtisam-iq.com](https://ibtisam-iq.com)
- [linkedin.com/in/ibtisam-iq](https://linkedin.com/in/ibtisam-iq)
- [github.com/ibtisam-iq](https://github.com/ibtisam-iq)
