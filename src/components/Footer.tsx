import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-800 py-8 px-6 text-center text-gray-400">
      <div className="max-w-6xl mx-auto">
        {/* Social */}
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://github.com/ibtisam-iq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition text-2xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/ibtisam-iq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/ibtisam_iq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition text-2xl"
          >
            <FaTwitter />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Muhammad Ibtisam. Built with React,
          TypeScript, and Tailwind CSS.
        </p>

        {/* Quick links */}
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <a
            href="https://ibtisam-iq.com"
            className="hover:text-purple-400 transition"
          >
            Portfolio
          </a>
          <span>•</span>
          <a
            href="https://blog.ibtisam-iq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            Blog
          </a>
          <span>•</span>
          <a
            href="https://nectar.ibtisam-iq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            Nectar
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
