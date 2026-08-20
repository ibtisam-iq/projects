import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FiMenu, FiX, FiGithub } from "react-icons/fi"

const navLinks = [
  { to: "/", label: "Projects" },
  { to: "/how-i-work", label: "How I Work" },
]

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setScrollProgress(progress)
    }
    
    window.addEventListener("scroll", onScroll, { passive: true })
    // Initialize
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const [prevPathname, setPrevPathname] = useState(location.pathname)

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 border-b-border-subtle bg-[#04070d]/90 backdrop-blur-[18px] saturate-[140%] shadow-[0_12px_34px_-18px_rgba(0,0,0,0.95)]"
          : "py-5 border-b-transparent bg-transparent"
      } border-b`}
    >
      <div 
        className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-indigo via-cyan to-emerald z-50"
        style={{ width: `${Math.max(0, Math.min(100, scrollProgress))}%`, transition: "width 0.1s ease-out" }}
      />
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-[22px]">
        <Link to="/" className="flex items-center gap-3 whitespace-nowrap" aria-label="Home">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-gradient-to-br from-indigo to-cyan text-[15px] font-extrabold tracking-[-0.03em] text-white shadow-[0_0_20px_rgba(124,124,255,0.45)]">
            IQ
          </div>
          <span className="flex flex-col leading-[1.2]">
            <span className="text-[17px] font-extrabold tracking-[-0.02em] text-text-primary">
              Muhammad Ibtisam
            </span>
            <span className="hidden text-[11.5px] font-semibold uppercase tracking-[0.09em] text-text-dim md:block">
              DevOps & Cloud Engineer
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-[10px] px-[13px] py-[9px] text-[15px] font-semibold transition-all duration-220 whitespace-nowrap ${
                isActive(link.to)
                  ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)]"
                  : "text-text-muted hover:bg-surface-2 hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mx-2 h-4 w-px bg-border-subtle" />

          <a
            href="https://github.com/ibtisam-iq/projects"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="flex items-center justify-center gap-2 rounded-[11px] border border-border-color bg-surface-2 px-4 py-2 text-[14px] font-bold text-text-primary transition-all duration-220 hover:-translate-y-[1px] hover:border-[#3d5177] hover:bg-[#26324f]"
          >
            <FiGithub size={17} />
            <span>Repository</span>
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://github.com/ibtisam-iq/projects"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="rounded-[10px] border border-border-color bg-surface-2 p-2.5 text-text-primary transition-all"
          >
            <FiGithub size={18} />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-[10px] border border-border-color bg-surface-2 p-2.5 text-text-primary transition-all"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-[100%] m-0 flex animate-fade-in flex-col gap-1 border-b border-border-color bg-[#070a12]/98 p-3 backdrop-blur-[16px] md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-[10px] px-3.5 py-3 text-[15px] font-semibold transition-all ${
                isActive(link.to)
                  ? "bg-cyan-glow text-cyan-soft shadow-[inset_0_0_0_1px_rgba(22,200,236,0.3)]"
                  : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
