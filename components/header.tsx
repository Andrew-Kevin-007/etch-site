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
  const [isDarkSection, setIsDarkSection] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 20)
      // Light themed page - keep header light
      setIsDarkSection(false)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? isDarkSection
            ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-white/80 backdrop-blur-xl border-b border-[#0a0a0a]/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className={cn(
                "text-xl font-bold tracking-tight transition-colors duration-300",
                isDarkSection ? "text-white" : "text-[#0a0a0a]"
              )}
            >
              etch
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive(item.href)
                    ? isDarkSection
                      ? "text-white"
                      : "text-[#0a0a0a]"
                    : isDarkSection
                      ? "text-white/60 hover:text-white"
                      : "text-[#666] hover:text-[#0a0a0a]"
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
              className={cn(
                "hidden sm:inline-flex h-10 items-center justify-center px-5 rounded-full text-sm font-medium transition-all hover:scale-105",
                isDarkSection
                  ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                  : "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90"
              )}
            >
              Install
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
