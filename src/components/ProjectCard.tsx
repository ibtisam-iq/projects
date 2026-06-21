import { Link } from "react-router-dom"
import { Project } from "@/types/project"
import { FaGithub, FaBook, FaGlobe, FaExternalLinkAlt } from "react-icons/fa"
import { IconType } from "react-icons"

const linkConfig: Record<string, { icon: IconType; label: string; style: string }> = {
  github:  { icon: FaGithub,          label: "GitHub",  style: "bg-purple-600 hover:bg-purple-700" },
  runbook: { icon: FaBook,            label: "Runbook", style: "bg-gray-700 hover:bg-gray-600" },
  blog:    { icon: FaExternalLinkAlt, label: "Blog",    style: "bg-gray-700 hover:bg-gray-600" },
  website: { icon: FaGlobe,           label: "Website", style: "bg-gray-700 hover:bg-gray-600" },
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const categoryColors: Record<string, string> = {
    tool: "text-green-400 border-green-400",
    reference: "text-blue-400 border-blue-400",
    platform: "text-purple-400 border-purple-400",
  }

  const statusColors: Record<string, string> = {
    completed: "bg-green-500",
    "in-progress": "bg-yellow-500",
    maintained: "bg-blue-500",
    archived: "bg-gray-500",
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-gray-700 hover:border-purple-400 transition-all duration-300 flex flex-col h-full">
      {/* Category badge + status dot + year */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[project.category] || "text-gray-400 border-gray-400"}`}
          >
            {project.category.toUpperCase().replace("-", " ")}
          </span>
          <span className="text-xs text-gray-500">{project.year}</span>
        </div>
        <span
          className={`w-3 h-3 rounded-full ${statusColors[project.status] || "bg-gray-500"}`}
          title={project.status}
        />
      </div>

      {/* Title */}
      <Link to={`/project/${project.slug}`}>
        <h3 className="text-2xl font-bold mb-3 hover:text-purple-400 transition">
          {project.title}
        </h3>
      </Link>

      {/* Short description */}
      <p className="text-gray-400 mb-4 flex-grow">
        {project.shortDescription}
      </p>

      {/* Tags (capability domains) */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="bg-purple-900/30 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-800/50"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-800/50">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="bg-gray-700 text-xs px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="bg-gray-700 text-xs px-2 py-1 rounded">
            +{project.tech.length - 5}
          </span>
        )}
      </div>

      {/* Link buttons */}
      <div className="flex gap-2 flex-wrap">
        {project.links.map((link) => {
          const config = linkConfig[link.type] || {
            icon: FaExternalLinkAlt,
            label: link.type.charAt(0).toUpperCase() + link.type.slice(1),
            style: "bg-gray-700 hover:bg-gray-600",
          }
          const Icon = config.icon
          return (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 min-w-0 ${config.style} text-white px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm`}
            >
              <Icon /> {config.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectCard
