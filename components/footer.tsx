import Link from "next/link"
import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#00ff9d]/20 bg-[#0a0a0a] px-4 py-12 lg:px-8 mt-auto font-sans">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 md:grid-cols-3 items-center text-sm">
          
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold tracking-widest text-lg group">
              <Terminal className="h-5 w-5 text-[#00ff9d] group-hover:opacity-80 transition-opacity" /> ETCH
            </Link>
            <p className="text-gray-400 font-mono text-xs">
              Human authorship, etched in code.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-gray-400 font-mono text-xs">
            <Link href="/registry" className="hover:text-[#00ff9d] transition-colors">Registry</Link>
            <Link href="/verify" className="hover:text-[#00ff9d] transition-colors">Verify</Link>
            <Link href="/protocol" className="hover:text-[#00ff9d] transition-colors">Protocol</Link>
            <a href="https://github.com/Andrew-Kevin-007/etch-site" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff9d] transition-colors">GitHub</a>
          </div>

          <div className="flex flex-col items-center justify-center md:items-end space-y-2">
            <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">
              v0.1.0 / PROTOCOL
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff9d] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff9d]" />
              </span>
              status: active
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#00ff9d]/10 text-center font-mono text-xs text-gray-600">
          <p>© 2026 etch protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
