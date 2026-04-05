"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { label: "Registry", href: "/registry" },
  { label: "Verify", href: "/verify" },
  { label: "Docs", href: "/protocol" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-[#0a0a0a]/5" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#0a0a0a]">etch</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-[#0a0a0a]"
                    : "text-[#666] hover:text-[#0a0a0a]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Install CTA - Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/registry"
              className="hidden sm:inline-flex h-10 items-center justify-center px-5 rounded-full bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#0a0a0a]/90 transition-all"
            >
              Install
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
