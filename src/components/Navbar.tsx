import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav
      className="flex justify-between items-center px-6 md:px-10 py-5 relative z-50"
      style={{ backgroundColor: "#0B0F19", borderBottom: "1px solid #1F2937", color: "white" }}
    >
      {/* LOGO */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text"
        style={{ WebkitTextFillColor: "transparent", color: "transparent" }}
      >
        Ibtisam
      </Link>

      {/* Hamburger (mobile) */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        style={{ color: "white" }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 items-center text-lg" style={{ color: "white" }}>
        <Link to="/" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          All Projects
        </Link>
        <a href="https://ibtisam-iq.com" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          Portfolio
        </a>
        <a href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          Blog
        </a>
        <a href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          Nectar
        </a>
        <a href="https://github.com/ibtisam-iq/silver-stack" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          SilverStack
        </a>
        <a href="https://linkedin.com/in/ibtisam-iq" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }}>
          LinkedIn
        </a>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="absolute top-full left-0 w-full md:hidden flex flex-col gap-4 p-6"
          style={{ backgroundColor: "#111827", borderBottom: "1px solid #1F2937", color: "white" }}
        >
          <Link to="/" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>All Projects</Link>
          <a href="https://ibtisam-iq.com" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
          <a href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>Blog</a>
          <a href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>Nectar</a>
          <a href="https://github.com/ibtisam-iq/silver-stack" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>SilverStack</a>
          <a href="https://linkedin.com/in/ibtisam-iq" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" style={{ color: "white" }} onClick={() => setMobileMenuOpen(false)}>LinkedIn</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
