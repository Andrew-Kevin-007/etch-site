"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Download, Bell } from "lucide-react"

const devFeatures = [
  "Ed25519 key generation",
  "File signing & verification",
  "Append-only chain ledger",
  "CLI tool (Rust)",
  "Public registry access",
]

const orgFeatures = [
  "Everything in developer tier",
  "Team identity management",
  "Org-level audit logs",
  "Webhook integrations",
  "Priority support",
]

export function TiersSection() {
  return (
    <section
      className="relative py-28 px-6"
      style={{
        background: "#ffffff",
        backgroundImage: "radial-gradient(circle, #c8c8c8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Subtle white vignette on edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.7) 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-display font-medium leading-tight mb-4"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", color: "#1a1a1a" }}
          >
            Built for developers.
            <br />
            Trusted by open source.
          </h2>
          <p className="text-lg font-sans max-w-lg mx-auto" style={{ color: "#5f6368" }}>
            etch is free and open source. No paywalls on provenance.
          </p>
        </motion.div>

        {/* 2-col tiers */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* For developers */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-8 flex flex-col gap-6"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <span
                className="inline-block text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#f0f7ff", color: "#4285f4" }}
              >
                Available at no charge
              </span>
              <h3 className="text-2xl font-display font-medium leading-tight mb-1" style={{ color: "#1a1a1a" }}>
                For developers
              </h3>
              <p className="text-base font-sans font-normal" style={{ color: "#5f6368" }}>
                Achieve new heights
              </p>
            </div>

            <ul className="space-y-3 flex-1">
              {devFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "#444" }}>
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "#34a85320", color: "#34a853" }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/registry"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: "#202124" }}
            >
              <Download className="w-4 h-4" />
              Install for free
            </Link>
          </motion.div>

          {/* For open source */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl p-8 flex flex-col gap-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}
          >
            <div>
              <span
                className="inline-block text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#f0f7ff", color: "#888" }}
              >
                Coming soon
              </span>
              <h3 className="text-2xl font-display font-medium leading-tight mb-1" style={{ color: "#1a1a1a" }}>
                For open source
              </h3>
              <p className="text-base font-sans font-normal" style={{ color: "#5f6368" }}>
                Protect your contributors
              </p>
            </div>

            <ul className="space-y-3 flex-1">
              {orgFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "#888" }}>
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "#88888820", color: "#888" }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(241,243,244,0.9)",
                color: "#444",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Bell className="w-4 h-4" />
              Notify me
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
