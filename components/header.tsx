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
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-white/80">
              etch
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-300 py-2",
                    isActive(item.href)
                      ? "text-white"
                      : "text-white/60 hover:text-white"
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
              </motion.div>
            ))}
          </div>

          {/* Install CTA - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/registry"
              className="hidden sm:inline-flex h-10 items-center justify-center px-6 rounded-full text-sm font-medium transition-all hover:scale-105 bg-white text-[#0a0a0a] hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Install
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  )
}
