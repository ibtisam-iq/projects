import { useState } from "react"
import { projects } from "@/data/projects"
import { useCountUp } from "@/hooks/useCountUp"
import { FiChevronDown } from "react-icons/fi"

const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/174851199?v=4&s=400"

const Hero = () => {
  // Local public/profile.png takes priority; falls back to GitHub avatar
  const [photoSrc, setPhotoSrc] = useState("/profile.png")
  const totalProjects = projects.length
  const uniqueTech = new Set(projects.flatMap((p) => p.tech)).size

  const animatedProjects = useCountUp(totalProjects)
  const animatedTech = useCountUp(uniqueTech, 1800)

  const stats: { value: string; label: string }[] = [
    { value: `${animatedProjects}`, label: "Projects" },
    { value: `${animatedTech}`, label: "Technologies" },
    { value: "AWS + K8s", label: "Cloud Native" },
    { value: "GitOps", label: "Workflows" },
  ]

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,180,216,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-4 pt-12 md:pb-6 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16">
          <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-light-text dark:text-text-primary md:text-5xl lg:text-6xl">
            DevOps & Cloud
            <br />
            Infrastructure Projects
          </h1>

          <p className="mt-4 font-mono text-sm tracking-wide text-teal-accent md:text-base">
            Real deployments. Real pipelines. Real infrastructure.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-light-muted dark:text-text-muted md:text-lg">
            Kubernetes clusters, AWS infrastructure, CI/CD pipelines, and GitOps
            workflows. Every project built from scratch with source code and a
            runbook, plus terminal sessions on the ones worth replaying.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 rounded-full border border-light-border bg-light-surface px-4 py-2 transition-all duration-500 dark:border-border-subtle dark:bg-surface-1"
                style={{
                  opacity: 1,
                  animation: `fadeIn 0.4s ease-out ${i * 100}ms both`,
                }}
              >
                <span className="font-mono text-sm font-semibold text-teal-accent">
                  {stat.value}
                </span>
                <span className="text-xs text-light-muted dark:text-text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          </div>

          <div className="mt-10 flex justify-center md:mt-0 md:shrink-0">
            <img
              src={photoSrc}
              onError={() => {
                if (photoSrc !== GITHUB_AVATAR) setPhotoSrc(GITHUB_AVATAR)
              }}
              alt="Muhammad Ibtisam Iqbal"
              width={280}
              height={280}
              className="h-48 w-48 rounded-full border-2 border-light-border object-cover dark:border-border-subtle md:h-64 md:w-64 lg:h-72 lg:w-72"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 flex justify-center md:mt-12">
          <button
            onClick={() =>
              document
                .getElementById("main-content")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="animate-bounce-gentle text-light-muted/50 transition-colors hover:text-teal-accent dark:text-text-faint/50 dark:hover:text-teal-accent"
            aria-hidden="true"
            tabIndex={-1}
          >
            <FiChevronDown size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
