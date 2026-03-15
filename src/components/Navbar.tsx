import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-bg border-b border-gray-800 text-white relative z-50">
      {/* LOGO → Home */}
      <Link
        to="/"
        className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-wide"
      >
        Ibtisam
      </Link>

      {/* Hamburger (mobile) */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 items-center text-lg">
        <Link to="/" className="hover:text-purple-400 transition">All Projects</Link>
        <a href="https://ibtisam-iq.com" className="hover:text-purple-400 transition">Portfolio</a>
        <a href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">Blog</a>
        <a href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">Nectar</a>
        <a href="https://github.com/ibtisam-iq/silver-stack" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">SilverStack</a>
        <a href="https://linkedin.com/in/ibtisam-iq" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">LinkedIn</a>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 md:hidden flex flex-col gap-4 p-6 border-b border-gray-800">
          <Link to="/" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>All Projects</Link>
          <a href="https://ibtisam-iq.com" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
          <a href="https://blog.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Blog</a>
          <a href="https://nectar.ibtisam-iq.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>Nectar</a>
          <a href="https://github.com/ibtisam-iq/silver-stack" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>SilverStack</a>
          <a href="https://linkedin.com/in/ibtisam-iq" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition" onClick={() => setMobileMenuOpen(false)}>LinkedIn</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar
