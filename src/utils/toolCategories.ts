import { Project } from "@/types/project"
import { DOMAINS, TECH_REGISTRY, type DomainId } from "@/data/taxonomy"

export interface ToolDomain {
  id: DomainId
  label: string
  icon: string
  description: string
  tools: string[]
}

export const getCategorizedTools = (allTools: string[]): ToolDomain[] => {
  const byDomain: Record<DomainId, string[]> = {
    "cloud-iac": [],
    "containers-orch": [],
    "cicd-gitops": [],
    security: [],
    observability: [],
    "runtimes-data": [],
  }

  allTools.forEach((tool) => {
    // Falls back to the runtime/data bucket for a tool used in the data but
    // not yet registered, rather than dropping it from the popover silently.
    const domainId = TECH_REGISTRY[tool]?.domain ?? "runtimes-data"
    byDomain[domainId].push(tool)
  })

  Object.values(byDomain).forEach((tools) => tools.sort((a, b) => a.localeCompare(b)))

  return DOMAINS.map((domain) => ({
    ...domain,
    tools: byDomain[domain.id],
  }))
}

/**
 * Calculates how many projects match a specific tool, skill, or category
 */
export const calculateProjectCounts = (projectsList: Project[]) => {
  const toolCounts: Record<string, number> = {}
  const skillCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {
    all: projectsList.length,
    platform: 0,
    tool: 0,
  }
  const statusCounts: Record<string, number> = {}
  const yearCounts: Record<string, number> = {}

  projectsList.forEach((p) => {
    // Categories
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++
    } else {
      categoryCounts[p.category] = 1
    }

    // Status
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1

    // Year
    const yr = String(p.year)
    yearCounts[yr] = (yearCounts[yr] || 0) + 1

    // Tools
    p.tech.forEach((t) => {
      toolCounts[t] = (toolCounts[t] || 0) + 1
    })

    // Skills
    p.tags.forEach((s) => {
      skillCounts[s] = (skillCounts[s] || 0) + 1
    })
  })

  return { toolCounts, skillCounts, categoryCounts, statusCounts, yearCounts }
}
