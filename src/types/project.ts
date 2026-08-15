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
