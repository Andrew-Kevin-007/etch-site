"use client"

import { motion } from "framer-motion"

const terminalLines = [
  { text: "$ etch init", color: "#e8e8e8" },
  { text: "> Generating Ed25519 keypair...", color: "#888" },
  { text: "> Identity created ✓", color: "#34a853" },
  { text: "", color: "" },
  { text: "$ etch sign auth/login.ts", color: "#e8e8e8" },
  { text: "> Computing SHA-256 hash...", color: "#888" },
  { text: "> Signing with private key...", color: "#888" },
  { text: "> Signature anchored ✓  [chain: 1]", color: "#34a853" },
  { text: "", color: "" },
  { text: "$ etch verify auth/login.ts", color: "#e8e8e8" },
  { text: "> Verified · ehsanghaffar · Chain: 6 ✓", color: "#4285f4" },
]

function TerminalCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
      className="relative rounded-3xl overflow-hidden w-full max-w-2xl mx-auto"
      style={{
        background: "#1a1a1a",
        boxShadow: "0 32px 80px rgba(66,133,244,0.12), 0 8px 24px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ea4335", opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#fbbc04", opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#34a853", opacity: 0.7 }} />
        </div>
        <span className="text-xs font-mono mx-auto" style={{ color: "#555" }}>
          terminal://etch
        </span>
      </div>

      {/* Terminal content */}
      <div className="p-6 font-mono text-sm leading-7">
        {terminalLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
            style={{ color: line.color || "transparent", minHeight: "1.75rem" }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>

      {/* Blue glow overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(66,133,244,0.08), transparent)" }}
      />
    </motion.div>
  )
}

export function CryptoCoreCard() {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: "#f8f9ff" }}
    >
      {/* Blue glow behind card */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(66,133,244,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h2
            className="font-display font-medium leading-tight"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", color: "#1a1a1a" }}
          >
            A Cryptographic Core
          </h2>
          <p className="max-w-lg mx-auto font-sans text-lg leading-relaxed font-normal" style={{ color: "#5f6368" }}>
            etch uses Ed25519 keypairs to anchor every file state to a verified human identity.
            Your private key never leaves your machine.
          </p>
        </motion.div>

        {/* Terminal card */}
        <TerminalCard />
      </div>
    </section>
  )
}
