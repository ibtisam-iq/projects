import { useParams, Link } from "react-router-dom"
import { projects } from "@/data/projects"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  FaGithub,
  FaBook,
  FaGlobe,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaPlay,
} from "react-icons/fa"
import { IconType } from "react-icons"

const linkConfig: Record<string, { icon: IconType; label: string }> = {
  github: { icon: FaGithub, label: "View on GitHub" },
  runbook: { icon: FaBook, label: "View Runbook" },
  blog: { icon: FaExternalLinkAlt, label: "Read Blog Post" },
  website: { icon: FaGlobe, label: "Visit Website" },
  playground: { icon: FaPlay, label: "Try It Live" },
}

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  platform: {
    label: "PLATFORM",
    color: "text-purple-300 border-purple-500/60",
    bg: "bg-purple-500/10",
  },
  tool: {
    label: "TOOL",
    color: "text-green-300 border-green-500/60",
    bg: "bg-green-500/10",
  },

}

const statusMeta: Record<string, { label: string; dot: string }> = {
  completed: { label: "Completed", dot: "bg-green-400" },
  "in-progress": { label: "In Progress", dot: "bg-yellow-400" },
  maintained: { label: "Maintained", dot: "bg-blue-400" },
  archived: { label: "Archived", dot: "bg-gray-400" },
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bg text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-xl text-gray-400 mb-6">Project not found.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <FaArrowLeft /> Back to All Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const catMeta = categoryMeta[project.category] || {
    label: project.category.toUpperCase(),
    color: "text-gray-300 border-gray-500/60",
    bg: "bg-gray-500/10",
  }
  const statMeta = statusMeta[project.status] || {
    label: project.status,
    dot: "bg-gray-400",
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-bg to-bg" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition text-sm mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to All Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`text-xs font-bold tracking-wider px-3 py-1 rounded-full border ${catMeta.color} ${catMeta.bg}`}
            >
              {catMeta.label}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className={`w-2 h-2 rounded-full ${statMeta.dot}`} />
              {statMeta.label}
            </span>
            <span className="text-sm text-gray-500">&bull;</span>
            <span className="text-sm text-gray-400">{project.year}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 max-w-4xl">
            {project.title}
          </h1>

          <div className="flex gap-3 flex-wrap">
            {project.links.map((link) => {
              const config = linkConfig[link.type] || {
                icon: FaExternalLinkAlt,
                label: link.type.charAt(0).toUpperCase() + link.type.slice(1),
              }
              const Icon = config.icon
              const isGithub = link.type === "github"
              return (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    isGithub
                      ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                      : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  } text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm`}
                >
                  <Icon /> {config.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full rounded-xl border border-gray-700/50 shadow-2xl"
          />
        )}

        {/* Overview */}
        <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-4">
            Overview
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* Dynamic Sections */}
        {project.sections.map((section, sIdx) => (
          <section key={sIdx}>
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-6">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start bg-gray-800/30 border border-gray-700/40 rounded-lg p-5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <FaCheckCircle className="text-purple-400 text-lg" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Skills & Tech side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.tags && project.tags.length > 0 && (
            <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
              <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-5">
                Skills Demonstrated
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-5">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-700/60 text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-600/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <section className="text-center pt-4 pb-2">
          <div className="inline-flex gap-4 flex-wrap justify-center">
            {project.links.map((link) => {
              const config = linkConfig[link.type] || {
                icon: FaExternalLinkAlt,
                label: link.type.charAt(0).toUpperCase() + link.type.slice(1),
              }
              const Icon = config.icon
              const isGithub = link.type === "github"
              return (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    isGithub
                      ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                      : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  } text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2`}
                >
                  <Icon /> {config.label}
                </a>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ProjectDetail
