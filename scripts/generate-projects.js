// AUTO-RUNS during GitHub Actions build
// Reads: projects-data.yaml (fetched from silver-ops)
// Writes: src/data/projects.ts

import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'yaml'

const yaml = readFileSync('projects-data.yaml', 'utf8')
const projects = parse(yaml)

const output = `// ================================================================
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Source of truth: ibtisam-iq/silver-ops/data/projects.yaml
// To add/edit a project, update the YAML file in silver-ops repo.
// ================================================================

import type { Project } from "@/types/project"

export const projects: Project[] = ${JSON.stringify(projects, null, 2)}

export const getProjectsByCategory = (category: Project["category"]) =>
  projects.filter((p) => p.category === category)

export const getProjectsByStatus = (status: Project["status"]) =>
  projects.filter((p) => p.status === status)

export const getProjectsByTech = (tech: string) =>
  projects.filter((p) => p.tech.includes(tech))

export const getFeaturedProjects = () =>
  projects.filter((p) => p.featured)

export const getAllTechTags = (): string[] => {
  const techSet = new Set<string>()
  projects.forEach((p) => p.tech.forEach((t: string) => techSet.add(t)))
  return Array.from(techSet).sort()
}
`

writeFileSync('src/data/projects.ts', output)
console.log(`✅ Generated src/data/projects.ts with ${projects.length} projects`)
