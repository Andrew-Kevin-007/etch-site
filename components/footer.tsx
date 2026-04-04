import Link from "next/link"
import { Terminal, Shield, AlertTriangle, ArrowRight, FileText, Check, X } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-primary/30 px-4 sm:px-6 py-16 sm:py-20 mt-auto relative z-10 glass bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl font-mono text-sm">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-3 items-start">
          
          {/* Left column */}
          <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-3 text-primary font-bold text-2xl tracking-widest group">
              <Terminal className="h-7 w-7 group-hover:text-green-400 transition-colors" /> ETCH
            </Link>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xs">
              Human authorship, etched in code.
            </p>
          </div>

          {/* Center column - Links */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary border-b border-primary/20 pb-2 mb-2 w-full text-center">Navigation</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-muted-foreground mt-2">
              <Link href="/registry" className="hover:text-primary transition-colors hover:underline underline-offset-4">Registry</Link>
              <Link href="/verify" className="hover:text-primary transition-colors hover:underline underline-offset-4">Verify</Link>
              <Link href="/protocol" className="hover:text-primary transition-colors hover:underline underline-offset-4">Protocol</Link>
              <a href="https://github.com/Andrew-Kevin-007/etch-site" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline underline-offset-4">GitHub</a>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 text-center lg:text-right flex flex-col items-center lg:items-end">
             <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary border-b border-primary/20 pb-2 mb-2 w-full text-center lg:text-right">System</p>
             <p className="text-primary/70 tracking-widest uppercase text-xs mt-2">
              v0.1.0 / PROTOCOL
            </p>
            <div className="flex items-center justify-center lg:justify-end gap-2 text-xs text-muted-foreground mt-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              status: active
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-primary/20 flex items-center justify-center text-xs text-muted-foreground/60 text-center">
          <p>© 2026 etch protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
