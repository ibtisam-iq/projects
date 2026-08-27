// AUTO-RUNS during GitHub Actions build
// Reads: data/projects.yaml (in this repo)
// Writes: src/data/projects.ts

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { parse } from 'yaml'
import { TECH_REGISTRY, ALLOWED_TAGS } from '../src/data/taxonomy.ts'

const yaml = readFileSync('data/projects.yaml', 'utf8')
const projects = parse(yaml)

projects.forEach((p) => {
  if (typeof p.description === 'string') {
    p.description = p.description.replace(/\r?\n+/g, '\n\n')
  }
})

// Catches a typo or a near-duplicate (e.g. "Route 53" vs "Amazon Route 53")
// before it ships as two filter options that should have been one.
const allowedTagSet = new Set(ALLOWED_TAGS)
const errors = []

// shortName is what consumers put in a chip or a card heading, so it is validated
// here rather than left for them to discover. Capping the length is the point: an
// unbounded one would simply move the overflow problem downstream.
const SHORT_NAME_MAX = 28

projects.forEach((p) => {
  if (typeof p.shortName !== 'string' || p.shortName.trim() === '') {
    errors.push(`${p.slug}: shortName is required, a few words for a chip or card heading`)
  } else if (p.shortName.length > SHORT_NAME_MAX) {
    errors.push(
      `${p.slug}: shortName is ${p.shortName.length} chars, over the ${SHORT_NAME_MAX} cap ("${p.shortName}")`
    )
  }
  if (typeof p.homepage !== 'boolean') {
    errors.push(`${p.slug}: homepage must be true or false`)
  }
  p.tech.forEach((t) => {
    if (!(t in TECH_REGISTRY)) {
      errors.push(`${p.slug}: tech "${t}" is not in src/data/taxonomy.ts TECH_REGISTRY`)
    }
  })
  p.tags.forEach((t) => {
    if (!allowedTagSet.has(t)) {
      errors.push(`${p.slug}: tag "${t}" is not in src/data/taxonomy.ts ALLOWED_TAGS`)
    }
  })
})
if (errors.length > 0) {
  console.error('❌ Validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'))
  process.exit(1)
}

// A consumer that filters on `homepage` renders nothing if every project is false.
// Better to stop here than to ship an empty section on another site.
if (!projects.some((p) => p.homepage === true)) {
  console.error('❌ No project has homepage: true. ibtisam-iq.com would show no cards.')
  process.exit(1)
}

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

// Derived from the data, never hardcoded: a filter option that matches zero
// projects is a dead end, and the schema allows statuses this list has not
// seen yet.
export const getAllStatuses = (): string[] => {
  const statusSet = new Set<string>()
  projects.forEach((p) => statusSet.add(p.status))
  return Array.from(statusSet).sort()
}
`

// src/data/ holds only this generated file, so it does not exist in a fresh
// clone (git tracks no empty directories). Create it before writing.
mkdirSync('src/data', { recursive: true })
writeFileSync('src/data/projects.ts', output)
console.log(`✅ Generated src/data/projects.ts with ${projects.length} projects`)
