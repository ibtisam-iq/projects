export interface ProjectLink {
  type: string
  url: string
}

export interface ProjectSection {
  title: string
  items: string[]
}

export interface Project {
  slug: string
  title: string
  /** Short title for <title> and og:title in the prerendered shell. Optional:
   *  scripts/prerender-meta.js falls back to `title` up to the first : or , */
  metaTitle?: string
  /**
   * The name to use where there is only room for a few words: a chip, a card
   * heading, a cross-reference list. `title` is written for search engines and runs
   * past 140 characters, and even `metaTitle` averages 46, so neither survives that
   * context.
   *
   * Consumed by ibtisam-iq.com for its homepage cards and its tool cross-reference.
   * Required, and capped at 28 characters by the build, so a new project cannot land
   * without a name that fits.
   */
  shortName: string
  /**
   * Show this project among the small curated set on the ibtisam-iq.com homepage.
   * Distinct from `featured`, which is true on every project and only drives a badge
   * on this site's own cards. Homepage order follows the order of data/projects.yaml.
   */
  homepage: boolean
  category: string
  status: string
  year: number
  shortDescription: string
  description: string
  sections: ProjectSection[]
  tags: string[]
  tech: string[]
  links: ProjectLink[]
  imageUrl?: string
  featured: boolean
}
