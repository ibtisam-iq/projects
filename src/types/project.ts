export interface Project {
  slug: string
  title: string
  category: "open-source" | "documentation" | "production-grade"
  status: "completed" | "in-progress"
  shortDescription: string
  description: string
  highlights: string[]
  tech: string[]
  githubUrl: string
  blogUrl?: string
  imageUrl?: string
  featured: boolean
}
