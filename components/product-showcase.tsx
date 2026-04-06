"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

// ─── Colored Dot Logo Canvas ──────────────────────────────────────────────────
function EtchDotLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    // Define the letter "E" as a dot grid (9 cols x 11 rows)
    const letterE = [
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,0,0,0,0,0],
      [1,1,0,0,0,0,0],
      [1,1,1,1,1,0,0],
      [1,1,1,1,1,0,0],
      [1,1,0,0,0,0,0],
      [1,1,0,0,0,0,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
    ]

    const cols = letterE[0].length
    const rows = letterE.length
    const dotSpacing = 18
    const dotRadius = 4.5

    // Color bands from top to bottom: red → blue → green
    const getColor = (row: number, col: number): string => {
      const t = row / rows
      if (t < 0.25) return "#ea4335"       // red
      if (t < 0.5)  return "#fbbc04"       // yellow
      if (t < 0.75) return "#4285f4"       // blue
      return "#34a853"                      // green
    }

    // Subtle float animation
    let animFrame: number
    let tick = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const startX = cx - ((cols - 1) * dotSpacing) / 2
      const startY = cy - ((rows - 1) * dotSpacing) / 2

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!letterE[r][c]) continue

          const x = startX + c * dotSpacing
          const floatY = startY + r * dotSpacing + Math.sin(tick * 0.02 + (r + c) * 0.4) * 2.5

          const color = getColor(r, c)

          // Glow
          const grad = ctx.createRadialGradient(x, floatY, 0, x, floatY, dotRadius * 3)
          grad.addColorStop(0, color + "60")
          grad.addColorStop(1, "transparent")
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(x, floatY, dotRadius * 3, 0, Math.PI * 2)
          ctx.fill()

          // Dot
          ctx.fillStyle = color
          ctx.globalAlpha = 0.9
          ctx.beginPath()
          ctx.arc(x, floatY, dotRadius, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      tick++
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className="mx-auto"
      style={{ filter: "drop-shadow(0 0 32px rgba(66,133,244,0.3))" }}
    />
  )
}

// ─── Wave Particle Background ─────────────────────────────────────────────────
function WaveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let animFrame: number
    let tick = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cols = Math.floor(canvas.width / 22)
      const rows = Math.floor(canvas.height / 22)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * 22 + 11
          const y = r * 22 + 11
          const wave = Math.sin(tick * 0.025 + c * 0.35 + r * 0.35)
          const opacity = 0.03 + (wave + 1) * 0.05

          ctx.fillStyle = `rgba(255,255,255,${opacity})`
          ctx.beginPath()
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      tick++
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ─── Product Showcase ─────────────────────────────────────────────────────────
export function ProductShowcase() {
  return (
    <section
      className="relative overflow-hidden py-24 flex flex-col items-center justify-center"
      style={{ background: "#0a0a0a", minHeight: "60vh" }}
    >
      <WaveParticles />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
        {/* Dot logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        >
          <EtchDotLogo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-sm font-mono tracking-widest uppercase" style={{ color: "#555" }}>
            etch protocol · v0.1.0
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-xl leading-tight">
            See how etch seals your identity into every commit
          </h2>
          <p className="text-base max-w-md leading-relaxed" style={{ color: "#666" }}>
            Every signature is cryptographically bound to your Ed25519 keypair and
            anchored in an append-only public registry.
          </p>

          {/* Play-style CTA */}
          <motion.a
            href="/protocol"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-2 inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-sm"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10"
              style={{ fontSize: "10px" }}
            >
              ▶
            </span>
            Read the Protocol
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
