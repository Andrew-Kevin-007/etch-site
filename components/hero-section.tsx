"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"

// ─── Interactive Repulsion Particle System (Antigravity-style) ────────────────
import Antigravity from "@/components/ui/antigravity"

const HERO_PARTICLE_GRADIENT = ["#4285f4", "#34a853", "#fbbc05", "#ea4335"] as const

// ─── Typing Code Snippet ──────────────────────────────────────────────────────
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
        clearInterval(timer)
        onComplete?.()
      }
    }, 75)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <span className="text-white font-mono text-sm">
      <span style={{ color: "#888" }}>$ </span>
      {displayedText}
      <motion.span
        className="inline-block w-[2px] h-4 ml-0.5 align-middle"
        style={{ background: "#fff" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const copyInstall = useCallback(() => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
      style={{ background: "linear-gradient(180deg, #f0f4ff 0%, #eef2ff 60%, #f5f0ff 100%)" }}
    >
      {/* Ambient edge glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)",
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(156,39,176,0.06) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(52,168,83,0.05) 0%, transparent 70%)",
            transform: "translate(-50%, 30%)",
          }}
        />
      </div>

      {/* Interactive repulsion particles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <Antigravity
          count={380}
          magnetRadius={10}
          ringRadius={7.6}
          waveSpeed={0.46}
          waveAmplitude={1.05}
          particleSize={1.58}
          lerpSpeed={0.06}
          colorGradient={HERO_PARTICLE_GRADIENT}
          internalGradientStrength={0.82}
          rimStrength={0.54}
          glowStrength={1.05}
          particleOpacity={0.7}
          additiveBlend
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      {/* Content */}
      <div
        className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8"
        style={{ zIndex: 10 }}
      >
        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#444",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            etch · Open Source · v0.1.0
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0, 0, 1] }}
          className="font-bold leading-tight tracking-tight"
          style={{ fontSize: "clamp(48px, 8vw, 82px)", color: "#1a1a1a" }}
        >
          Human authorship.
          <br />
          Etched forever.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="max-w-2xl leading-relaxed"
          style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#5f6368" }}
        >
          etch is a cryptographic protocol that preserves and verifies human authorship
          in software. Sign your code. Prove you wrote it. Build trust that lasts forever.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/registry"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
            style={{ background: "#202124", borderRadius: "999px" }}
          >
            Install etch →
          </Link>
          <Link
            href="/protocol"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(241,243,244,0.9)",
              color: "#202124",
              borderRadius: "999px",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            Read Protocol
          </Link>
        </motion.div>

        {/* Install snippet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl"
            style={{ background: "#1a1a1a" }}
          >
            <TypingCode />
            <button
              onClick={copyInstall}
              className="ml-1 p-1.5 rounded-md transition-colors hover:bg-white/10"
              aria-label="Copy install command"
              style={{ color: "#888" }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span className="text-xs font-mono" style={{ color: "#aaa" }}>scroll</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #aaa, transparent)" }} />
      </motion.div>
    </section>
  )
}
