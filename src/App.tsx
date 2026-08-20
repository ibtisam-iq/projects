import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useState, useMemo, type PropsWithChildren } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import { TopFilterBar } from "@/components/TopFilterBar"
import ProjectCard from "@/components/ProjectCard"
import ProjectDetail from "@/components/ProjectDetail"
import HowIWork from "@/components/HowIWork"
import Footer from "@/components/Footer"
import { projects } from "@/data/projects"
import { useCanonical } from "@/hooks/useCanonical"
import { HOME_TITLE } from "@/utils/pageTitle"

const HomePage = () => {
  // Matches <title> in index.html, so returning here by client-side navigation
  // restores the site-root title instead of keeping the previous route's.
  useEffect(() => {
    document.title = HOME_TITLE
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState("all")

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
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

      <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 pt-2">
        {/* Top-Mounted Filter Bar */}
        <TopFilterBar
          projects={projects}
          filteredProjects={filteredProjects}
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
        />

        {/* Project Cards Feed (Full Width, Single Column) */}
        {filteredProjects.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-light-border bg-light-surface py-20 text-center shadow-xs dark:border-border-subtle dark:bg-surface-1">
            <p className="text-lg font-medium text-light-text dark:text-text-primary">
              No projects match your active filters.
            </p>
            <p className="mt-2 text-sm text-light-muted dark:text-text-muted">
              Try adjusting your search criteria or clearing selected technologies.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

const ScrollToTop = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  useCanonical()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])
  return children
}

const App = () => (
  <>
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <Router>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-i-work" element={<HowIWork />} />
          <Route path="/:slug" element={<ProjectDetail />} />
        </Routes>
      </ScrollToTop>
    </Router>
  </>
)

export default App
