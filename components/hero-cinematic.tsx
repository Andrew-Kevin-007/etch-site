"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Copy, Check, ArrowRight, ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

import Antigravity from "@/components/ui/antigravity"

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const HERO_PARTICLE_GRADIENT = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"] as const

const FLOATING_ORBS = [
  { size: 600, x: "20%", y: "30%", color: "rgba(99, 102, 241, 0.15)", blur: 120 },
  { size: 400, x: "80%", y: "60%", color: "rgba(139, 92, 246, 0.12)", blur: 100 },
  { size: 300, x: "70%", y: "20%", color: "rgba(236, 72, 153, 0.1)", blur: 80 },
  { size: 500, x: "10%", y: "70%", color: "rgba(6, 182, 212, 0.08)", blur: 140 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function MagneticButton({ children, className, ...props }: React.ComponentProps<typeof motion.button>) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL TYPING EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

function TerminalTyping({ startDelay = 0 }: { startDelay?: number }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
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
      }, 60)

      return () => clearInterval(timer)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [startDelay])

  // Cursor blink effect
  useEffect(() => {
    if (!isComplete) return
    const blinkTimer = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(blinkTimer)
  }, [isComplete])

  return (
    <div
      className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border border-white/10"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <span className="text-emerald-400 font-mono text-sm font-medium">$</span>
      <span className="text-white/90 font-mono text-sm tracking-wide">{displayedText}</span>
      <span
        className="inline-block w-[2px] h-4 bg-emerald-400/80"
        style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING ORB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function FloatingOrb({ size, x, y, color, blur, delay = 0 }: {
  size: number
  x: string
  y: string
  color: string
  blur: number
  delay?: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: [1, 1.1, 1],
        y: ["-50%", "-55%", "-50%"],
      }}
      transition={{
        opacity: { duration: 1.5, delay },
        scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay + 1 },
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HERO CINEMATIC COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const copyInstall = useCallback(() => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
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

    return () => lenis.destroy()
  }, [])

  // GSAP entrance animations
  useEffect(() => {
    setIsLoaded(true)

    if (!headlineRef.current) return

    const ctx = gsap.context(() => {
      // Split text animation
      const chars = headlineRef.current?.querySelectorAll(".char")
      if (chars) {
        gsap.fromTo(
          chars,
          {
            y: 100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: "power4.out",
            delay: 0.5,
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // Split headline into characters for animation
  const headlineText = "Human authorship."
  const headlineChars = useMemo(() => {
    return headlineText.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #12121f 100%)",
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating orbs */}
        {FLOATING_ORBS.map((orb, index) => (
          <FloatingOrb key={index} {...orb} delay={index * 0.2} />
        ))}
      </div>

      {/* Interactive Antigravity Particles */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <Antigravity
          count={420}
          magnetRadius={12}
          ringRadius={8}
          waveSpeed={0.5}
          waveAmplitude={1.2}
          particleSize={1.8}
          lerpSpeed={0.05}
          colorGradient={HERO_PARTICLE_GRADIENT}
          internalGradientStrength={0.85}
          rimStrength={0.6}
          glowStrength={1.2}
          particleOpacity={0.75}
          additiveBlend
          autoAnimate
          particleVariance={1}
          depthFactor={1.2}
          pulseSpeed={2.5}
          particleShape="capsule"
          fieldStrength={12}
        />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(10,10,15,0.4) 70%, rgba(10,10,15,0.9) 100%),
            radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Main Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center gap-8"
        style={{ y, opacity, scale }}
      >
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Cryptographic Protocol
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">v0.1.0</span>
          </span>
        </motion.div>

        {/* Main Headline with 3D Character Animation */}
        <h1
          ref={headlineRef}
          className="font-bold leading-[1.1] tracking-tight text-white"
          style={{
            fontSize: "clamp(48px, 10vw, 100px)",
            letterSpacing: "-0.03em",
            perspective: "1000px",
            textShadow: "0 0 80px rgba(99,102,241,0.3)",
          }}
        >
          {headlineChars}
        </h1>

        {/* Animated Gradient Line */}
        <motion.div
          className="h-1 w-32 rounded-full"
          style={{
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
            backgroundSize: "300% 100%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-xl leading-relaxed font-light"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          etch is a cryptographic protocol that preserves and verifies human authorship
          in software.{" "}
          <span className="text-white/90 font-medium">Sign your code.</span>{" "}
          <span className="text-white/90 font-medium">Prove you wrote it.</span>{" "}
          <span className="text-emerald-400 font-medium">Build trust forever.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Link href="/registry">
            <MagneticButton
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-sm text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 0 40px rgba(99,102,241,0.4), 0 4px 20px rgba(0,0,0,0.3)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">Install etch</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Link>

          <Link href="/protocol">
            <MagneticButton
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-sm text-white/80 border border-white/10 backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Read Protocol
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Terminal Code Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          className="flex items-center gap-3 mt-6"
        >
          <TerminalTyping startDelay={2000} />
          <motion.button
            onClick={copyInstall}
            className="p-4 rounded-xl text-white/40 hover:text-white/80 transition-all border border-white/5 hover:border-white/20 backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy install command"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-5 w-5 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Copy className="h-5 w-5" />
                </motion.div>
              )}
}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex items-center gap-8 mt-8 pt-8 border-t border-white/5"
        >
          {[
            { value: "∞", label: "Forever" },
            { value: "100%", label: "Verified" },
            { value: "0", label: "Trust Required" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white/90">{stat.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ zIndex: 10 }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/30">
          Scroll to explore
        </span>
        <motion.div
          className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2"
          animate={{ borderColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white/60"
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
