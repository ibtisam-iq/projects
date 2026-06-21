import { useParams, Link } from "react-router-dom"
import { projects } from "@/data/projects"
import { FaGithub, FaBook, FaGlobe, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa"
import { IconType } from "react-icons"

const linkConfig: Record<string, { icon: IconType; label: string }> = {
  github:  { icon: FaGithub,          label: "View on GitHub" },
  runbook: { icon: FaBook,            label: "View Runbook" },
  blog:    { icon: FaExternalLinkAlt, label: "Read Blog Post" },
  website: { icon: FaGlobe,           label: "Visit Website" },
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/" className="text-purple-400 hover:underline">
            ← Back to All Projects
          </Link>
        </div>
      </div>
    )
  }

  const categoryColors: Record<string, string> = {
    tool: "text-green-400 border-green-400",
    reference: "text-blue-400 border-blue-400",
    platform: "text-purple-400 border-purple-400",
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back + Category chip + Year */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:underline"
          >
            <FaArrowLeft /> Back to All Projects
          </Link>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[project.category] || "text-gray-400 border-gray-400"}`}
          >
            {project.category.toUpperCase().replace("-", " ")}
          </span>

          <span className="text-sm text-gray-500">{project.year}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4">{project.title}</h1>

        {/* Status */}
        <p className="text-gray-400 mb-6">
          Status:{" "}
          <span className="text-purple-400 font-semibold capitalize">
            {project.status.replace("-", " ")}
          </span>
        </p>

        {/* Image */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full rounded-lg border border-gray-700 mb-8"
          />
        )}

        {/* Description */}
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          {project.description}
        </p>

        {/* Highlights */}
        <h2 className="text-3xl font-bold mb-4 text-purple-400">
          DevOps Work &amp; Achievements
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-300 mb-8">
          {project.highlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>

        {/* Tags (capability domains) */}
        {project.tags && project.tags.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Skills Demonstrated
            </h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-900/30 text-purple-300 px-4 py-2 rounded-lg font-semibold border border-purple-800/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Tech */}
        <h2 className="text-3xl font-bold mb-4 text-purple-400">
          Technologies Used
        </h2>
        <div className="flex flex-wrap gap-3 mb-8">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Link buttons */}
        <div className="flex gap-4 flex-wrap">
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
                className={`${isGithub ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 hover:bg-gray-600"} text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2`}
              >
                <Icon /> {config.label}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
