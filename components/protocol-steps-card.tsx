"use client"

import { motion } from "framer-motion"
import { Terminal, Pen, ShieldCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    command: "etch init",
    icon: Terminal,
    title: "Generate your identity",
    description: "Create a unique Ed25519 keypair stored locally. Your private key never leaves your machine.",
    output: "> Identity created",
    outputColor: "#5f6368",
  },
  {
    number: "02",
    command: "etch sign <file>",
    icon: Pen,
    title: "Sign your work",
    description: "Cryptographically anchor your file's hash to your identity. Immutable and unforgeable.",
    output: "> Signature anchored ✓",
    outputColor: "#34a853",
  },
  {
    number: "03",
    command: "etch verify <file>",
    icon: ShieldCheck,
    title: "Prove authorship",
    description: "Verify provenance against the public registry. Anyone, anywhere, anytime.",
    output: "> Verified · Chain: 6 ✓",
    outputColor: "#4285f4",
  },
]

export function ProtocolStepsCard() {
  return (
    <section
      className="relative py-24 px-6"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h2
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(28px, 5vw, 44px)", color: "#1a1a1a" }}
          >
            Three Commands. Permanent Proof.
          </h2>
          <p className="max-w-lg mx-auto text-lg leading-relaxed" style={{ color: "#5f6368" }}>
            A more intuitive approach to code provenance — presenting you with
            cryptographic certainty every step of the way.
          </p>
        </motion.div>

        {/* Steps card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          className="w-full rounded-3xl overflow-hidden"
          style={{
            background: "#f0f4ff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 8px 40px rgba(66,133,244,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7"
                style={{
                  borderBottom: i < steps.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
              >
                {/* Step number */}
                <div
                  className="flex-shrink-0 text-4xl font-bold tabular-nums leading-none"
                  style={{ color: "rgba(66,133,244,0.15)", minWidth: "3rem" }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{ background: "rgba(66,133,244,0.08)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#4285f4" }} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="font-semibold text-base mb-1" style={{ color: "#1a1a1a" }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#5f6368" }}>
                    {step.description}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
                    style={{ background: "#1a1a1a", color: "#e8e8e8" }}
                  >
                    <span style={{ color: "#555" }}>$</span>
                    <span>{step.command}</span>
                  </div>
                </div>

                {/* Output badge */}
                <div className="flex-shrink-0 hidden sm:block">
                  <span
                    className="text-xs font-mono px-3 py-1.5 rounded-full"
                    style={{
                      background: `${step.outputColor}15`,
                      color: step.outputColor,
                      border: `1px solid ${step.outputColor}30`,
                    }}
                  >
                    {step.output}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
