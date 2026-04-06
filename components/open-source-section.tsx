"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"

const mockSignatures = [
  {
    file: "auth/login.ts",
    author: "ehsanghaffar",
    time: "2 min ago",
    chain: 6,
    status: "verified",
    border: "#ea4335",
  },
  {
    file: "lib/crypto.rs",
    author: "alice_dev",
    time: "18 min ago",
    chain: 3,
    status: "verified",
    border: "#4285f4",
  },
  {
    file: "core/protocol.go",
    author: "bob_open",
    time: "1 hr ago",
    chain: 12,
    status: "verified",
    border: "#34a853",
  },
]

function RegistryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fce4ec 0%, #e8eaf6 40%, #e0f7fa 100%)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        minHeight: "360px",
      }}
    >
      {/* Card inner glass panel */}
      <div
        className="absolute inset-3 rounded-2xl flex flex-col"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: "#1a1a1a" }}>
              etch registry · live
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: "#888" }}>registry.etch.dev</span>
        </div>

        {/* Signature items */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          {mockSignatures.map((sig, i) => (
            <motion.div
              key={sig.file}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: `1px solid ${sig.border}30`,
                boxShadow: `0 0 0 1px ${sig.border}15`,
              }}
            >
              <div>
                <p className="text-xs font-semibold font-mono" style={{ color: "#1a1a1a" }}>
                  {sig.file}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#888" }}>
                  {sig.author} · chain: {sig.chain}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px]" style={{ color: "#aaa" }}>{sig.time}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#34a85320", color: "#34a853" }}
                >
                  ✓ {sig.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function OpenSourceSection() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "#f8f9ff" }}
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <p className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#4285f4" }}>
            Open Source
          </p>

          <h2
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#1a1a1a" }}
          >
            An Open Source
            <br />
            First Protocol
          </h2>

          <p className="text-lg leading-relaxed max-w-md" style={{ color: "#5f6368" }}>
            Built by developers, for developers. Every signature is transparent,
            auditable, and verifiable by anyone in the community — no gatekeepers,
            no black boxes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/Andrew-Kevin-007/etch-site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: "#202124", borderRadius: "999px" }}
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="/registry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(241,243,244,0.9)",
                color: "#202124",
                borderRadius: "999px",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              Browse Registry
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-2">
            {[
              { value: "Ed25519", label: "Key Algorithm" },
              { value: "SHA-256", label: "Hash Function" },
              { value: "∞", label: "Chain Depth" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold" style={{ color: "#1a1a1a" }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "#888" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Registry Card */}
        <RegistryCard />
      </div>
    </section>
  )
}
