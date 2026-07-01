import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Sidebar from "@/components/Sidebar"
import ProjectCard from "@/components/ProjectCard"
import ProjectDetail from "@/components/ProjectDetail"
import HowIWork from "@/components/HowIWork"
import Footer from "@/components/Footer"
import { projects } from "@/data/projects"
import { useState, useMemo, type PropsWithChildren } from "react"
import { FiFilter } from "react-icons/fi"

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeFilterCount = [
    searchQuery !== "",
    selectedCategory !== "all",
    selectedTags.length > 0,
    selectedTech.length > 0,
    selectedStatus !== "all",
    selectedYear !== "all",
  ].filter(Boolean).length

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        project.title.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q) ||
        project.tech.some((tech) => tech.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory
      const matchesTech =
        selectedTech.length === 0 ||
        selectedTech.every((tech) => project.tech.includes(tech))
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => project.tags.includes(t))
      const matchesYear =
        selectedYear === "all" || project.year === Number(selectedYear)
      return (
        matchesSearch &&
        matchesCategory &&
        matchesTech &&
        matchesStatus &&
        matchesTags &&
        matchesYear
      )
    })
  }, [
    searchQuery,
    selectedCategory,
    selectedTech,
    selectedStatus,
    selectedTags,
    selectedYear,
  ])

  return (
    <>
      <Navbar />
      <Hero />

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-4">
        <div className="flex gap-8">
          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTech={selectedTech}
            setSelectedTech={setSelectedTech}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main id="main-content" className="min-w-0 flex-1">
            {/* Mobile filter button + result count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-sm text-light-muted dark:text-text-muted">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "project" : "projects"}
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-light-border bg-light-surface px-4 py-2.5 text-sm font-medium text-light-text transition-colors hover:bg-light-surface-2 dark:border-border-subtle dark:bg-surface-1 dark:text-text-primary dark:hover:bg-surface-2 lg:hidden"
              >
                <FiFilter size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-accent text-[11px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="flex flex-col gap-5">
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-light-muted dark:text-text-muted">
                  No projects match your filters.
                </p>
                <p className="mt-2 text-sm text-light-muted dark:text-text-faint">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  )
}

const ScrollToTop = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])
  return children
}

const App = () => (
  <ThemeProvider>
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <Router>
      <ScrollToTop>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-i-work" element={<HowIWork />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
      </ScrollToTop>
    </Router>
  </ThemeProvider>
)

export default App
