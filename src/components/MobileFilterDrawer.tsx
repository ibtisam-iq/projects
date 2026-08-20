import { useState, useMemo, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { getCategorizedTools } from "@/utils/toolCategories"

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
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
  allTools: string[]
  allTags: string[]
  allYears: number[]
  allStatuses: string[]
  filteredCount: number
  totalCount: number
  toolCounts: Record<string, number>
  skillCounts: Record<string, number>
  categoryCounts: Record<string, number>
  clearAll: () => void
}

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
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
  allTools,
  allTags,
  allYears,
  allStatuses,
  filteredCount,
  totalCount,
  toolCounts,
  skillCounts,
  categoryCounts,
  clearAll,
}: MobileFilterDrawerProps) => {
  const [toolSearch, setToolSearch] = useState("")
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [expandedSection, setExpandedSection] = useState<string>("tools")

  const domains = useMemo(() => getCategorizedTools(allTools), [allTools])

  // Lock background scroll, close on Escape, and keep Tab inside the drawer.
  // aria-modal="true" tells assistive tech the rest of the page is inert; without
  // a trap the browser still tabs into it, so the two disagree.
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"

    const FOCUSABLE =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab") return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onClose])

  // Move focus into the drawer when it opens, so Tab starts inside the trap.
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 0)
    return () => clearTimeout(timer)
  }, [isOpen])

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section)
  }

  const filteredDomains = useMemo(() => {
    const q = toolSearch.toLowerCase().trim()
    if (!q) return domains

    return domains
      .map((domain) => ({
        ...domain,
        tools: domain.tools.filter((t) => t.toLowerCase().includes(q)),
      }))
      .filter((domain) => domain.tools.length > 0)
  }, [domains, toolSearch])

  if (!isOpen) return null

  // Portalled to <body> so the drawer is not confined by the filter bar's
  // `relative z-30` stacking context, which would render it under the navbar.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter Projects"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={panelRef}
        className="absolute bottom-0 right-0 top-0 w-full max-w-md animate-slide-in-right bg-[#0a0f1d] shadow-[0_0_40px_rgba(0,0,0,0.95)] flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-light-border/80 p-4 dark:border-border-subtle/80">
          <div>
            <h2 className="text-base font-bold text-light-text dark:text-text-primary">
              Filter Projects
            </h2>
            <p className="text-xs text-light-muted dark:text-text-muted">
              Showing {filteredCount} of {totalCount} projects
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-2 text-light-muted hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Global Search input */}
          <div className="relative">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-text-dim"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-light-border bg-light-surface py-2 pl-9 pr-8 text-sm text-light-text placeholder-light-muted focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-light-muted hover:text-light-text dark:text-text-dim"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <h3 className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-light-muted dark:text-text-dim">
              Category
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "all", label: "All", count: categoryCounts["all"] },
                { id: "platform", label: "Platform", count: categoryCounts["platform"] || 0 },
                { id: "tool", label: "Tool", count: categoryCounts["tool"] || 0 },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "border-teal-accent bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)] font-bold"
                      : "border-light-border bg-light-surface text-light-text hover:bg-light-surface-2 dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] opacity-80 ${selectedCategory === cat.id ? "text-white" : "text-light-muted dark:text-text-dim"}`}>
                    ({cat.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Technologies section */}
          <div className="rounded-xl border border-light-border/80 bg-light-surface p-3.5 dark:border-border-subtle dark:bg-surface-2/40">
            <button
              onClick={() => toggleSection("tools")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🛠️</span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                  Technologies ({allTools.length})
                </span>
                {selectedTech.length > 0 && (
                  <span className="rounded-full bg-teal-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {selectedTech.length}
                  </span>
                )}
              </div>
              {expandedSection === "tools" ? (
                <FiChevronUp size={16} />
              ) : (
                <FiChevronDown size={16} />
              )}
            </button>

            {expandedSection === "tools" && (
              <div className="mt-3 space-y-3 pt-2 border-t border-light-border/40 dark:border-border-subtle/40">
                {/* Search within tools */}
                <div className="relative">
                  <FiSearch
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-text-dim"
                  />
                  <input
                    type="text"
                    placeholder={`Filter ${allTools.length} technologies...`}
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="w-full rounded-md border border-light-border bg-light-surface-2 py-1.5 pl-8 pr-7 text-xs text-light-text placeholder-light-muted focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary"
                  />
                  {toolSearch && (
                    <button
                      onClick={() => setToolSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-light-muted"
                    >
                      <FiX size={12} />
                    </button>
                  )}
                </div>

                {/* Categorized Tools List */}
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                  {filteredDomains.map((domain) => (
                    <div key={domain.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-light-muted dark:text-text-dim uppercase font-mono">
                        <span>
                          {domain.icon} {domain.label}
                        </span>
                        <span>{domain.tools.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {domain.tools.map((tech) => {
                          const isSelected = selectedTech.includes(tech)
                          const count = toolCounts[tech] || 0
                          return (
                            <button
                              key={tech}
                              onClick={() => toggleTech(tech)}
                              className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                                isSelected
                                  ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)] font-bold"
                                  : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted"
                              }`}
                            >
                              <span>{tech}</span>
                              {count > 0 && (
                                <span className={`text-[10px] ${isSelected ? "text-cyan-soft/80" : "text-light-muted/60 dark:text-text-dim"}`}>
                                  ({count})
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills / Capability Domains */}
          <div className="rounded-xl border border-light-border/80 bg-light-surface p-3.5 dark:border-border-subtle dark:bg-surface-2/40">
            <button
              onClick={() => toggleSection("skills")}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                  Capability Skills ({allTags.length})
                </span>
                {selectedTags.length > 0 && (
                  <span className="rounded-full bg-teal-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {selectedTags.length}
                  </span>
                )}
              </div>
              {expandedSection === "skills" ? (
                <FiChevronUp size={16} />
              ) : (
                <FiChevronDown size={16} />
              )}
            </button>

            {expandedSection === "skills" && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-light-border/40 dark:border-border-subtle/40">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  const count = skillCounts[tag] || 0
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                        isSelected
                          ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)] font-bold"
                          : "border border-light-border bg-light-surface text-light-muted hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted"
                      }`}
                    >
                      <span>{tag}</span>
                      {count > 0 && (
                        <span className={`text-[10px] ${isSelected ? "text-cyan-soft/80" : "text-light-muted/60 dark:text-text-dim"}`}>
                          ({count})
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Status & Year. Year collapses to full width while it is hidden. */}
          <div className={`grid gap-3 ${allYears.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-light-muted dark:text-text-dim">
                Status
              </h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-light-border bg-light-surface py-1.5 px-2 text-xs text-light-text focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary capitalize"
              >
                <option value="all">All Statuses</option>
                {allStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className={allYears.length > 1 ? "" : "hidden"}>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-light-muted dark:text-text-dim">
                Year
              </h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-lg border border-light-border bg-light-surface py-1.5 px-2 text-xs text-light-text focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary"
              >
                <option value="all">All Years</option>
                {allYears.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Drawer Footer (Sticky Actions) */}
        <div className="border-t border-light-border/80 bg-light-surface p-4 dark:border-border-subtle dark:bg-surface-1 flex items-center justify-between gap-3">
          <button
            onClick={clearAll}
            className="text-xs font-medium text-light-muted hover:text-red-500 dark:text-text-muted dark:hover:text-red-400"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-teal-accent py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-teal-muted transition-colors"
          >
            Show {filteredCount} Projects
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
