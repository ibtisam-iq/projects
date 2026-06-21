import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Sidebar from "@/components/Sidebar"
import ProjectCard from "@/components/ProjectCard"
import ProjectDetail from "@/components/ProjectDetail"
import Footer from "@/components/Footer"
import { projects } from "@/data/projects"
import { useState, useMemo } from "react"

const HomePage = () => {
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
        matchesSearch && matchesCategory && matchesTech && matchesStatus && matchesTags && matchesYear
      )
    })
  }, [searchQuery, selectedCategory, selectedTech, selectedStatus, selectedTags, selectedYear])

  return (
    <>
      <Navbar />
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
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
            />
          </div>

          {/* Projects grid */}
          <div className="lg:col-span-3">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl">No projects match your filters.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </Router>
  )
}

export default App
