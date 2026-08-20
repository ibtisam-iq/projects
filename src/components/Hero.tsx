import { useState } from "react"
import { projects } from "@/data/projects"
import { useCountUp } from "@/hooks/useCountUp"
import { FiChevronDown } from "react-icons/fi"

const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/174851199?v=4&s=400"

const Hero = () => {
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
      <div className="relative mx-auto max-w-[1240px] px-[22px] pb-4 pt-12 md:pb-6 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16">
          <div className="min-w-0 flex-1">
          <h1 className="text-[clamp(32px,5.4vw,56px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-soft to-cyan">
            DevOps & Cloud
            <br />
            Infrastructure Projects
          </h1>

          <p className="mt-4 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-cyan-soft md:text-[14px]">
            Real deployments. Real pipelines. Real infrastructure.
          </p>

          <p className="mt-5 max-w-2xl text-[17.5px] leading-relaxed text-text-muted">
            Kubernetes clusters, AWS infrastructure, CI/CD pipelines, and GitOps
            workflows. Every project built from scratch with source code and a
            runbook, plus terminal sessions on the ones worth replaying.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 rounded-full border border-border-color bg-surface-1 px-[18px] py-[9px] backdrop-blur-[12px] transition-all duration-500 hover:-translate-y-[2px] hover:border-cyan"
                style={{
                  opacity: 1,
                  animation: `fadeIn 0.4s ease-out ${i * 100}ms both`,
                }}
              >
                <span className="font-mono text-[16px] font-extrabold text-cyan-soft">
                  {stat.value}
                </span>
                <span className="text-[14px] font-bold text-text-muted">
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
              className="h-48 w-48 rounded-full border border-border-color bg-surface-1 object-cover shadow-[0_0_30px_rgba(124,124,255,0.25)] md:h-64 md:w-64 lg:h-72 lg:w-72"
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
            className="animate-bounce-gentle text-text-dim transition-colors hover:text-cyan"
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
