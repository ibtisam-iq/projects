// AUTO-RUNS during GitHub Actions build
// Reads: data/projects.yaml (in this repo)
// Writes: src/data/projects.ts

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parse } from 'yaml'

const yaml = readFileSync('data/projects.yaml', 'utf8')
const projects = parse(yaml)

projects.forEach((p) => {
  if (typeof p.description === 'string') {
    p.description = p.description.replace(/\r?\n+/g, '\n\n')
  }
})

const output = `// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source of truth: data/projects.yaml (in this repo)
// To add/edit a project, update data/projects.yaml and push.
// ================================================================

import type { Project } from "@/types/project"

export const projects: Project[] = ${JSON.stringify(projects, null, 2)}

export const getAllTechTags = (): string[] => {
  const techSet = new Set<string>()
  projects.forEach((p) => p.tech.forEach((t: string) => techSet.add(t)))
  return Array.from(techSet).sort()
}

export const getAllCapabilityTags = (): string[] => {
  const tagSet = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export const getAllYears = (): number[] => {
  const yearSet = new Set<number>()
  projects.forEach((p) => yearSet.add(p.year))
  return Array.from(yearSet).sort((a, b) => b - a)
}
`

// src/data/ holds only this generated file, so it does not exist in a fresh
// clone (git tracks no empty directories). Create it before writing.
mkdirSync('src/data', { recursive: true })
writeFileSync('src/data/projects.ts', output)
console.log(`✅ Generated src/data/projects.ts with ${projects.length} projects`)
