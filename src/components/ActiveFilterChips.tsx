import { FiX, FiZap } from "react-icons/fi"

interface ActiveFilterChipsProps {
  totalProjects: number
  filteredCount: number
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  selectedTech: string[]
  setSelectedTech: (tech: string[]) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  selectedYear: string
  setSelectedYear: (year: string) => void
  clearAll: () => void
}

// Picked by real project coverage, not just recognizability. A preset that
// matches one project is a trap, not a shortcut.
const POPULAR_QUICK_PRESETS = [
  "Docker",
  "Kubernetes",
  "Amazon EKS",
  "Terraform",
  "GitHub Actions",
  "Jenkins",
  "Helm",
  "Trivy",
]

export const ActiveFilterChips = ({
  totalProjects,
  filteredCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  selectedTech,
  setSelectedTech,
  selectedStatus,
  setSelectedStatus,
  selectedYear,
  setSelectedYear,
  clearAll,
}: ActiveFilterChipsProps) => {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedTags.length > 0 ||
    selectedTech.length > 0 ||
    selectedStatus !== "all" ||
    selectedYear !== "all"

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const removeTech = (tech: string) => {
    setSelectedTech(selectedTech.filter((t) => t !== tech))
  }

  // Only reachable from the empty state, where selectedTech is always empty.
  const addPresetTech = (tech: string) => {
    setSelectedTech([tech])
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-light-border/40 py-2.5 dark:border-border-subtle/40">
      {/* Left: Match Count & Active Chips or Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-light-muted dark:text-text-muted">
          Showing <span className="font-semibold text-light-text dark:text-text-primary">{filteredCount}</span> of {totalProjects} projects
        </span>

        {hasActiveFilters ? (
          <>
            <span className="text-light-border dark:text-border-subtle">•</span>

            {/* Search Query Chip */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-light-surface-2 px-2.5 py-0.5 text-xs text-light-text border border-light-border dark:bg-surface-2 dark:text-text-primary dark:border-border-subtle">
                Search: <span className="font-mono italic">"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label="Remove search filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}

            {/* Category Chip */}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-light-surface-2 px-2.5 py-0.5 text-xs text-light-text border border-light-border dark:bg-surface-2 dark:text-text-primary dark:border-border-subtle">
                Category: <span className="font-medium capitalize">{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label="Remove category filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}

            {/* Skills Chips */}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-teal-accent/10 px-2.5 py-0.5 text-xs font-medium text-teal-accent border border-teal-accent/20"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label={`Remove ${tag} skill filter`}
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}

            {/* Tech Chips */}
            {selectedTech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-full bg-light-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-light-text border border-light-border dark:bg-surface-2 dark:text-text-primary dark:border-border-subtle"
              >
                {tech}
                <button
                  onClick={() => removeTech(tech)}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label={`Remove ${tech} tech filter`}
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}

            {/* Status Chip */}
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-light-surface-2 px-2.5 py-0.5 text-xs capitalize text-light-text border border-light-border dark:bg-surface-2 dark:text-text-primary dark:border-border-subtle">
                Status: {selectedStatus.replace("-", " ")}
                <button
                  onClick={() => setSelectedStatus("all")}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label="Remove status filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}

            {/* Year Chip */}
            {selectedYear !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-light-surface-2 px-2.5 py-0.5 font-mono text-xs text-light-text border border-light-border dark:bg-surface-2 dark:text-text-primary dark:border-border-subtle">
                Year: {selectedYear}
                <button
                  onClick={() => setSelectedYear("all")}
                  className="rounded p-0.5 hover:text-red-500"
                  aria-label="Remove year filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
          </>
        ) : (
          /* Empty state only: a starting point when nothing is filtered yet.
             Picking one makes hasActiveFilters true, so this row is replaced by
             the chips above and a preset is never rendered in a selected state. */
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 pl-2">
            <span className="flex items-center gap-1 whitespace-nowrap font-mono text-[11px] text-light-muted/70 dark:text-text-dim">
              <FiZap size={11} className="text-teal-accent" />
              Quick filters:
            </span>
            {POPULAR_QUICK_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => addPresetTech(preset)}
                className="whitespace-nowrap rounded-full bg-light-surface-2 px-2 py-0.5 font-mono text-[10px] text-light-muted transition-colors hover:bg-light-border hover:text-light-text dark:bg-surface-2 dark:text-text-muted dark:hover:bg-surface-3 dark:hover:text-text-primary"
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="text-xs font-medium text-teal-accent hover:text-teal-muted dark:hover:text-teal-accent/80 transition-colors shrink-0"
        >
          Reset all filters
        </button>
      )}
    </div>
  )
}
