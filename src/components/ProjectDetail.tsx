import { useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { projects } from "@/data/projects"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  FaGithub,
  FaBook,
  FaGlobe,
  FaExternalLinkAlt,
  FaPlay,
  FaBookOpen,
  FaTerminal,
  FaImage,
} from "react-icons/fa"
import { FiArrowLeft, FiChevronRight } from "react-icons/fi"
import { IconType } from "react-icons"

const linkConfig: Record<string, { icon: IconType; label: string }> = {
  github: { icon: FaGithub, label: "GitHub" },
  runbook: { icon: FaBook, label: "Runbook" },
  blog: { icon: FaExternalLinkAlt, label: "Blog" },
  website: { icon: FaGlobe, label: "Website" },
  playground: { icon: FaPlay, label: "Try It Live" },
  docs: { icon: FaBookOpen, label: "Docs" },
  "app-repo": { icon: FaGithub, label: "App Repo" },
  "java-monolith-repo": { icon: FaGithub, label: "Java Repo" },
  "python-monolith-repo": { icon: FaGithub, label: "Python Repo" },
  "node-monolith-repo": { icon: FaGithub, label: "Node Repo" },
  "cd-repo": { icon: FaGithub, label: "Platform Repo" },
  "terminal-sessions": { icon: FaTerminal, label: "Terminal" },
  "screenshots": { icon: FaImage, label: "Screenshots" },
}

const statusMeta: Record<string, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-green-500/15 text-green-600 dark:text-green-400" },
  "in-progress": { label: "In Progress", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  maintained: { label: "Maintained", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  archived: { label: "Archived", className: "bg-gray-500/15 text-gray-600 dark:text-gray-400" },
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    document.title = project
      ? `${project.title} | Muhammad Ibtisam`
      : "Projects | Muhammad Ibtisam"
    return () => {
      document.title = "Projects | Muhammad Ibtisam"
    }
  }, [project])

  const relatedProjects = useMemo(() => {
    if (!project) return []
    return projects
      .filter((p) => p.slug !== project.slug)
      .map((p) => ({
        project: p,
        score:
          p.tags.filter((t) => project.tags.includes(t)).length +
          p.tech.filter((t) => project.tech.includes(t)).length * 0.5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter((r) => r.score > 0)
      .map((r) => r.project)
  }, [project])

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center bg-light-bg dark:bg-surface-0">
          <div className="text-center">
            <h1 className="mb-4 font-mono text-6xl font-bold text-teal-accent">
              404
            </h1>
            <p className="mb-6 text-lg text-light-muted dark:text-text-muted">
              Project not found.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-muted"
            >
              <FiArrowLeft size={16} />
              Back to All Projects
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const stat = statusMeta[project.status] || {
    label: project.status,
    className: "bg-gray-500/15 text-gray-400",
  }

  const resolveLink = (link: { type: string; url: string }) => {
    let config = linkConfig[link.type]
    let isPrimary = link.type === "github" || link.type.includes("repo")
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
      if (isRepo) isPrimary = true
    }
    return { config, isPrimary }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-sm"
        >
          <Link
            to="/"
            className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          >
            Home
          </Link>
          <FiChevronRight
            size={14}
            className="text-light-muted dark:text-text-faint"
            aria-hidden="true"
          />
          <Link
            to="/"
            className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          >
            Projects
          </Link>
          <FiChevronRight
            size={14}
            className="text-light-muted dark:text-text-faint"
            aria-hidden="true"
          />
          <span className="truncate text-light-text dark:text-text-primary">
            {project.title}
          </span>
        </nav>

        {/* Back button */}
        <Link
          to="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
        >
          <FiArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All Projects
        </Link>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-10">
            {/* Header */}
            <header>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${stat.className}`}
                >
                  {stat.label}
                </span>
                <span className="font-mono text-sm text-light-muted dark:text-text-faint">
                  {project.year}
                </span>
                <span className="rounded-md border border-light-border bg-light-surface-2 px-2.5 py-0.5 text-xs capitalize text-light-muted dark:border-border-subtle dark:bg-surface-2 dark:text-text-muted">
                  {project.category}
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-tight text-light-text dark:text-text-primary md:text-3xl lg:text-4xl">
                {project.title}
              </h1>
            </header>

            {/* Image */}
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                className="w-full rounded-lg border border-light-border dark:border-border-subtle"
              />
            )}

            {/* Overview */}
            <section>
              <h2 className="mb-4 border-l-2 border-teal-accent pl-3 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                Overview
              </h2>
              <div className="space-y-4">
                {project.description.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="leading-relaxed text-light-muted dark:text-text-muted"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {/* Dynamic Sections */}
            {project.sections.map((section, sIdx) => (
              <section key={sIdx}>
                <h2 className="mb-5 border-l-2 border-teal-accent pl-3 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-text-primary">
                  {section.title}
                </h2>
                <div className="rounded-lg border border-light-border bg-light-surface dark:border-border-subtle dark:bg-surface-1">
                  <ul className="divide-y divide-light-border/50 dark:divide-border-subtle/50">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 px-4 py-3"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-accent"
                          aria-hidden="true"
                        />
                        <p className="text-sm leading-relaxed text-light-muted dark:text-text-muted">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}

            {/* Bottom links */}
            <section className="flex flex-wrap gap-3 border-t border-light-border pt-8 dark:border-border-subtle">
              {project.links.map((link) => {
                const { config, isPrimary } = resolveLink(link)
                const Icon = config.icon
                return (
                  <a
                    key={link.type}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                      isPrimary
                        ? "bg-teal-accent text-white hover:bg-teal-muted"
                        : "border border-light-border bg-light-surface text-light-text hover:bg-light-surface-2 dark:border-border-subtle dark:bg-surface-2 dark:text-text-primary dark:hover:bg-surface-3"
                    }`}
                  >
                    <Icon size={15} />
                    {config.label}
                  </a>
                )
              })}
            </section>
          </div>

          {/* Sidebar metadata panel */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-20 space-y-6 rounded-lg border border-light-border bg-light-surface p-5 dark:border-border-subtle dark:bg-surface-1">
              {/* Links */}
              <div>
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-light-muted dark:text-text-faint">
                  Links
                </h3>
                <div className="flex flex-col gap-2">
                  {project.links.map((link) => {
                    const { config } = resolveLink(link)
                    const Icon = config.icon
                    return (
                      <a
                        key={link.type}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
                      >
                        <Icon size={14} className="shrink-0" />
                        {config.label}
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-light-muted dark:text-text-faint">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-light-surface-2 px-2 py-0.5 font-mono text-[11px] text-light-muted dark:bg-surface-2 dark:text-text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {project.tags.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-light-muted dark:text-text-faint">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-teal-accent/20 px-2.5 py-0.5 text-[11px] text-teal-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="space-y-2 border-t border-light-border pt-4 dark:border-border-subtle">
                <div className="flex justify-between text-sm">
                  <span className="text-light-muted dark:text-text-faint">
                    Year
                  </span>
                  <span className="font-mono text-light-text dark:text-text-primary">
                    {project.year}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-light-muted dark:text-text-faint">
                    Status
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${stat.className}`}
                  >
                    {stat.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-light-muted dark:text-text-faint">
                    Category
                  </span>
                  <span className="capitalize text-light-text dark:text-text-primary">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <section className="mt-12 border-t border-light-border pt-8 dark:border-border-subtle">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-light-muted dark:text-text-faint">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.slug}
                  to={`/project/${rp.slug}`}
                  className="group rounded-lg border border-light-border bg-light-surface p-4 transition-colors hover:border-teal-accent/30 dark:border-border-subtle dark:bg-surface-1 dark:hover:border-teal-accent/30"
                >
                  <h3 className="mb-2 text-sm font-semibold text-light-text transition-colors group-hover:text-teal-accent dark:text-text-primary">
                    {rp.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {rp.tech.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-light-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-light-muted dark:bg-surface-2 dark:text-text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}

export default ProjectDetail
