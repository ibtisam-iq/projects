# Consumers

Another repository reads files from this one over raw GitHub, at its build time.
**Changing anything on this page breaks that site's build.** Read this before
restructuring, renaming, or reformatting the files listed here.

The dependency is one way. This repository imports nothing from its consumers, and
nothing here needs to change when they do.

---

## Who reads what

| Consumer | Reads | How |
|---|---|---|
| [`ibtisam-iq/portfolio-site`](https://github.com/ibtisam-iq/portfolio-site) | `data/projects.yaml` | parsed as YAML |
| | `src/data/taxonomy.ts` | **parsed as text with regexes**, not imported |

Both are fetched from `main`:

```
https://raw.githubusercontent.com/ibtisam-iq/projects/main/data/projects.yaml
https://raw.githubusercontent.com/ibtisam-iq/projects/main/src/data/taxonomy.ts
```

A change is live to the consumer as soon as it lands on `main`. There is no version
pin, no release, and no notification.

---

## `data/projects.yaml`

Seven fields per project are read. Renaming or removing any of them breaks the build.

| Field | Used for |
|---|---|
| `slug` | the deep link back to `projects.ibtisam-iq.com/<slug>` |
| `shortName` | every place a project is named: cards, chips, cross-references |
| `homepage` | which projects appear on the portfolio homepage |
| `shortDescription` | card body text |
| `tech` | matching tools to projects, and every per-tool count |
| `featured` | the "all projects" count |
| `title` | error messages only, when a project has no `slug` |

`tags`, `links`, `sections`, `category`, `status`, `year` and `imageUrl` are **not**
read. Adding, renaming, or restructuring those is safe.

---

## `src/data/taxonomy.ts`

This is the fragile one. The consumer **cannot import a TypeScript file from another
repository**, so it fetches the source and matches it with regexes. That makes the
file's textual shape part of the contract, not just its exported values.

Two things are matched:

**`DOMAINS`** entries, on `id` followed by `label` within 120 characters:

```ts
{
  id: "cloud-iac",
  label: "Cloud & Infrastructure as Code",
```

**`TECH_REGISTRY`** entries, one per line, from the identifier `TECH_REGISTRY` to the
first line that begins with `}`:

```ts
"Amazon EKS": { domain: "containers-orch", showcase: true },
Terraform: { domain: "cloud-iac", showcase: true },
```

Each was tested against the consumer's actual regex.

### What breaks it

- Splitting an entry across multiple lines
- Reordering the keys to `{ showcase, domain }`
- Single quotes, or a trailing comma inside the braces
- **Adding a third field to `TechMeta`**, in either position. The match expects
  `domain` then `showcase` and nothing else between the braces
- Putting more than 120 characters between a domain's `id` and its `label`
- Renaming `TECH_REGISTRY` or `DOMAINS`
- Running Prettier with settings that rewrap these blocks

### What is safe

- Adding, removing, or editing entries
- Comments, including a trailing `// note` on the same line
- Blank lines and ordering between entries

The consumer fails loudly rather than silently when a match returns nothing, so a
mistake here shows up as a red build there, not as a wrong page.

---

## Changing something on this page

1. Make the change here on a branch.
2. Clone `portfolio-site` beside this repo and run its build. It prefers a local
   sibling over the network, so it picks up the change before it is pushed.
3. Only then merge to `main`.

Skipping step 2 means the consumer's next build is the first thing to find out.

---

## Why this file exists

An agent or a contributor refactoring this repository sees a self-contained project and
has no way to know that another site depends on the exact spelling of a field and the
exact line shape of a TypeScript literal. A green build here is not proof that nothing
downstream broke.
