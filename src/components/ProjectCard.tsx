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
  completed: "border-emerald/40 bg-emerald-glow text-emerald-soft",
  "in-progress": "border-amber/40 bg-amber-glow text-amber",
  maintained: "border-indigo/40 bg-indigo-glow text-indigo-soft",
  archived: "border-border-color bg-surface-3 text-text-dim",
}

const statusDots: Record<string, string> = {
  completed: "bg-emerald shadow-[0_0_8px_#10d492]",
  "in-progress": "bg-amber shadow-[0_0_8px_#ffc93c]",
  maintained: "bg-indigo shadow-[0_0_8px_#7c7cff]",
  archived: "bg-text-dim",
}

interface ProjectCardProps {
  project: Project
  index?: number
}

// Card renders only the headline tools (authored first in each project's tech
// list, see docs/authoring-guide.md#ordering-tech); the rest stay fully
// searchable and filterable, just not chip-rendered here. 8 is the ceiling
// most projects in this dataset need to surface every genuinely distinct
// tool family without spilling to a third row on a typical card width.
const VISIBLE_TECH_COUNT = 8

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const { ref, inView } = useInView()
  const visibleTech = project.tech.slice(0, VISIBLE_TECH_COUNT)
  const hiddenTechCount = project.tech.length - visibleTech.length

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`group relative overflow-hidden rounded-[16px] border bg-surface-1 p-6 backdrop-blur-[12px] transition-all duration-300 md:p-7 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${
        project.featured
          ? "border-[#2f4066] hover:border-cyan hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.8),0_0_0_1px_rgba(22,200,236,0.2)]"
          : "border-border-color hover:border-indigo hover:shadow-[0_20px_40px_-18px_rgba(0,0,0,0.8)]"
      } hover:-translate-y-[5px]`}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Subtle top glow line on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
      
      {/* Corner radial glow on hover */}
      <div className="pointer-events-none absolute -right-[55px] -top-[55px] h-[150px] w-[150px] bg-[radial-gradient(circle,rgba(22,200,236,0.15),transparent_68%)] opacity-0 transition-opacity duration-350 group-hover:opacity-100" />

      {project.featured && (
        <div
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-indigo to-cyan"
          aria-hidden="true"
        />
      )}

      {/* Status row */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span
          className={`flex items-center gap-1.5 rounded-full border px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-[0.06em] ${
            statusColors[project.status] || "border-border-color bg-surface-3 text-text-dim"
          }`}
        >
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDots[project.status] || "bg-text-dim"}`} />
          {project.status.replace("-", " ")}
        </span>
        <span className="font-mono text-[13px] font-bold text-text-dim tracking-tight">
          {project.year}
        </span>
        {project.featured && (
          <span className="flex items-center gap-1 rounded-full bg-cyan-glow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-soft border border-cyan/30">
            <FiStar size={10} className="drop-shadow-[0_0_4px_#16c8ec]" />
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <Link to={`/${project.slug}`}>
        <h3 className="mb-3 text-[22px] font-extrabold leading-[1.25] tracking-[-0.025em] text-text-primary transition-colors group-hover:text-cyan md:text-[24px]">
          {project.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="mb-6 text-[15.5px] leading-[1.65] text-text-muted">
        {project.shortDescription}
      </p>

      {/* Tech Stack */}
      <div className="mb-5 flex flex-wrap gap-2">
        {visibleTech.map((tech, i) => (
          <span
            key={tech}
            className={`flex items-center gap-1.5 rounded-full border border-border-color bg-surface-3 px-3 py-1.5 font-sans text-[13px] font-bold tracking-[0.04em] text-text-muted transition-all duration-300 hover:border-[#35476e] hover:text-text-primary ${
              inView ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            style={{ transitionDelay: inView ? `${i * 30}ms` : "0ms" }}
          >
            {tech}
          </span>
        ))}
        {hiddenTechCount > 0 && (
          <Link
            to={`/${project.slug}`}
            className="flex items-center rounded-full border border-dashed border-border-color px-3 py-1.5 font-sans text-[13px] font-bold text-text-dim transition-colors hover:border-cyan hover:text-cyan-soft"
          >
            +{hiddenTechCount} more
          </Link>
        )}
      </div>

      {/* Bottom: skills + links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border-soft pt-4">
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-indigo/30 bg-indigo-glow px-2.5 py-1 text-[11.5px] font-bold tracking-wider text-indigo-soft"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo shadow-[0_0_8px_#7c7cff]"></span>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 md:ml-auto">
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
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-bold transition-all ${
                  isGitHub
                    ? "border-transparent bg-gradient-to-r from-indigo to-[#5b52e8] text-white shadow-[0_4px_12px_-4px_rgba(124,124,255,0.6)] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-4px_rgba(124,124,255,0.8)]"
                    : "border-border-color bg-surface-2 text-text-primary hover:-translate-y-0.5 hover:border-[#3d5177] hover:bg-[#26324f]"
                }`}
              >
                <Icon size={12} className="shrink-0" />
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
