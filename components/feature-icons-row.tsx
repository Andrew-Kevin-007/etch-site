"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Shield,
  Key,
  Hash,
  FileCheck,
  Fingerprint,
  GitBranch,
  Database,
  Lock,
  Code,
  CheckCircle,
  Link2,
  RefreshCw,
  Scan,
  BadgeCheck,
  Clock,
  Eye,
  Pen,
  ScrollText,
  Layers,
  Binary,
  Network,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════════════
// MARQUEE DATA
// ═══════════════════════════════════════════════════════════════════════════════

interface MarqueeItem {
  label: string
  Icon: LucideIcon
}

const row1Items: MarqueeItem[] = [
  { label: "Sign", Icon: Pen },
  { label: "Keypair", Icon: Key },
  { label: "Hash", Icon: Hash },
  { label: "Verify", Icon: FileCheck },
  { label: "Identity", Icon: Fingerprint },
  { label: "Chain", Icon: GitBranch },
  { label: "Registry", Icon: Database },
  { label: "Immutable", Icon: Lock },
  { label: "Open", Icon: Code },
  { label: "Proven", Icon: CheckCircle },
  { label: "Linked", Icon: Link2 },
  { label: "Audit", Icon: RefreshCw },
]

const row2Items: MarqueeItem[] = [
  { label: "Cryptographic", Icon: Shield },
  { label: "Attestation", Icon: BadgeCheck },
  { label: "Timestamp", Icon: Clock },
  { label: "Verification", Icon: Eye },
  { label: "Signatures", Icon: Pen },
  { label: "Provenance", Icon: ScrollText },
  { label: "Integrity", Icon: Scan },
  { label: "Authenticity", Icon: BadgeCheck },
  { label: "Transparency", Icon: Layers },
  { label: "Nonce", Icon: Binary },
  { label: "Merkle", Icon: Network },
  { label: "Consensus", Icon: CheckCircle },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL-CONTROLLED MARQUEE ROW - Slower and Larger
// ═══════════════════════════════════════════════════════════════════════════════

interface MarqueeRowProps {
  items: MarqueeItem[]
  direction?: "left" | "right"
  className?: string
}

function ScrollMarqueeRow({
  items,
  direction = "left",
  className = "",
}: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Triple the items for seamless loop
  const tripleItems = [...items, ...items, ...items]

  useEffect(() => {
    if (!trackRef.current || !sectionRef.current) return

    const track = trackRef.current
    const trackWidth = track.scrollWidth / 3

    // Create scroll-controlled animation - SLOWED DOWN with larger scroll distance
    const ctx = gsap.context(() => {
      // Set initial position
      gsap.set(track, {
        x: direction === "left" ? 0 : -trackWidth,
      })

      // Animate based on scroll position - sensitivity reduced to 40% of track width
      gsap.to(track, {
        x: direction === "left" ? -trackWidth * 0.4 : -trackWidth * 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 4, // Increased scrub for buttery smoothness
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [direction])

  return (
    <section ref={sectionRef} className={className}>
      <div
        ref={containerRef}
        className="relative flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div ref={trackRef} className="flex shrink-0 gap-16 py-6 will-change-transform">
          {tripleItems.map(({ label, Icon }, index) => (
            <div
              key={`${label}-${index}`}
              className="group flex items-center gap-4 shrink-0 cursor-default"
            >
              <Icon
                className="w-6 h-6 transition-all duration-500 ease-out group-hover:scale-110"
                style={{
                  color: "rgba(0,0,0,0.25)",
                }}
              />
              <span
                className="text-sm font-mono uppercase tracking-[0.15em] transition-colors duration-500 whitespace-nowrap"
                style={{
                  color: "rgba(0,0,0,0.25)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .group:hover span {
          color: rgba(0, 0, 0, 0.75) !important;
        }
        .group:hover svg {
          color: rgba(0, 0, 0, 0.75) !important;
        }
      `}</style>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function FeatureIconsRow() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background: "#ffffff",
      }}
    >
      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent)",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Section label */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <span
          className="text-xs font-mono uppercase tracking-[0.2em]"
          style={{ color: "rgba(0,0,0,0.35)" }}
        >
          The Protocol
        </span>
      </div>

      {/* Row 1: Scrolls left as you scroll down */}
      <ScrollMarqueeRow
        items={row1Items}
        direction="left"
        className="mb-4"
      />

      {/* Row 2: Scrolls right as you scroll down */}
      <ScrollMarqueeRow items={row2Items} direction="right" />

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent)",
        }}
      />
    </section>
  )
}
