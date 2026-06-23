import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

/* ---------------------------------------------------------------- */
/* Helpers                                                          */
/* ---------------------------------------------------------------- */

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/** A connector line that draws itself from 0 to full length once `inView` is true. */
const DrawPath = ({
  d,
  inView,
  gradientId,
  delay = 0,
}: {
  d: string
  inView: boolean
  gradientId: string
  delay?: number
}) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength())
  }, [d])

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth={1.5}
      strokeLinecap="round"
      style={{
        strokeDasharray: length,
        strokeDashoffset: inView ? 0 : length,
        transition: `stroke-dashoffset 0.9s ease-out ${delay}ms`,
      }}
    />
  )
}

/** Typewriter effect for the closing terminal block. Starts only when `start` is true. */
function useTypewriter(lines: string[], start: boolean) {
  const [output, setOutput] = useState<string[]>([])

  useEffect(() => {
    if (!start) return

    if (prefersReducedMotion()) {
      setOutput(lines)
      return
    }

    let cancelled = false
    let lineIdx = 0
    let charIdx = 0
    const acc: string[] = []

    const step = () => {
      if (cancelled || lineIdx >= lines.length) return
      charIdx++
      acc[lineIdx] = lines[lineIdx].slice(0, charIdx)
      setOutput([...acc])

      if (charIdx >= lines[lineIdx].length) {
        lineIdx++
        charIdx = 0
        if (lineIdx < lines.length) setTimeout(step, 130)
      } else {
        setTimeout(step, 14)
      }
    }

    const kickoff = setTimeout(step, 250)
    return () => {
      cancelled = true
      clearTimeout(kickoff)
    }
  }, [start, lines])

  return output
}

/* ---------------------------------------------------------------- */
/* Small presentational pieces                                      */
/* ---------------------------------------------------------------- */

const Eyebrow = ({ children }: { children: string }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
    {children}
  </p>
)

const StageCard = ({
  eyebrow,
  title,
  body,
  link,
  accent = "text-gray-300",
}: {
  eyebrow: string
  title: string
  body: string
  link?: { label: string; to: string; external?: boolean }
  accent?: string
}) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h3 className={`text-lg font-semibold mb-2 ${accent}`}>{title}</h3>
    <p className="text-gray-400 text-sm flex-1">{body}</p>
    {link &&
      (link.external ? (
        <a
          href={link.to}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 text-sm font-medium hover:opacity-80 transition ${accent}`}
        >
          {link.label} ↗
        </a>
      ) : (
        <Link
          to={link.to}
          className={`mt-4 text-sm font-medium hover:opacity-80 transition ${accent}`}
        >
          {link.label} →
        </Link>
      ))}
  </div>
)

const MobileConnector = () => (
  <div className="md:hidden w-px h-10 mx-auto bg-gradient-to-b from-purple-500/50 to-pink-500/50" />
)

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

const LOG_LINES = [
  "$ cat methodology.log",
  "[phase-02] silverstack   -> reusable infra, run again not read once",
  "[phase-02] blog          -> distilled, problem-first write-ups",
  "[phase-02] projects      -> integrated systems, live in production",
  "[phase-01] nectar        -> 200+ pages, survived contact with reality",
  "---------------------------------------------------------------",
  "status: nothing here is a tutorial followed once",
]

const HowIWork = () => {
  const { ref: pipelineRef, inView } = useInView<HTMLDivElement>(0.15)
  const typed = useTypewriter(LOG_LINES, inView)

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16 text-white">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
            Methodology
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            How I Work
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Every project on this site moves through the same pipeline.
            Two ways in, one synthesis stage, three ways out.
          </p>
        </div>

        <div ref={pipelineRef}>
          {/* PHASE 00 — two trigger nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StageCard
              eyebrow="phase 00 · trigger"
              title="Don't understand it"
              body="Build the mental model first, from first principles, before any of it touches real infrastructure."
              accent="text-red-400"
            />
            <StageCard
              eyebrow="phase 00 · trigger"
              title="Run it for real"
              body="Full implementation. The debugging, the 2am redirect loop, the parts that never make it into a README."
              accent="text-purple-400"
            />
          </div>

          <MobileConnector />

          {/* Fan-in connector (desktop only) */}
          <div className="hidden md:block w-full" style={{ height: 56 }}>
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="flowIn" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <DrawPath d="M25,0 L50,40" inView={inView} gradientId="flowIn" />
              <DrawPath d="M75,0 L50,40" inView={inView} gradientId="flowIn" delay={120} />
            </svg>
          </div>

          {/* PHASE 01 — synthesis hub */}
          <div className="flex justify-center">
            <a
              href="https://nectar.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full md:w-auto md:min-w-[360px] bg-gray-900 border border-blue-500/30 rounded-2xl p-7 text-center shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)] hover:border-blue-500/60 transition"
            >
              <Eyebrow>phase 01 · synthesis</Eyebrow>
              <h2 className="text-2xl font-bold mb-2 text-blue-300 group-hover:text-blue-200 transition">
                Nectar
              </h2>
              <p className="text-gray-400 text-sm mb-3">
                200+ pages. A concept doesn't count as understood until it
                survives contact with what I actually built.
              </p>
              <span className="font-mono text-xs text-blue-400 group-hover:text-blue-300 transition">
                nectar.ibtisam-iq.com ↗
              </span>
            </a>
          </div>

          <MobileConnector />

          {/* Fan-out connector (desktop only) */}
          <div className="hidden md:block w-full" style={{ height: 56 }}>
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="flowOut" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <DrawPath d="M50,0 L16.667,40" inView={inView} gradientId="flowOut" delay={150} />
              <DrawPath d="M50,0 L50,40" inView={inView} gradientId="flowOut" delay={250} />
              <DrawPath d="M50,0 L83.333,40" inView={inView} gradientId="flowOut" delay={350} />
            </svg>
          </div>

          {/* PHASE 02 — three output nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StageCard
              eyebrow="phase 02 · output"
              title="Repeatable"
              body="Becomes a script, a module, a role."
              accent="text-green-400"
              link={{ label: "SilverStack", to: "https://github.com/ibtisam-iq/silver-stack", external: true }}
            />
            <StageCard
              eyebrow="phase 02 · output"
              title="Explained"
              body="Becomes a write-up. Problem first, no padding."
              accent="text-orange-400"
              link={{ label: "Blog", to: "https://blog.ibtisam-iq.com", external: true }}
            />
            <StageCard
              eyebrow="phase 02 · output"
              title="Assembled"
              body="Becomes a system with its own domain and its own uptime."
              accent="text-purple-400"
              link={{ label: "Projects", to: "/" }}
            />
          </div>
        </div>

        {/* Runbook tie-in + terminal log */}
        <div className="mt-20 border-t border-gray-800 pt-12">
          <p className="text-gray-400 max-w-2xl mx-auto text-center mb-8">
            The{" "}
            <a
              href="https://runbook.ibtisam-iq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              runbook
            </a>{" "}
            sits underneath all three: every decision and every bug, dated,
            written down while it was still true.
          </p>

          <div className="max-w-2xl mx-auto rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-gray-900 px-4 py-2.5 border-b border-gray-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 font-mono text-xs text-gray-500">
                methodology.log
              </span>
            </div>
            <pre className="bg-black/60 px-4 py-4 font-mono text-[13px] leading-relaxed text-green-400 overflow-x-auto min-h-[140px]">
              {typed.join("\n")}
              <span className="inline-block w-2 h-3.5 bg-green-400 align-middle animate-pulse ml-0.5" />
            </pre>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default HowIWork