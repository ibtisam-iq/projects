import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@/context/ThemeContext"
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi"

const navLinks = [
  { to: "/", label: "Projects" },
  { to: "/how-i-work", label: "How I Work" },
]

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-200 ${
        scrolled ? "py-2.5" : "py-4"
      } border-b bg-light-bg/80 border-light-border dark:bg-surface-0/80 dark:border-white/5`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Home">
          <svg
            width="26"
            height="26"
            viewBox="0 0 28 28"
            fill="none"
            className="text-teal-accent"
            aria-hidden="true"
          >
            <path
              d="M14 2L26 8v12l-12 6L2 20V8l12-6z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M14 10l6 3v6l-6 3-6-3v-6l6-3z"
              fill="currentColor"
              opacity="0.25"
            />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
          </svg>
          <span className="font-mono text-[17px] font-semibold tracking-tight text-light-text dark:text-text-primary">
            ibtisam<span className="text-teal-accent">.</span>iq
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative pb-0.5 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-teal-accent"
                  : "text-light-muted hover:text-light-text dark:text-text-muted dark:hover:text-text-primary"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-teal-accent" />
              )}
            </Link>
          ))}

          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2 text-light-muted transition-colors hover:bg-light-surface-2 hover:text-light-text dark:text-text-muted dark:hover:bg-surface-2 dark:hover:text-text-primary"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-2.5 text-light-muted dark:text-text-muted"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2.5 text-light-muted dark:text-text-muted"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="animate-slide-up border-t border-light-border bg-light-bg dark:border-white/5 dark:bg-surface-1 md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-teal-accent"
                    : "text-light-muted dark:text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
