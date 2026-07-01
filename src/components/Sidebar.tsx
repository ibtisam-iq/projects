import { useEffect } from "react"
import { getAllTechTags, getAllCapabilityTags, getAllYears } from "@/data/projects"
import { FiSearch, FiX } from "react-icons/fi"

interface SidebarProps {
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
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({
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
  isOpen,
  onClose,
}: SidebarProps) => {
  const allTech = getAllTechTags()
  const allTags = getAllCapabilityTags()
  const allYears = getAllYears()

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedTags.length > 0 ||
    selectedTech.length > 0 ||
    selectedStatus !== "all" ||
    selectedYear !== "all"

  const clearAll = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTags([])
    setSelectedTech([])
    setSelectedStatus("all")
    setSelectedYear("all")
  }

  const toggleTech = (tech: string) => {
    setSelectedTech(
      selectedTech.includes(tech)
        ? selectedTech.filter((t) => t !== tech)
        : [...selectedTech, tech],
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    )
  }

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [isOpen, onClose])

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <FiSearch
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-text-faint"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-light-border bg-light-surface py-2 pl-9 pr-8 text-sm text-light-text placeholder-light-muted focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary dark:placeholder-text-faint"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-light-muted hover:text-light-text dark:text-text-faint dark:hover:text-text-muted"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="text-xs font-medium text-teal-accent transition-colors hover:text-teal-muted"
        >
          Clear all filters
        </button>
      )}

      {/* Category */}
      <FilterSection label="Category">
        <div className="flex flex-wrap gap-2">
          {["all", "platform", "tool"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                selectedCategory === cat
                  ? "bg-teal-accent text-white"
                  : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
              }`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Skills */}
      <FilterSection label="Skills">
        <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-teal-accent text-white"
                  : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tools */}
      <FilterSection label="Tools">
        <div className="flex max-h-44 flex-wrap gap-1.5 overflow-y-auto">
          {allTech.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className={`rounded-full px-2.5 py-1 font-mono text-xs transition-colors ${
                selectedTech.includes(tech)
                  ? "bg-teal-accent text-white"
                  : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection label="Year">
        <div className="flex flex-wrap gap-2">
          {["all", ...allYears.map(String)].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                selectedYear === yr
                  ? "bg-teal-accent text-white"
                  : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
              }`}
            >
              {yr === "all" ? "All" : yr}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection label="Status">
        <div className="flex flex-wrap gap-2">
          {["all", "completed", "in-progress", "maintained", "archived"].map(
            (stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors ${
                  selectedStatus === stat
                    ? "bg-teal-accent text-white"
                    : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
                }`}
              >
                {stat === "all" ? "All" : stat.replace("-", " ")}
              </button>
            ),
          )}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block" aria-label="Project filters">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          {filterContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute bottom-0 left-0 top-0 w-80 animate-slide-in-left overflow-y-auto bg-light-bg p-6 dark:bg-surface-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-light-text dark:text-text-primary">
                Filters
              </h2>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="rounded-md p-2 text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-text-primary"
              >
                <FiX size={20} />
              </button>
            </div>
            {filterContent}
          </aside>
        </div>
      )}
    </>
  )
}

const FilterSection = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div>
    <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-light-muted dark:text-text-faint">
      {label}
    </h3>
    {children}
  </div>
)

export default Sidebar
