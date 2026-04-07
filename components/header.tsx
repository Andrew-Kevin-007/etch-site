"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

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
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-gray-900 transition-all duration-300 group-hover:text-gray-600">
              etch
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-300 py-2",
                    isActive(item.href)
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Install CTA - Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/registry"
              className="hidden sm:inline-flex h-10 items-center justify-center px-6 rounded-full text-sm font-medium transition-all hover:scale-105 bg-[#202124] text-white hover:bg-black shadow-sm"
            >
              Install
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
