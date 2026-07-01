import { FaGithub, FaLinkedin } from "react-icons/fa"

const externalLinks = [
  { label: "Portfolio", href: "https://ibtisam-iq.com" },
  { label: "Blog", href: "https://blog.ibtisam-iq.com" },
  { label: "Nectar", href: "https://nectar.ibtisam-iq.com" },
  { label: "Runbook", href: "https://runbook.ibtisam-iq.com" },
  { label: "Cert Vault", href: "https://cert-vault.ibtisam-iq.com" },
  { label: "SilverStack", href: "https://github.com/ibtisam-iq/silver-stack" },
  { label: "iximiuz Labs", href: "https://labs.iximiuz.com/a/ibtisam-iq" },
  { label: "Credly", href: "https://www.credly.com/users/ibtisam-iq/badges/credly" },
]

const Footer = () => (
  <footer className="border-t border-light-border bg-light-surface dark:border-border-subtle dark:bg-surface-1">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm font-semibold text-light-text dark:text-text-primary">
          ibtisam<span className="text-teal-accent">.</span>iq
        </span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ibtisam-iq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com/in/ibtisam-iq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {externalLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light-muted transition-colors hover:text-teal-accent dark:text-text-muted dark:hover:text-teal-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>

    <div className="border-t border-light-border dark:border-border-subtle">
      <p className="mx-auto max-w-7xl px-6 py-4 text-xs text-light-muted dark:text-text-faint">
        &copy; {new Date().getFullYear()} Muhammad Ibtisam. Built with React +
        TypeScript + Tailwind + Vite &middot; Deployed on GitHub Pages
      </p>
    </div>
  </footer>
)

export default Footer
