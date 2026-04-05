import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-[#0a0a0a]/5 px-6 py-12 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#0a0a0a]">etch</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/registry" className="text-[#666] hover:text-[#0a0a0a] transition-colors">
              Registry
            </Link>
            <Link href="/verify" className="text-[#666] hover:text-[#0a0a0a] transition-colors">
              Verify
            </Link>
            <Link href="/protocol" className="text-[#666] hover:text-[#0a0a0a] transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/Andrew-Kevin-007/etch-site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-[#0a0a0a] transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-[#666]">
            © 2026 etch protocol
          </div>
        </div>
      </div>
    </footer>
  )
}
