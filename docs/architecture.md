# Architecture — projects.ibtisam-iq.com

## Overview

This repository hosts the source code for [projects.ibtisam-iq.com](https://projects.ibtisam-iq.com) — a React + TypeScript + Tailwind CSS portfolio site that showcases DevOps projects.

The site is **data-driven**. Project content is never hardcoded inside the React codebase. Instead, it is maintained in a single YAML file in a separate repository (`silver-ops`) and automatically pulled into this site at build time.

---

## Repository Roles

| Repository | Role | Who edits it |
|---|---|---|
| `ibtisam-iq/silver-ops` | **Data / Content layer** — single source of truth | You (always) |
| `ibtisam-iq/projects` | **Presentation layer** — React app code | Rarely, only for UI changes |

This separation is intentional and follows the same principle as MkDocs-based documentation sites — **content and code are decoupled**. You should never need to touch the React code just to add a new project.

---

## Data Flow

```
┌─────────────────────────────────────┐
│  ibtisam-iq/silver-ops              │
│                                     │
│  data/projects.yaml  ◄── You edit   │
│         │                           │
│  .github/workflows/sync-projects.yml│
│         │ (path filter trigger)     │
└─────────┼───────────────────────────┘
          │
          │  repository_dispatch event
          │  (projects-data-updated)
          ▼
┌─────────────────────────────────────┐
│  ibtisam-iq/projects                │
│                                     │
│  GitHub Actions: deploy.yml         │
│         │                           │
│  1. Checkout code                   │
│  2. npm ci                          │
│  3. Fetch projects.yaml from        │
│     silver-ops via GitHub API       │
│  4. Run generate-projects.js        │
│     → writes src/data/projects.ts   │
│  5. npm run build (Vite)            │
│  6. Deploy to GitHub Pages          │
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
- Every time you add a project, you have to edit TypeScript code — even though you are not changing any UI logic.
- It mixes **content** (what your projects are) with **code** (how they are displayed). These are fundamentally different concerns.
- Non-developers (or your future self) cannot easily update project data without understanding the codebase.

### Solution: YAML as source of truth
YAML is the right format for structured content data because:
- It is human-readable and easy to write.
- It supports lists, nested objects, and multi-line strings natively.
- It is the same format used in Kubernetes manifests, GitHub Actions, Docker Compose — a format you already work with daily.
- It has no TypeScript syntax requirements, no brackets, no commas.

### Why a separate repo (`silver-ops`)?
- `silver-ops` is your **personal ops control plane** — a single place that can drive multiple sites and tools in the future.
- You can add `cv/resume.yaml`, `skills/certifications.yaml`, etc. later, all following the same pattern.
- The projects React app becomes a pure presentation layer — stable, rarely touched.
- Any change to content is a clean, isolated Git commit in `silver-ops` with a clear message like `feat: add terraform-eks project`.

---

## How to Add a New Project

This is the **only workflow you need** going forward:

**1. Open `silver-ops/data/projects.yaml`**

**2. Add a new entry at the bottom:**

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
  blogUrl: "https://blog.ibtisam-iq.com/my-new-project"  # optional
  featured: true                    # true = shown in featured section
```

**3. Commit and push to `main`**

```bash
git add data/projects.yaml
git commit -m "feat: add my-new-project"
git push
```

**4. That's it.** The following happens automatically:
- `sync-projects.yml` in `silver-ops` detects the change to `data/projects.yaml`
- It fires a `repository_dispatch` event to `ibtisam-iq/projects`
- `deploy.yml` in `projects` starts a build
- It fetches the latest `projects.yaml` from `silver-ops`
- `generate-projects.js` converts it to `src/data/projects.ts`
- Vite builds the site
- GitHub Pages deploys the new version
- `projects.ibtisam-iq.com` is live with your new project — usually within 2 minutes

---

## File Reference

### `silver-ops/data/projects.yaml`
The single source of truth. Contains all project entries in YAML format. Edit this file to add, update, or remove projects.

### `silver-ops/.github/workflows/sync-projects.yml`
GitHub Actions workflow in the `silver-ops` repo. Triggers **only** when `data/projects.yaml` changes (path filter). Sends a `repository_dispatch` event to the `projects` repo using the `PROJECTS_PAT` secret.

### `scripts/generate-projects.js`
A Node.js script that runs during the build pipeline. Reads `projects-data.yaml` (downloaded from `silver-ops`) and writes a fully-typed `src/data/projects.ts` file. The generated file includes a warning comment at the top so no one accidentally edits it manually.

### `.github/workflows/deploy.yml`
The main CI/CD pipeline for this repo. Handles three trigger types:
- `push` to `main` — for code/UI changes
- `workflow_dispatch` — for manual re-runs
- `repository_dispatch` (type: `projects-data-updated`) — triggered by `silver-ops` when project data changes

---

## Secrets Required

| Secret Name | Where to add | Purpose |
|---|---|---|
| `PROJECTS_PAT` | `silver-ops` repo secrets | Allows `sync-projects.yml` to send a dispatch event to the `projects` repo |
| `PROJECTS_PAT` | `projects` repo secrets | Allows the build pipeline to fetch `projects.yaml` from the private `silver-ops` repo via GitHub API |

The PAT must have `repo` scope. Generate it at [github.com/settings/tokens](https://github.com/settings/tokens).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build tool | Vite |
| Routing | React Router v7 |
| Icons | React Icons |
| Data format | YAML (via `yaml` npm package) |
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

# For local dev, src/data/projects.ts already exists
# (it is committed as a fallback for local development)
# The YAML pipeline only runs in GitHub Actions

# Start dev server
npm run dev

# Build for production
npm run build
```

> **Note:** The `generate-projects.js` script runs only inside GitHub Actions (it needs the fetched `projects-data.yaml`). For local development, use the existing `src/data/projects.ts` directly.

---

## Future Extensions

Because `silver-ops` is now your content control plane, you can extend this pattern to:

- `cv/resume.yaml` → auto-generate your resume/CV page on `ibtisam-iq.com`
- `skills/certifications.yaml` → auto-populate certifications section on portfolio
- `blog/featured-posts.yaml` → curate featured blog posts across sites

The same `repository_dispatch` pattern applies to all of them.
