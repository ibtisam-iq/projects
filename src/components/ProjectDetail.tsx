import { useParams, Link } from "react-router-dom"
import { projects } from "@/data/projects"
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa"

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

  const categoryColors = {
    "open-source": "text-green-400 border-green-400",
    documentation: "text-blue-400 border-blue-400",
    "production-grade": "text-purple-400 border-purple-400",
  } as const

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back + Category chip */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:underline"
          >
            <FaArrowLeft /> Back to All Projects
          </Link>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[project.category]}`}
          >
            {project.category.toUpperCase().replace("-", " ")}
          </span>
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

        {/* Actions */}
        <div className="flex gap-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <FaGithub /> View on GitHub
          </a>
          {project.blogUrl && (
            <a
              href={project.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <FaExternalLinkAlt /> Read Blog Post
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
