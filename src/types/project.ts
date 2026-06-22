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
