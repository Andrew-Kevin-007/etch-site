"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Copy, Check, Shield, Lock, Database } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence, Variants } from "framer-motion"

// ============================================
// CURSOR SPOTLIGHT - Large radial gradient following cursor
// ============================================
function Spotlight() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for lag effect
  const springConfig = { damping: 30, stiffness: 180, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(0, 200, 150, 0.03), transparent 40%)`,
      }}
    />
  )
}

// ============================================
// 3D TILT CARD - Perspective transform on mouse move
// ============================================
function TiltCard({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const width = rect.width
    const height = rect.height
    const xPct = (e.clientX - rect.left) / width - 0.5
    const yPct = (e.clientY - rect.top) / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={className}
    >
      <motion.div
        style={{ transform: "translateZ(30px)" }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// MAGNETIC BUTTON - Pulls toward cursor when nearby
// ============================================
function MagneticButton({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 200 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      const magneticDistance = 100
      if (distance < magneticDistance) {
        const strength = (1 - distance / magneticDistance) * 0.4
        x.set(deltaX * strength)
        y.set(deltaY * strength)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// PARALLAX TEXT - Moves at different scroll speeds
// ============================================
function ParallaxText({
  children,
  speed = 0.5,
  className = ""
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// ============================================
// STAGGERED WORD REVEAL - Each word animates in
// ============================================
function StaggeredHeadline() {
  const words = ["Code", "changes.", "Authorship", "shouldn't."]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }

  return (
    <motion.h1
      className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.05]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="overflow-hidden">
        <motion.span variants={wordVariants}>Code</motion.span>{" "}
        <motion.span variants={wordVariants}>changes.</motion.span>
      </div>
      <div className="overflow-hidden">
        <motion.span variants={wordVariants} className="text-[#00c896]">
          Authorship
        </motion.span>{" "}
        <motion.span variants={wordVariants} className="text-[#00c896]">
          shouldn&apos;t.
        </motion.span>
      </div>
    </motion.h1>
  )
}

// ============================================
// SCROLL REVEAL SECTION - Spring physics on viewport entry
// ============================================
function RevealSection({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }}
      className={className}
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
  const heroRef = useRef<HTMLDivElement>(null)

  const copyInstall = () => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-sans selection:bg-[#00c896]/20">
      {/* Global cursor spotlight */}
      <Spotlight />

      <Header />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-20"
      >
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

          {/* Parallax + Staggered headline */}
          <ParallaxText speed={0.5}>
            <StaggeredHeadline />
          </ParallaxText>

          {/* Subheadline with parallax */}
          <ParallaxText speed={0.3}>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-xl md:text-2xl text-[#666] max-w-3xl mx-auto leading-relaxed"
            >
              etch is a cryptographic protocol that preserves human authorship in software.
              Built for developers. Trusted by open source.
            </motion.p>
          </ParallaxText>

          {/* Magnetic CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <MagneticButton>
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
            </MagneticButton>

            <MagneticButton>
              <Link
                href="/registry"
                className="inline-flex h-12 items-center justify-center px-8 rounded-full border border-[#0a0a0a]/20 text-[#0a0a0a] font-medium hover:bg-[#0a0a0a]/5 transition-all hover:-translate-y-0.5"
              >
                View Registry
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Install snippet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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

      {/* PROBLEM SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Large text */}
            <RevealSection>
              <div className="space-y-6">
                <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
                  <span className="text-[#0a0a0a] line-through decoration-[#00c896]/40 decoration-2">
                    AI can generate code.
                  </span>
                  <br />
                  <span className="text-[#666]">It cannot take responsibility.</span>
                </h2>
              </div>
            </RevealSection>

            {/* Right: 3D Tilt cards */}
            <div className="grid gap-6">
              <RevealSection delay={0.1}>
                <TiltCard>
                  <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                    <Shield className="h-8 w-8 text-[#00c896] mb-4" />
                    <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Ed25519</h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Cryptographic keypairs generated locally. Your private key never leaves your machine.
                    </p>
                  </div>
                </TiltCard>
              </RevealSection>

              <RevealSection delay={0.2}>
                <TiltCard>
                  <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                    <Database className="h-8 w-8 text-[#00c896] mb-4" />
                    <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Append-Only</h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Signatures linked in an immutable chain. History that cannot be rewritten or forged.
                    </p>
                  </div>
                </TiltCard>
              </RevealSection>

              <RevealSection delay={0.3}>
                <TiltCard>
                  <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                    <Lock className="h-8 w-8 text-[#00c896] mb-4" />
                    <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Open Source</h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Transparent, auditable, and built by the community. Trust through verification.
                    </p>
                  </div>
                </TiltCard>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
                Three commands. Proven authorship.
              </h2>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <RevealSection delay={0.1}>
              <TiltCard>
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
              </TiltCard>
            </RevealSection>

            {/* Step 2 */}
            <RevealSection delay={0.2}>
              <TiltCard>
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
              </TiltCard>
            </RevealSection>

            {/* Step 3 */}
            <RevealSection delay={0.3}>
              <TiltCard>
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
              </TiltCard>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* PRINCIPLE SECTION - Dark with wave entry */}
      <section className="py-32 bg-[#0a0a0a] relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <RevealSection>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              AI can carry code.
            </h2>
          </RevealSection>
          <RevealSection delay={0.15}>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#00c896]">
              Only humans can sign it.
            </h2>
          </RevealSection>
          <RevealSection delay={0.3}>
            <p className="text-xl text-[#666] max-w-3xl mx-auto leading-relaxed pt-4">
              etch ensures developers remain visible, accountable, and credited —
              even as AI transforms everything around them.
            </p>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
