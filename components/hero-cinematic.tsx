"use client"

import Link from "next/link"
import { useEffect, useRef, useState, Suspense } from "react"
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion"
import { ArrowRight, Copy, Check } from "lucide-react"
import Lenis from "lenis"
import dynamic from "next/dynamic"

const Floating3DGeometries = dynamic(() => import("./floating-3d-geometries"), {
  ssr: false,
})



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
      className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-gray-200 bg-white"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.03), inset 0 2px 0 rgba(255,255,255,1)",
      }}
    >
      <span className="text-gray-400 font-mono text-sm font-medium">$</span>
      <span className="text-gray-800 font-mono text-sm tracking-wide">{displayedText}</span>
      <span
        className="inline-block w-[3px] h-4 rounded-full"
        style={{ 
          background: "linear-gradient(to bottom, #4285F4, #EA4335, #FBBC05, #34A853)",
          opacity: cursorVisible ? 1 : 0, 
          transition: "opacity 0.1s" 
        }}
      />
    </div>
  )
}

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

    // Delay entrance animation to allow React Three Fiber to compile shaders
    // and prevent dropping frames on initial load.
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => {
      lenis.destroy()
      clearTimeout(loadTimer)
    }
  }, [])

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const headlineWords = "Verified authorship."
  const words = headlineWords.split(" ")

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0, 0, 1] as const },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Background 3D Elements */}
      <Floating3DGeometries />

      {/* Main Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-center flex flex-col items-center gap-12"
        style={{ y, opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Brand Badge */}
          <motion.div variants={wordVariants}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8EAED",
                color: "#5F6368",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-20" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span>Cryptographic Protocol</span>
              <span className="text-gray-300">|</span>
              <span>v0.1.0</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1
            className="font-bold leading-[1.12] tracking-tight text-[#202124]"
            style={{
              fontSize: "clamp(50px, 8vw, 100px)",
              letterSpacing: "-0.03em",
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[2vw] last:mr-0"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={wordVariants}
            className="max-w-3xl text-xl md:text-2xl leading-relaxed text-[#5F6368] mt-2"
          >
            Cryptographic integrity in the age of generative code. 
            <span className="font-semibold text-[#202124]"> Sign your work.</span>
            <span className="font-semibold text-[#202124]"> Prove you wrote it.</span>
          </motion.p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* CTA Buttons */}
          <motion.div
            variants={wordVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/registry">
              <motion.button
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-[15px] text-white overflow-hidden shadow-lg"
                style={{
                  background: "rgba(0, 0, 0, 0.85)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.95)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/protocol">
              <motion.button
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-[15px] text-[#202124]"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)"
                }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                whileTap={{ scale: 0.98 }}
              >
                View Documentation
              </motion.button>
            </Link>
          </motion.div>

          {/* Terminal Code Block */}
          <motion.div
            variants={wordVariants}
            className="flex items-center gap-3"
          >
            <TerminalTyping startDelay={1000} />
            <motion.button
              onClick={copyInstall}
              className="p-4 rounded-full text-gray-400 hover:text-gray-800 transition-colors bg-white border border-gray-200 hover:border-gray-300"
              style={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
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
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

