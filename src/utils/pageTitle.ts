import { Project } from "@/types/project"

/**
 * Client-side mirror of the title logic in `scripts/prerender-meta.js`.
 *
 * The prerendered shell and the hydrated SPA must agree, or a crawler that runs
 * JavaScript sees a different <title> than one that does not, and the browser
 * tab disagrees with the search result. Both sides derive the title the same
 * way: `metaTitle` when set, otherwise the full title up to the first `:` or
 * `,`, then the shared brand suffix.
 *
 * Keep this file and `titleFor`/`SUFFIX` in prerender-meta.js in step.
 */
export const TITLE_SUFFIX = " | Muhammad Ibtisam Iqbal"

/** Matches `titleFor` in scripts/prerender-meta.js. */
export const projectTitle = (project: Project): string =>
  (project.metaTitle?.trim() || project.title.split(/[:,]/)[0].trim()) +
  TITLE_SUFFIX

/** Title for a non-project route, e.g. "How I Work". */
export const pageTitle = (name: string): string => name + TITLE_SUFFIX

/** The site-root title, matching <title> in index.html. */
export const HOME_TITLE = "Projects" + TITLE_SUFFIX
