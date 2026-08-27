# Authoring Guide: Adding a Project

This is the contract for writing a new entry in [`data/projects.yaml`](../data/projects.yaml) (the file to hand an LLM, or read yourself, before adding a project). [`docs/architecture.md`](./architecture.md) explains why the pipeline is shaped this way; this file is the checklist for using it correctly. For prose and formatting style (voice, section-writing, STAR-style bullets), see the [Project Card Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/).

---

## Schema

```yaml
- slug: my-project                     # URL-safe identifier (/my-project)
  title: "My Project"                  # Full display name
  metaTitle: "My Project on AWS"       # Optional, ~45-55 chars. <title> and og:title
  category: platform                   # platform | tool
  status: completed                    # completed | in-progress | maintained | archived
  year: 2026
  shortDescription: "Card summary."    # Shown on the project card
  description: "Full overview."        # Shown on the detail page (\n\n between paragraphs)
  sections:
    - title: "Section Heading"
      items:
        - "Bullet point describing what was built and why."
  tags:                                # See "Tags" below
    - ci-cd
    - orchestration
  tech:                                # See "Tech" below. Order matters
    - Docker
    - Terraform
  links:
    - type: github
      url: "https://github.com/..."
  imageUrl: "/images/hero.png"         # Optional
  featured: true
```

Full field reference: [`docs/architecture.md#project-schema`](./architecture.md#project-schema).

---

## Tags

`tags` is the **Skills** facet: the disciplines this project practices (GitOps,
Security, Observability...), not the specific tools. It's a **closed vocabulary**:
every value must already exist in `ALLOWED_TAGS` in
[`src/data/taxonomy.ts`](../src/data/taxonomy.ts). The build fails on anything
outside that list.

- **Using an existing tag?** Just add it.
- **Think the project needs a genuinely new discipline?** Add it to `ALLOWED_TAGS`
  in `taxonomy.ts` first, with a one-line reason. Don't invent one inline in the
  YAML. The whole point of the closed list is that "how many distinct skills does
  this portfolio claim" stays a number you can see at a glance, not something that
  grows by one every time a project is added.

---

## Tech

`tech` is the **Technologies** facet: concrete tools and products. Two rules,
both enforced at build time by `src/data/taxonomy.ts`:

1. **Every string must exist in `TECH_REGISTRY`**, carrying a `domain` (one of the
   6: Cloud & IaC, Containers & Orchestration, CI/CD & GitOps, Security &
   DevSecOps, Observability & Monitoring, Runtimes/Languages/Data) and a
   `showcase` flag. A new tool gets one line added to `TECH_REGISTRY` before it
   can appear in the YAML.
2. **Only list a tool if it was genuinely used to build this project**, not
   merely present somewhere near it. `tech` is treated as a factual claim, not a
   keyword-stuffing surface: don't add a tool to look more comprehensive, and
   don't omit one that was actually part of the build to keep the list short
   (see "Ordering," below, for how to handle a long true list).

   "Genuinely used to build this project" excludes a tool that's only present
   because it happens to be pre-installed in a personal workstation/dev-machine
   image, even if that image is itself a real, shipped part of the project. A
   daily-driver dev machine gets loaded with dozens of CLI tools for general
   convenience; that's a fact about the machine, not a claim about what this
   specific project's engineering work required. Maven belongs in `tech` for a
   project whose build actually runs Maven; it doesn't belong in `tech` for a
   project that merely ships an image with Maven pre-installed for whatever gets
   built on it later. When auditing against a source repo, ask "did this
   project's own work use this tool," not "does this tool exist somewhere in the
   repo."

### Adding a new tool to the registry

Open `src/data/taxonomy.ts`, add one line to `TECH_REGISTRY` under the domain it
belongs to:

```ts
"Flux": { domain: "cicd-gitops", showcase: true },
```

`showcase` decides whether ibtisam-iq.com lists the tool on its visible tools page.
Set it `true` for infrastructure you operate, and `false` for an application-layer
dependency or a convenience CLI (`React`, `pytest`, `AWS CLI`). A `false` entry is
still validated, still counted per project, and still indexed in the portfolio's
keyword block; it simply does not take up space on screen. The field is required, so
a new tool cannot reach the portfolio without that call being made.

Use the exact same string in `data/projects.yaml`. If the same service has two
plausible names (`Route 53` vs. `Amazon Route 53`), pick one and use it
everywhere. A second spelling of an existing tool is exactly what the build
validation exists to catch.

### Ordering tech

**Only the first 8 entries in `tech:` render as chips on the project card.** The
rest of the array is still fully real: it's searchable (the search bar) and
filterable (the Technologies popover, the Skills-equivalent for tools), it just
isn't chip-rendered on the card. This is deliberate: a 15-entry chip wall reads
worse than the 8 that actually define the project, so the card shows a curated
head and the detail page shows everything.

**This means order is not cosmetic. It's the actual selection mechanism for
what a recruiter sees in a 3-second card scan.** Put the tools first that most
define the project, in roughly this priority:

1. The tools the project's own headline/description leads with (if the
   `shortDescription` says "Jenkins, SonarQube, Nexus," those three belong in
   the first 8, not buried at position 12).
2. The most recognizable, highest-signal product names over generic or
   supporting ones (`Kubernetes`/`Amazon EKS`/`Terraform` before `Bash` or a
   base OS), unless the base OS work is itself the differentiator (it was, for
   `silverstack-cicd-platform`'s custom rootfs images; judgment, not a formula).
3. If the project spans multiple languages/frameworks, don't let infrastructure
   tools crowd out every language. A polyglot project should show the
   languages, not just the compute models they ran on.
4. Registry additions and reorders decay over time as new tools get added. If
   you add a 9th tool and it's more representative than something in the
   current top 8, move it up. There's no automated check for this (it's a
   judgment call, not a mechanical property); re-reading the visible 8 against
   the project's own description periodically is the only enforcement.

`VISIBLE_TECH_COUNT` in [`src/components/ProjectCard.tsx`](../src/components/ProjectCard.tsx)
is the single place that number lives. Change it there if 8 stops being right
for the card's width or the dataset's density.

---

## Checklist for a new entry

1. Write `title`, `shortDescription`, `description`, `sections` per the
   [Authoring Standards](https://blog.ibtisam-iq.com/project-card-authoring-standards/).
2. List every tool actually used in `tech`, in priority order (see above). Add
   any new tool to `TECH_REGISTRY` in `taxonomy.ts` first.
3. Pick `tags` from `ALLOWED_TAGS`. Add a new tag to `taxonomy.ts` only if the
   project genuinely introduces a new discipline.
4. Run `npm run generate` (or `npm run build`). It fails loudly, naming the
   project and the offending string, if a `tech` or `tags` value isn't
   registered.
5. Check the card locally (`npm run dev`): do the first 8 tech chips actually
   sell the project in a glance?
