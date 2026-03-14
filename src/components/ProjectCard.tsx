import { Link } from "react-router-dom"
import { Project } from "@/types/project"
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa"

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const categoryColors: Record<Project["category"], string> = {
    "open-source": "text-green-400 border-green-400",
    documentation: "text-blue-400 border-blue-400",
    "production-grade": "text-purple-400 border-purple-400",
  }

  const statusColors: Record<Project["status"], string> = {
    completed: "bg-green-500",
    "in-progress": "bg-yellow-500",
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-gray-700 hover:border-purple-400 transition-all duration-300 flex flex-col h-full">
      {/* Category badge + status dot */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[project.category]}`}
        >
          {project.category.toUpperCase().replace("-", " ")}
        </span>
        <span
          className={`w-3 h-3 rounded-full ${statusColors[project.status]}`}
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

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <FaGithub /> GitHub
        </a>
        {project.blogUrl && (
          <a
            href={project.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <FaExternalLinkAlt /> Blog
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
