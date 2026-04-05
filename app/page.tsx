"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Copy, Check, Shield, Lock, Database } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

// ============================================
// CURSOR TRAIL PARTICLES - Floating dashes
// ============================================
function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    rotation: number
    opacity: number
    color: string
  }>>([])
  const mouseMoveCountRef = useRef(0)

  const colors = ["#00c896", "#94a3b8", "#64748b", "#00b4d8"]

  const spawnParticles = useCallback((x: number, y: number) => {
    const count = 2 + Math.floor(Math.random() * 2) // 2-3 particles

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 20 // ±10px
      const offsetY = (Math.random() - 0.5) * 20 // ±10px
      const vx = (Math.random() - 0.5) * 3 // ±1.5
      const vy = -2 - Math.random() * 2 // -2 to -4
      const color = colors[Math.floor(Math.random() * colors.length)]

      particlesRef.current.push({
        x: x + offsetX,
        y: y + offsetY,
        vx,
        vy,
        rotation: Math.random() * 360,
        opacity: 0.7,
        color,
      })
    }
  }, [colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseMoveCountRef.current += 1

      // Throttle: spawn only every 3rd mousemove event
      if (mouseMoveCountRef.current % 3 === 0) {
        spawnParticles(e.clientX, e.clientY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => {
        // Apply physics
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15 // gravity
        p.rotation += 2 // rotation increases each frame
        p.opacity -= 0.7 / 1200 // fade over 1200ms (at ~60fps = ~0.00058 per frame)

        if (p.opacity <= 0) return false

        // Draw rectangular dash (6x2px)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillRect(-3, -1, 6, 2) // width: 6px, height: 2px
        ctx.restore()

        return true
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [spawnParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
}

// ============================================
// LETTER STAGGER ANIMATION - "Code changes."
// ============================================
function LetterStaggerText({ text }: { text: string }) {
  const letters = text.split("")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 1,
      },
    },
  }

  return (
    <motion.h2
      className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, i) => (
        <motion.span key={i} variants={letterVariants} className="inline-block">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h2>
  )
}

// ============================================
// WORD SLIDE UP - "Authorship shouldn't."
// ============================================
function WordSlideUpText({ text }: { text: string }) {
  const words = text.split(" ")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }

  return (
    <motion.h2
      className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#00c896]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-hidden">
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariants} className="inline-block mr-4">
            {word}
          </motion.span>
        ))}
      </div>
    </motion.h2>
  )
}

// ============================================
// SCROLL-Linked Horizontal Text
// ============================================
function HorizontalScrollText() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <motion.div ref={ref} style={{ x }}>
      <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
        <span className="text-[#0a0a0a] line-through decoration-[#00c896]/40 decoration-2">
          AI can generate code.
        </span>
        <br />
        <span className="text-[#666]">It cannot take responsibility.</span>
      </h2>
    </motion.div>
  )
}

// ============================================
// Scroll-based 3D Tilt Card (rotateX on scroll)
// ============================================
function ScrollTiltCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        scale,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// Scale-on-scroll Section
// ============================================
function ScaleOnScrollSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// TYPING ANIMATION - Code block
// ============================================
function TypingCode({ onComplete }: { onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("")
  const fullText = "cargo install etch"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        onComplete?.()
      }
    }, 80)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <span className="text-white">
      <span className="text-[#666]">$ </span>
      {displayedText}
      <motion.span
        className="inline-block w-2 h-5 bg-[#00c896] ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  )
}

// ============================================
// WAVE DIVIDER - SVG curved transition
// ============================================
function WaveDivider() {
  return (
    <div className="relative h-32 -mb-1">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64 C288,120 576,0 864,64 C1152,128 1440,32 1440,32 L1440,120 L0,120 Z"
          fill="#0a0a0a"
        />
      </svg>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-sans selection:bg-[#00c896]/20">
      {/* Canvas particle layer */}
      <CursorParticles />

      <Header />

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-20">
        {/* Static ambient gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#00c896]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-[#00c896]/8 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          {/* Version badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a]/5 text-xs font-medium text-[#0a0a0a]/60 border border-[#0a0a0a]/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00c896] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00c896]" />
            </span>
            Open Source · v0.1.0
          </motion.div>

          {/* Hero text - Letter stagger + Word slide up */}
          <div className="space-y-2">
            <LetterStaggerText text="Code changes." />
            <WordSlideUpText text="Authorship shouldn't." />
          </div>

          {/* Subheadline - fades in after headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-[#666] max-w-3xl mx-auto leading-relaxed"
          >
            etch is a cryptographic protocol that preserves human authorship in software.
            Built for developers. Trusted by open source.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/registry"
              className="group inline-flex h-12 items-center justify-center px-8 rounded-full bg-[#0a0a0a] text-white font-medium hover:bg-[#0a0a0a]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Install etch
              <motion.span
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </Link>
            <Link
              href="/registry"
              className="inline-flex h-12 items-center justify-center px-8 rounded-full border border-[#0a0a0a]/20 text-[#0a0a0a] font-medium hover:bg-[#0a0a0a]/5 transition-all hover:-translate-y-0.5"
            >
              View Registry
            </Link>
          </motion.div>

          {/* Install snippet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="pt-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0a0a0a] text-white font-mono text-sm shadow-xl">
              <TypingCode />
              <button
                onClick={copyInstall}
                className="ml-2 p-1.5 text-[#666] hover:text-white transition-colors rounded-md hover:bg-white/10"
                aria-label="Copy command"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-4 w-4 text-[#00c896]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Wave divider to dark section */}
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider />
        </div>
      </section>

      {/* PROBLEM SECTION - Horizontal scroll-linked text */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Horizontal scroll-linked text */}
            <HorizontalScrollText />

            {/* Right: Cards */}
            <div className="grid gap-6">
              <ScrollTiltCard delay={0.1}>
                <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                  <Shield className="h-8 w-8 text-[#00c896] mb-4" />
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Ed25519</h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    Cryptographic keypairs generated locally. Your private key never leaves your machine.
                  </p>
                </div>
              </ScrollTiltCard>

              <ScrollTiltCard delay={0.2}>
                <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                  <Database className="h-8 w-8 text-[#00c896] mb-4" />
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Append-Only</h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    Signatures linked in an immutable chain. History that cannot be rewritten or forged.
                  </p>
                </div>
              </ScrollTiltCard>

              <ScrollTiltCard delay={0.3}>
                <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                  <Lock className="h-8 w-8 text-[#00c896] mb-4" />
                  <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Open Source</h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    Transparent, auditable, and built by the community. Trust through verification.
                  </p>
                </div>
              </ScrollTiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
              Three commands. Proven authorship.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <ScrollTiltCard delay={0.1}>
              <div className="group p-8 rounded-2xl bg-white border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-xl hover:shadow-[#00c896]/5 hover:-translate-y-1">
                <div className="text-6xl font-bold text-[#00c896]/20 mb-4">01</div>
                <h3 className="text-2xl font-semibold text-[#0a0a0a] mb-2">etch init</h3>
                <p className="text-[#666] text-sm mb-6 leading-relaxed">
                  Generate your unique Ed25519 keypair locally on your machine.
                </p>
                <div className="p-4 rounded-xl bg-[#0a0a0a] font-mono text-sm">
                  <div className="text-white"><span className="text-[#666]">$</span> etch init</div>
                  <div className="text-[#666] mt-2 text-xs">&gt; Identity created</div>
                </div>
              </div>
            </ScrollTiltCard>

            {/* Step 2 */}
            <ScrollTiltCard delay={0.2}>
              <div className="group p-8 rounded-2xl bg-white border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-xl hover:shadow-[#00c896]/5 hover:-translate-y-1">
                <div className="text-6xl font-bold text-[#00c896]/20 mb-4">02</div>
                <h3 className="text-2xl font-semibold text-[#0a0a0a] mb-2">etch sign</h3>
                <p className="text-[#666] text-sm mb-6 leading-relaxed">
                  Cryptographically anchor your file state to your identity.
                </p>
                <div className="p-4 rounded-xl bg-[#0a0a0a] font-mono text-sm">
                  <div className="text-white"><span className="text-[#666]">$</span> etch sign myfile.rs</div>
                  <div className="text-[#00c896] mt-2 text-xs">&gt; Signature anchored ✓</div>
                </div>
              </div>
            </ScrollTiltCard>

            {/* Step 3 */}
            <ScrollTiltCard delay={0.3}>
              <div className="group p-8 rounded-2xl bg-white border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-xl hover:shadow-[#00c896]/5 hover:-translate-y-1">
                <div className="text-6xl font-bold text-[#00c896]/20 mb-4">03</div>
                <h3 className="text-2xl font-semibold text-[#0a0a0a] mb-2">etch verify</h3>
                <p className="text-[#666] text-sm mb-6 leading-relaxed">
                  Verify provenance against the immutable registry anytime.
                </p>
                <div className="p-4 rounded-xl bg-[#0a0a0a] font-mono text-sm">
                  <div className="text-white"><span className="text-[#666]">$</span> etch verify myfile.rs</div>
                  <div className="text-[#00c896] mt-2 text-xs">&gt; Verified · Chain: 6 ✓</div>
                </div>
              </div>
            </ScrollTiltCard>
          </div>
        </div>
      </section>

      {/* PRINCIPLE SECTION - Dark with scale animation */}
      <section className="py-32 bg-[#0a0a0a] relative">
        <ScaleOnScrollSection>
          <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              AI can carry code.
            </h2>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#00c896]">
              Only humans can sign it.
            </h2>
            <p className="text-xl text-[#666] max-w-3xl mx-auto leading-relaxed pt-4">
              etch ensures developers remain visible, accountable, and credited —
              even as AI transforms everything around them.
            </p>
          </div>
        </ScaleOnScrollSection>
      </section>

      <Footer />
    </div>
  )
}
