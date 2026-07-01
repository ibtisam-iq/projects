import { Link } from "react-router-dom"
import { Project } from "@/types/project"
import { FaGithub, FaBook, FaGlobe, FaExternalLinkAlt, FaPlay, FaBookOpen, FaTerminal, FaImage } from "react-icons/fa"
import { FiStar } from "react-icons/fi"
import { IconType } from "react-icons"
import { useInView } from "@/hooks/useInView"

const linkConfig: Record<string, { icon: IconType; label: string }> = {
  github: { icon: FaGithub, label: "GitHub" },
  runbook: { icon: FaBook, label: "Runbook" },
  blog: { icon: FaExternalLinkAlt, label: "Blog" },
  website: { icon: FaGlobe, label: "Website" },
  playground: { icon: FaPlay, label: "Try It Live" },
  docs: { icon: FaBookOpen, label: "Docs" },
  "app-repo": { icon: FaGithub, label: "App Repo" },
  "java-monolith-repo": { icon: FaGithub, label: "Java" },
  "python-monolith-repo": { icon: FaGithub, label: "Python" },
  "node-monolith-repo": { icon: FaGithub, label: "Node" },
  "cd-repo": { icon: FaGithub, label: "Platform Repo" },
  "terminal-sessions": { icon: FaTerminal, label: "Terminal" },
  "screenshots": { icon: FaImage, label: "Screenshots" },
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500/15 text-green-600 dark:text-green-400",
  "in-progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  maintained: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  archived: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
}

interface ProjectCardProps {
  project: Project
  index?: number
}

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const { ref, inView } = useInView()

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`group relative overflow-hidden rounded-lg border bg-light-surface p-5 transition-all duration-300 md:p-6 ${
        inView
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      } ${
        project.featured
          ? "border-teal-accent/25 hover:border-teal-accent/40 hover:shadow-[0_4px_20px_rgba(0,180,216,0.12)] dark:border-teal-accent/15 dark:hover:border-teal-accent/30 dark:hover:shadow-[0_4px_20px_rgba(0,180,216,0.08)]"
          : "border-light-border hover:border-teal-accent/30 hover:shadow-lg dark:border-border-subtle dark:hover:border-teal-accent/30"
      } hover:-translate-y-1 dark:bg-surface-1`}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {project.featured && (
        <div
          className="absolute inset-y-0 left-0 w-[3px] bg-teal-accent"
          aria-hidden="true"
        />
      )}

      {/* Status row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
            statusColors[project.status] || "bg-gray-500/15 text-gray-400"
          }`}
        >
          {project.status.replace("-", " ")}
        </span>
        <span className="font-mono text-xs text-light-muted dark:text-text-faint">
          {project.year}
        </span>
        {project.featured && (
          <span className="flex items-center gap-1 rounded-full bg-teal-accent/10 px-2 py-0.5 text-[10px] font-medium text-teal-accent">
            <FiStar size={10} />
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <Link to={`/project/${project.slug}`}>
        <h3 className="mb-2 text-base font-bold leading-snug tracking-tight text-light-text transition-colors group-hover:text-teal-accent dark:text-text-primary md:text-lg">
          {project.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-light-muted dark:text-text-muted">
        {project.shortDescription}
      </p>

      {/* Tech Stack */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tech.map((tech, i) => (
          <span
            key={tech}
            className={`rounded bg-light-surface-2 px-2 py-0.5 font-mono text-[11px] text-light-muted transition-all duration-300 dark:bg-surface-2 dark:text-text-muted ${
              inView ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            style={{ transitionDelay: inView ? `${i * 30}ms` : "0ms" }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Bottom: skills + links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-light-border/50 pt-3 dark:border-border-subtle/50">
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-accent/20 px-2 py-0.5 text-[11px] text-teal-accent dark:border-teal-accent/25"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 md:ml-auto">
          {project.links.map((link) => {
            let config = linkConfig[link.type]
            if (!config) {
              const isRepo =
                link.type.toLowerCase().includes("repo") ||
                link.url.includes("github.com")
              config = {
                icon: isRepo ? FaGithub : FaExternalLinkAlt,
                label: link.type
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" "),
              }
            }
            const Icon = config.icon
            const isGitHub =
              link.type === "github" || link.type.includes("repo")
            return (
              <a
                key={link.type}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  isGitHub
                    ? "bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20"
                    : "bg-light-surface-2 text-light-muted hover:text-light-text dark:bg-surface-2 dark:text-text-muted dark:hover:text-text-primary"
                }`}
              >
                <Icon size={11} className="shrink-0" />
                <span>{config.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
