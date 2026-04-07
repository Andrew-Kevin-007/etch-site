"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

// Import the Antigravity particle component
gsap.registerPlugin(ScrollTrigger)

// Dynamic import for Antigravity to avoid SSR issues
import dynamic from "next/dynamic"
const Antigravity = dynamic(() => import("@/components/ui/antigravity"), {
  ssr: false,
})

// Classic Google Antigravity - multicolored brand colors
const HERO_PARTICLE_GRADIENT = [
  "#4285F4", // Google Blue
  "#EA4335", // Google Red
  "#FBBC05", // Google Yellow
  "#34A853", // Google Green
] as const

// ═══════════════════════════════════════════════════════════════════════════════
// ANNOTATION COMPONENT - "Hand-drawn" SVG sketches and monospaced notes
// ═══════════════════════════════════════════════════════════════════════════════

function Annotation({ 
  text, 
  className, 
  delay = 0,
  position = "top-right",
  sketchType = "circle" 
}: { 
  text: string, 
  className?: string, 
  delay?: number,
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right",
  sketchType?: "circle" | "underline" | "arrow" | "box"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0, 0, 1] }}
      className={`absolute z-20 pointer-events-none flex flex-col items-center gap-2 ${className}`}
    >
      <div className="relative">
        <svg 
          width="120" 
          height="40" 
          viewBox="0 0 120 40" 
          fill="none" 
          className="text-blue-500/30"
        >
          {sketchType === "circle" && (
            <motion.path
              d="M10,20 Q10,5 60,5 Q110,5 110,20 Q110,35 60,35 Q10,35 10,20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeInOut" }}
            />
          )}
          {sketchType === "underline" && (
            <motion.path
              d="M5,35 Q30,32 60,35 Q90,38 115,35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeInOut" }}
            />
          )}
          {sketchType === "arrow" && (
            <motion.path
              d="M10,10 Q40,5 70,25 M70,25 L60,20 M70,25 L65,30"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: delay + 0.5, ease: "easeInOut" }}
            />
          )}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono tracking-tight text-blue-600/60 whitespace-nowrap px-4">
          {text}
        </span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL TYPING EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

function TerminalTyping({ startDelay = 0 }: { startDelay?: number }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const fullText = "cargo install etch"

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0
      const timer = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayedText(fullText.slice(0, index))
          index++
        } else {
          clearInterval(timer)
          setIsComplete(true)
        }
      }, 75)

      return () => clearInterval(timer)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [startDelay])

  return (
    <div
      className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{
        background: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <span className="text-black/30 font-mono text-sm">$</span>
      <span className="text-black/70 font-mono text-sm">{displayedText}</span>
      <motion.span
        className="inline-block w-[2px] h-4 bg-black/40"
        animate={isComplete ? { opacity: [1, 0, 1] } : { opacity: 1 }}
        transition={
          isComplete
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HERO CINEMATIC COMPONENT - Light Theme with Antigravity Particles
// ═══════════════════════════════════════════════════════════════════════════════

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [animationsComplete, setAnimationsComplete] = useState(false)

  const copyInstall = useCallback(() => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  // GSAP SplitText-style character animation
  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return

    const splitIntoChars = (element: HTMLElement) => {
      const text = element.textContent || ""
      element.textContent = ""
      const chars: HTMLSpanElement[] = []

      text.split("").forEach((char) => {
        const span = document.createElement("span")
        span.textContent = char === " " ? "\u00A0" : char
        span.style.display = "inline-block"
        span.style.opacity = "0"
        span.style.transform = "translateY(40px)"
        element.appendChild(span)
        chars.push(span)
      })

      return chars
    }

    const chars1 = splitIntoChars(line1Ref.current)
    const chars2 = splitIntoChars(line2Ref.current)

    const tl = gsap.timeline({
      onComplete: () => setAnimationsComplete(true),
    })

    // Line 1: characters stagger in from below
    tl.to(chars1, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.012,
      ease: "power4.out",
    })

    // Line 2: characters stagger in from below
    tl.to(
      chars2,
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.012,
        ease: "power4.out",
      },
      "-=1.0"
    )

    // Subtitle: fade in after headline completes
    tl.fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 0.7,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "expo.out",
      },
      "-=0.8"
    )

    // CTA reveal
    tl.fromTo(
      ctaRef.current,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" },
      "-=1.0"
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Scroll-based parallax exit effect
  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "50% top",
          scrub: 0.5,
        },
        y: -80,
        opacity: 0.2,
        scale: 0.95,
        ease: "none",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#ffffff",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Antigravity particle system - classic magnetic repulsion effect */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <Antigravity
          count={450}
          magnetRadius={18}
          ringRadius={12}
          waveSpeed={0.6}
          waveAmplitude={1.2}
          particleSize={2.2}
          lerpSpeed={0.04}
          colorGradient={HERO_PARTICLE_GRADIENT}
          internalGradientStrength={0.85}
          rimStrength={0.6}
          glowStrength={1.2}
          particleOpacity={0.65}
          additiveBlend={false}
          autoAnimate={true}
          particleVariance={1.2}
          rotationSpeed={0.003}
          depthFactor={1.2}
          pulseSpeed={1.8}
          particleShape="sphere"
          fieldStrength={12}
        />
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.9) 100%)",
        }}
      />

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6"
        style={{ zIndex: 10 }}
      >
        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          className="relative"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500/40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            Verified Human Protocol · v0.1.0
          </span>
        </motion.div>

        {/* Headline with GSAP SplitText animation */}
        <div className="flex flex-col relative">
          <div
            ref={line1Ref}
            className="font-display font-medium leading-[1.05] tracking-tight text-black overflow-hidden"
            style={{
              fontSize: "clamp(46px, 9vw, 92px)",
              letterSpacing: "-0.04em",
            }}
          >
            Human
          </div>
          <div
            ref={line2Ref}
            className="font-display font-medium leading-[1.05] tracking-tight text-black overflow-hidden"
            style={{
              fontSize: "clamp(46px, 9vw, 92px)",
              letterSpacing: "-0.04em",
            }}
          >
            authorship.
          </div>
          
          <Annotation 
            text="Signed by You" 
            className="-right-12 top-0 rotate-6 hidden lg:flex" 
            delay={2.2} 
            sketchType="circle"
          />
          
          <Annotation 
            text="Verified Human" 
            className="-left-20 bottom-12 -rotate-12 hidden lg:flex" 
            delay={2.8} 
            sketchType="underline"
          />
        </div>

        {/* Subtitle - fades in after headline */}
        <p
          ref={subtitleRef}
          className="max-w-2xl font-sans text-lg md:text-xl leading-relaxed font-normal"
          style={{
            color: "rgba(0,0,0,0.6)",
          }}
        >
          etch is the world's first cryptographic playground that preserves 
          and verifies human authorship in software. Sign your code. 
          Prove you wrote it. Build trust that lasts forever.
        </p>

        {/* CTA Buttons with spring physics */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-5 mt-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Link
              href="/registry"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-sm text-white bg-blue-600 transition-all hover:bg-blue-700 hover:shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Link
              href="/protocol"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-sm text-black border border-black/10 bg-white/50 backdrop-blur-sm hover:bg-black/5 transition-all"
            >
              Read Protocol
            </Link>
          </motion.div>
        </div>

        {/* Terminal typing code block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animationsComplete ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mt-4"
        >
          <TerminalTyping startDelay={0} />
          <motion.button
            onClick={copyInstall}
            className="p-2.5 rounded-lg text-black/30 hover:text-black/70 hover:bg-black/5 transition-all border border-black/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy install command"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Copy className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-black/30">
          scroll
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-black/30 to-transparent"
          animate={{ scaleY: [1, 0.6, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}
