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
   * Name for places with room for a few words: a chip, a card heading. `title` runs
   * past 140 characters and `metaTitle` averages 46, so neither fits. Max 28,
   * enforced by the build. Used by the portfolio site, see docs/consumers.md.
   */
  shortName: string
  /**
   * Include on the portfolio site's homepage, which shows a handful, in the order of
   * data/projects.yaml. Not the same as `featured`, which only styles a card here.
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
