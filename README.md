# projects.ibtisam-iq.com

> DevOps Projects Portfolio. Kubernetes deployments, AWS infrastructure, CI/CD pipelines, and GitOps workflows. Built from scratch with source code and runbooks.

[![CI/CD](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml/badge.svg)](https://github.com/ibtisam-iq/projects/actions/workflows/pages.yml)
[![Live Site](https://img.shields.io/badge/live-projects.ibtisam--iq.com-7C3AED)](https://projects.ibtisam-iq.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)

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

Projects are managed centrally through [`data/projects.yaml`](./data/projects.yaml), acting as the single source of truth. New entries are appended to this file and are automatically validated, compiled to TypeScript, given a prerendered metadata shell, and deployed via GitHub Actions within approximately 2 minutes upon pushing to the main branch.

Each entry may set an optional `metaTitle` (roughly 45 to 55 characters), used for the page `<title>` and `og:title`. Full `title` values run past what search results and link previews display. When `metaTitle` is omitted, the build falls back to `title` up to the first `:` or `,`, and the meta description falls back to the first sentence of `shortDescription`.

For complete schema specifications, field formatting guidelines, and engineering writing conventions, refer to:

- **[Project Card Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/)**: Official authoring guide and writing standards.
- **[Architecture & Schema Reference](./docs/architecture.md#project-schema)**: Internal data pipeline and schema specification.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React 19** + **TypeScript 5.9** |
| Styling | **Tailwind CSS v4** (dark mode via `class` strategy) |
| Build tool | **Vite 8** |
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
│   ├── generate-projects.js    # Converts projects.yaml to src/data/projects.ts.
│   └── prerender-meta.js       # After the build: per-route shells, 404.html, sitemap.xml, robots.txt.
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
│   │   └── projects.ts         # AUTO-GENERATED from projects.yaml. Gitignored. Do not edit manually.
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

# Generates src/data/projects.ts via the postinstall hook
npm install

npm run dev
npm run build
```

> [!NOTE]
> `src/data/projects.ts` is generated from `data/projects.yaml` and is **not committed** (see `.gitignore`). It is recreated automatically by `postinstall`, `npm run dev`, and `npm run build`, so editing the YAML is the only step required. Run `npm run generate` directly to refresh it without starting a server.

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
| `push` to `main` | Any change pushed to the main branch. Builds and deploys. |
| `pull_request` to `main` | Build only. The deploy job is skipped via `if: github.event_name != 'pull_request'`. |
| `workflow_dispatch` | Manual re-run from GitHub Actions UI. |

Pipeline steps:
1. Checkout code.
2. Setup **Node.js 24**.
3. Run `npm ci`. The `postinstall` hook runs `generate-projects.js`, which reads `data/projects.yaml` and writes `src/data/projects.ts`.
4. Run `npm run build` using **Vite**, then `prerender-meta.js` writes one `dist/<route>/index.html` per route with route-specific `title`, `description`, `canonical`, and Open Graph tags. The same script writes `404.html`, `sitemap.xml` and `robots.txt`.
5. Verify every generated shell carries its own `og:url`. A shell left on the site root fails the build.
6. Add `CNAME`.
7. Deploy to **GitHub Pages**.

`sitemap.xml`, `robots.txt` and `404.html` are generated rather than held in `public/`. Without them the SPA fallback answers `/robots.txt` and `/sitemap.xml` with the app shell, so a crawler asking for the sitemap receives HTML. The sitemap is built from the same route list as the shells, so a project added to `projects.yaml` cannot appear in one without appearing in the other. `404.html` carries its own title, a self-referential canonical and `noindex`, rather than the home page metadata that a copy of `index.html` gives every dead URL.

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
