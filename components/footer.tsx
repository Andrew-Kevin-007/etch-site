import Link from "next/link"
import { Github } from "lucide-react"

const footerNav = [
  {
    label: "Product",
    links: [
      { label: "Registry", href: "/registry" },
      { label: "Verify", href: "/verify" },
      { label: "Protocol", href: "/protocol" },
    ],
  },
  {
    label: "Docs",
    links: [
      { label: "Getting Started", href: "/protocol" },
      { label: "CLI Reference", href: "/protocol" },
      { label: "API", href: "/protocol" },
    ],
  },
  {
    label: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/Andrew-Kevin-007/etch-site" },
      { label: "Changelog", href: "/protocol" },
      { label: "Blog", href: "/protocol" },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
      {/* Nav columns */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {footerNav.map((group) => (
            <div key={group.label} className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#aaa" }}>
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors hover:text-[#1a1a1a] flex items-center gap-1.5"
                        style={{ color: "#5f6368" }}
                      >
                        {link.label === "GitHub" && <Github className="w-3.5 h-3.5" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-[#1a1a1a]"
                        style={{ color: "#5f6368" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Large wordmark */}
      <div
        className="max-w-7xl mx-auto px-6 py-8"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div
          className="font-bold tracking-tighter select-none"
          style={{
            fontSize: "clamp(64px, 16vw, 160px)",
            color: "#1a1a1a",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            opacity: 0.08,
          }}
        >
          etch
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-xs" style={{ color: "#aaa" }}>
          © 2026 etch protocol · Open Source · MIT License
        </p>
        <div className="flex items-center gap-6">
          <Link href="/protocol" className="text-xs transition-colors hover:text-[#1a1a1a]" style={{ color: "#aaa" }}>
            Privacy
          </Link>
          <Link href="/protocol" className="text-xs transition-colors hover:text-[#1a1a1a]" style={{ color: "#aaa" }}>
            Terms
          </Link>
          <Link href="/protocol#faq" className="text-xs transition-colors hover:text-[#1a1a1a]" style={{ color: "#aaa" }}>
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  )
}
