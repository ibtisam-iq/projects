import { useState, useEffect, useRef, useMemo } from "react"
import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiCheck,
  FiSliders,
  FiLayers,
  FiCpu,
  FiActivity,
  FiCalendar,
} from "react-icons/fi"
import { ToolsMegaPopover } from "./ToolsMegaPopover"
import { ActiveFilterChips } from "./ActiveFilterChips"
import { MobileFilterDrawer } from "./MobileFilterDrawer"
import {
  getAllTechTags,
  getAllCapabilityTags,
  getAllYears,
  getAllStatuses,
} from "@/data/projects"
import { calculateProjectCounts } from "@/utils/toolCategories"
import { Project } from "@/types/project"

interface TopFilterBarProps {
  projects: Project[]
  filteredProjects: Project[]
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
}

export const TopFilterBar = ({
  projects,
  filteredProjects,
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
}: TopFilterBarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const toolsTriggerRef = useRef<HTMLButtonElement>(null)

  const allTools = useMemo(() => getAllTechTags(), [])
  const allTags = useMemo(() => getAllCapabilityTags(), [])
  const allYears = useMemo(() => getAllYears(), [])
  const allStatuses = useMemo(() => getAllStatuses(), [])

  // A single-value facet cannot narrow anything, so the control is hidden until
  // the data actually spans more than one year.
  const showYearFilter = allYears.length > 1

  // Calculate project counts for each filter option
  const {
    toolCounts,
    skillCounts,
    categoryCounts,
    statusCounts,
    yearCounts,
  } = useMemo(() => calculateProjectCounts(projects), [projects])

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedTags.length > 0,
    selectedTech.length > 0,
    selectedStatus !== "all",
    selectedYear !== "all",
  ].filter(Boolean).length

  const clearAll = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTags([])
    setSelectedTech([])
    setSelectedStatus("all")
    setSelectedYear("all")
    setActiveDropdown(null)
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    )
  }

  // ⌘K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close dropdown on click outside
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative z-30 mb-6">
      {/* Main Filter Command Bar Container */}
      <div className="rounded-[16px] border border-border-color bg-surface-1 p-4 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-[12px]">
        {/* Tier 1: Primary Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Search input */}
          <div className="relative flex-1 lg:max-w-xs">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-text-dim"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-light-border bg-light-surface-2 py-2 pl-9 pr-14 text-[13px] text-light-text placeholder-light-muted focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary dark:placeholder-text-dim"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded p-0.5 text-light-muted hover:text-light-text dark:text-text-dim dark:hover:text-text-muted"
                  aria-label="Clear search"
                >
                  <FiX size={12} />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block rounded border border-light-border bg-light-surface px-1.5 py-0.5 font-mono text-[9px] text-light-muted dark:border-border-subtle dark:bg-surface-3 dark:text-text-dim">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Desktop Controls (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {/* Category Segmented Switch */}
            <div className="flex items-center rounded-lg border border-light-border bg-light-surface-2 p-0.5 dark:border-border-subtle dark:bg-surface-2">
              {[
                { id: "all", label: "All", count: categoryCounts["all"] },
                {
                  id: "platform",
                  label: "Platforms",
                  count: categoryCounts["platform"] || 0,
                },
                {
                  id: "tool",
                  label: "Tools",
                  count: categoryCounts["tool"] || 0,
                },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[13px] transition-all ${
                      isActive
                        ? "bg-teal-accent text-white shadow-xs font-semibold"
                        : "text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-text-primary"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] ${
                        isActive
                          ? "text-white/80"
                          : "text-light-muted/70 dark:text-text-dim"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <span className="text-light-border dark:text-border-subtle">|</span>

            {/* Dropdown 1: Skills */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("skills")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTags.length > 0
                    ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                    : activeDropdown === "skills"
                    ? "border-teal-accent bg-light-surface-2 text-light-text dark:border-teal-accent dark:bg-surface-2 dark:text-text-primary"
                    : "border-light-border bg-light-surface-2 text-light-text hover:bg-light-surface hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:bg-surface-3 dark:hover:text-text-primary"
                }`}
              >
                <FiLayers size={13} className="text-teal-accent" />
                <span>Skills</span>
                {selectedTags.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-accent px-1 text-[10px] font-bold text-white">
                    {selectedTags.length}
                  </span>
                )}
                <FiChevronDown
                  size={13}
                  className={`transition-transform ${
                    activeDropdown === "skills" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Skills Popover */}
              {activeDropdown === "skills" && (
                <div className="animate-slide-up absolute left-0 top-full z-50 mt-1.5 w-72 rounded-[16px] border border-border-color bg-[#0a0f1d] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]">
                  <div className="mb-2 flex items-center justify-between border-b border-light-border/60 pb-2 dark:border-border-subtle/60">
                    <span className="font-mono text-[13px] font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                      Capability Skills
                    </span>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-[11px] text-teal-accent hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {/* Matches ToolsMegaPopover's per-column max-h-24 so the two
                      dropdowns read as one consistent, shrunk design language. */}
                  <div className="max-h-24 overflow-y-auto pr-1 flex flex-col gap-1">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      const count = skillCounts[tag] || 0
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`flex items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                            isSelected
                              ? "bg-teal-accent/15 text-teal-accent font-medium"
                              : "text-light-text hover:bg-light-surface-2 dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                                isSelected
                                  ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                                  : "border-light-border bg-light-surface dark:border-border-subtle dark:bg-surface-2"
                              }`}
                            >
                              {isSelected && <FiCheck size={10} />}
                            </span>
                            <span>{tag}</span>
                          </div>
                          {count > 0 && (
                            <span className="font-mono text-[10px] text-light-muted dark:text-text-dim">
                              {count}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: 4-Column Tools Mega-Popover Trigger */}
            <div className="relative">
              <button
                ref={toolsTriggerRef}
                onClick={() => toggleDropdown("tools")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTech.length > 0
                    ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                    : activeDropdown === "tools"
                    ? "border-teal-accent bg-light-surface-2 text-light-text dark:border-teal-accent dark:bg-surface-2 dark:text-text-primary"
                    : "border-light-border bg-light-surface-2 text-light-text hover:bg-light-surface hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:bg-surface-3 dark:hover:text-text-primary"
                }`}
              >
                <FiCpu size={13} className="text-teal-accent" />
                <span>Technologies ({allTools.length})</span>
                {selectedTech.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-accent px-1 text-[10px] font-bold text-white">
                    {selectedTech.length}
                  </span>
                )}
                <FiChevronDown
                  size={13}
                  className={`transition-transform ${
                    activeDropdown === "tools" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dropdown 3: Status */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("status")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  selectedStatus !== "all"
                    ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                    : activeDropdown === "status"
                    ? "border-teal-accent bg-light-surface-2 text-light-text dark:border-teal-accent dark:bg-surface-2 dark:text-text-primary"
                    : "border-light-border bg-light-surface-2 text-light-text hover:bg-light-surface hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:bg-surface-3 dark:hover:text-text-primary"
                }`}
              >
                <FiActivity size={13} className="text-teal-accent" />
                <span>
                  {selectedStatus === "all"
                    ? "Status"
                    : selectedStatus.charAt(0).toUpperCase() +
                      selectedStatus.slice(1).replace("-", " ")}
                </span>
                <FiChevronDown
                  size={13}
                  className={`transition-transform ${
                    activeDropdown === "status" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "status" && (
                <div className="animate-slide-up absolute right-0 top-full z-50 mt-1.5 w-48 rounded-[16px] border border-border-color bg-[#0a0f1d] p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]">
                  {["all", ...allStatuses].map(
                    (stat) => {
                      const isSelected = selectedStatus === stat
                      const count =
                        stat === "all"
                          ? projects.length
                          : statusCounts[stat] || 0
                      return (
                        <button
                          key={stat}
                          onClick={() => {
                            setSelectedStatus(stat)
                            setActiveDropdown(null)
                          }}
                          className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13px] capitalize transition-colors ${
                            isSelected
                              ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)] font-bold"
                              : "text-light-text hover:bg-light-surface-2 dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary"
                          }`}
                        >
                          <span>{stat === "all" ? "All Statuses" : stat.replace("-", " ")}</span>
                          <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-light-muted dark:text-text-dim"}`}>
                            ({count})
                          </span>
                        </button>
                      )
                    },
                  )}
                </div>
              )}
            </div>

            {/* Dropdown 4: Year. Hidden while every project shares one year. */}
            <div className={`relative ${showYearFilter ? "" : "hidden"}`}>
              <button
                onClick={() => toggleDropdown("year")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  selectedYear !== "all"
                    ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                    : activeDropdown === "year"
                    ? "border-teal-accent bg-light-surface-2 text-light-text dark:border-teal-accent dark:bg-surface-2 dark:text-text-primary"
                    : "border-light-border bg-light-surface-2 text-light-text hover:bg-light-surface hover:text-light-text dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted dark:hover:bg-surface-3 dark:hover:text-text-primary"
                }`}
              >
                <FiCalendar size={13} className="text-teal-accent" />
                <span>{selectedYear === "all" ? "Year" : selectedYear}</span>
                <FiChevronDown
                  size={13}
                  className={`transition-transform ${
                    activeDropdown === "year" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "year" && (
                <div className="animate-slide-up absolute right-0 top-full z-50 mt-1.5 w-36 rounded-[16px] border border-border-color bg-[#0a0f1d] p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]">
                  {["all", ...allYears.map(String)].map((yr) => {
                    const isSelected = selectedYear === yr
                    const count =
                      yr === "all" ? projects.length : yearCounts[yr] || 0
                    return (
                      <button
                        key={yr}
                        onClick={() => {
                          setSelectedYear(yr)
                          setActiveDropdown(null)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                          isSelected
                            ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)] font-bold"
                            : "text-light-text hover:bg-light-surface-2 dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary"
                        }`}
                      >
                        <span>{yr === "all" ? "All Years" : yr}</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-light-muted dark:text-text-dim"}`}>
                          ({count})
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="flex lg:hidden items-center justify-between pt-1">
            <span className="font-mono text-[13px] text-light-muted dark:text-text-muted">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </span>

            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-light-border bg-light-surface-2 px-3.5 py-2 text-[13px] font-semibold text-light-text transition-colors hover:bg-light-border dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary"
            >
              <FiSliders size={14} className="text-teal-accent" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-accent px-1 text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4-Column Tools Mega-Popover */}
        <ToolsMegaPopover
          isOpen={activeDropdown === "tools"}
          onClose={() => setActiveDropdown(null)}
          allTools={allTools}
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
          toolCounts={toolCounts}
          triggerRef={toolsTriggerRef}
        />

        {/* Tier 2: Active Filter Chips & Match Count */}
        <ActiveFilterChips
          totalProjects={projects.length}
          filteredCount={filteredProjects.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          clearAll={clearAll}
        />
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedTech={selectedTech}
        setSelectedTech={setSelectedTech}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        allTools={allTools}
        allTags={allTags}
        allYears={allYears}
        allStatuses={allStatuses}
        filteredCount={filteredProjects.length}
        totalCount={projects.length}
        toolCounts={toolCounts}
        skillCounts={skillCounts}
        categoryCounts={categoryCounts}
        clearAll={clearAll}
      />
    </div>
  )
}
