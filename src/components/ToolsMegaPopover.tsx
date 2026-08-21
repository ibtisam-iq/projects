import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { FiSearch, FiX, FiCheck } from "react-icons/fi"
import { getCategorizedTools } from "@/utils/toolCategories"

// Column count is derived from domain count so the grid stays ~2 rows instead
// of thinning out an uneven last row (6 domains on 4 columns left 4-then-2).
// Add a wider mapping here if DOMAINS in taxonomy.ts ever grows past 8.
const GRID_COLS_BY_DOMAIN_COUNT: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3",
  6: "sm:grid-cols-2 lg:grid-cols-3",
  7: "sm:grid-cols-2 lg:grid-cols-4",
  8: "sm:grid-cols-2 lg:grid-cols-4",
}

interface ToolsMegaPopoverProps {
  isOpen: boolean
  onClose: () => void
  allTools: string[]
  selectedTech: string[]
  setSelectedTech: (tech: string[]) => void
  toolCounts: Record<string, number>
  /** The button that opens this popover. Excluded from the click-outside check
   *  so its own onClick can toggle the popover shut instead of being undone by
   *  a close-then-reopen race on mousedown. */
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

export const ToolsMegaPopover = ({
  isOpen,
  onClose,
  allTools,
  selectedTech,
  setSelectedTech,
  toolCounts,
  triggerRef,
}: ToolsMegaPopoverProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Categorized tool domains
  const domains = useMemo(() => getCategorizedTools(allTools), [allTools])

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setSearchQuery("")
    onClose()
  }, [onClose])

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef?.current?.contains(target)) return
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        handleClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleClose, triggerRef])

  const toggleTool = (tool: string) => {
    setSelectedTech(
      selectedTech.includes(tool)
        ? selectedTech.filter((t) => t !== tool)
        : [...selectedTech, tool],
    )
  }

  // Filter tools within domains based on in-popover search
  const filteredDomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return domains

    return domains
      .map((domain) => ({
        ...domain,
        tools: domain.tools.filter((t) => t.toLowerCase().includes(q)),
      }))
      .filter((domain) => domain.tools.length > 0)
  }, [domains, searchQuery])

  const totalFilteredTools = useMemo(
    () => filteredDomains.reduce((acc, d) => acc + d.tools.length, 0),
    [filteredDomains],
  )

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Filter by tools and technologies"
      className="animate-slide-up absolute left-0 right-0 top-full z-50 mt-2 mx-auto max-w-5xl rounded-[16px] overflow-hidden border border-border-color bg-[#0a0f1d] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]"
    >
      {/* Popover Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-light-border/60 p-4 sm:px-5 sm:py-3.5 dark:border-border-subtle/60">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-text-dim"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Filter ${allTools.length} technologies...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-light-border bg-light-surface-2 py-1.5 pl-9 pr-8 text-[13px] text-light-text placeholder-light-muted focus:border-teal-accent focus:outline-none dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary dark:placeholder-text-dim"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-light-muted hover:text-light-text dark:text-text-dim dark:hover:text-text-muted"
              aria-label="Clear search"
            >
              <FiX size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-[13px]">
          {selectedTech.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-accent">
                {selectedTech.length} selected
              </span>
              <button
                onClick={() => setSelectedTech([])}
                className="font-medium text-light-muted hover:text-red-500 dark:text-text-muted dark:hover:text-red-400 transition-colors"
              >
                Clear tools
              </button>
            </div>
          )}

          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1 rounded-md border border-light-border bg-light-surface-2 px-2.5 py-1 text-[13px] font-medium text-light-text hover:bg-light-border dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary dark:hover:bg-surface-3 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Popover 4-Column Grid */}
      <div className="max-h-[50vh] overflow-y-auto p-3 sm:p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-light-border dark:[&::-webkit-scrollbar-thumb]:bg-border-subtle hover:[&::-webkit-scrollbar-thumb]:bg-light-muted dark:hover:[&::-webkit-scrollbar-thumb]:bg-text-muted">
        {filteredDomains.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-x-6 gap-y-6 ${
              GRID_COLS_BY_DOMAIN_COUNT[domains.length] ?? "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {filteredDomains.map((domain) => (
              <div
                key={domain.id}
                className="flex flex-col"
              >
                {/* Domain Header */}
                <div className="mb-3 flex items-center justify-between border-b border-light-border/40 pb-2 dark:border-border-subtle/40">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{domain.icon}</span>
                    <h4 className="font-mono text-[13px] font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                      {domain.label}
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] text-light-muted dark:text-text-dim">
                    {domain.tools.length}
                  </span>
                </div>

                {/* Tools List */}
                <div className="flex flex-col gap-0.5 overflow-y-auto pr-2 max-h-24 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-light-border/60 dark:[&::-webkit-scrollbar-thumb]:bg-border-subtle/60 hover:[&::-webkit-scrollbar-thumb]:bg-light-muted/80 dark:hover:[&::-webkit-scrollbar-thumb]:bg-text-muted/80">
                  {domain.tools.map((tool) => {
                    const isSelected = selectedTech.includes(tool)
                    const count = toolCounts[tool] || 0

                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition-all ${
                          isSelected
                            ? "bg-teal-accent/15 text-teal-accent font-medium dark:bg-teal-accent/20"
                            : "text-light-text/85 hover:bg-light-surface hover:text-light-text dark:text-text-muted dark:hover:bg-surface-3/80 dark:hover:text-text-primary"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                              isSelected
                                ? "border-cyan bg-cyan-glow text-cyan-soft font-bold shadow-[0_0_16px_-6px_rgba(22,200,236,0.6)]"
                                : "border-light-border bg-light-surface group-hover:border-light-muted dark:border-border-subtle dark:bg-surface-2 dark:group-hover:border-text-muted"
                            }`}
                          >
                            {isSelected && <FiCheck size={10} />}
                          </span>
                          <span className="truncate font-mono text-[11px]">
                            {tool}
                          </span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`font-mono text-[10px] shrink-0 rounded px-1 py-0.5 ${
                              isSelected
                                ? "bg-teal-accent/20 text-teal-accent"
                                : "bg-light-border/40 text-light-muted dark:bg-surface-3 dark:text-text-dim"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-light-muted dark:text-text-muted">
            <p className="text-sm">No tools match "{searchQuery}"</p>
            <p className="mt-1 text-[13px] text-light-muted dark:text-text-dim">
              Try searching for another keyword or clear the search.
            </p>
          </div>
        )}
      </div>

      {/* Popover Footer */}
      <div className="flex items-center justify-between border-t border-light-border/60 bg-light-surface-2/50 px-5 py-2.5 text-[13px] text-light-muted dark:border-border-subtle/60 dark:bg-surface-2/40 dark:text-text-muted">
        <span className="font-mono text-[11px]">
          Showing {totalFilteredTools} of {allTools.length} technologies
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-light-muted/70 dark:text-text-dim">
          Press <kbd className="rounded border border-light-border bg-light-surface px-1 py-0.5 dark:border-border-subtle dark:bg-surface-3">ESC</kbd> to close
        </span>
      </div>
    </div>
  )
}
