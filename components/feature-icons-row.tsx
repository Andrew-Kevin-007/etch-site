"use client"

import { motion } from "framer-motion"
import { Shield, Key, Link2, CheckCircle, Database, Lock, Code, GitBranch, FileCheck, Fingerprint, Hash, RefreshCw } from "lucide-react"

const icons = [
  { Icon: Shield, label: "Sign" },
  { Icon: Key, label: "Keypair" },
  { Icon: Hash, label: "Hash" },
  { Icon: FileCheck, label: "Verify" },
  { Icon: Fingerprint, label: "Identity" },
  { Icon: GitBranch, label: "Chain" },
  { Icon: Database, label: "Registry" },
  { Icon: Lock, label: "Immutable" },
  { Icon: Code, label: "Open" },
  { Icon: CheckCircle, label: "Proven" },
  { Icon: Link2, label: "Linked" },
  { Icon: RefreshCw, label: "Audit" },
]

// Vertical offsets to create a wavy pattern
const yOffsets = [8, 0, 16, 4, 20, 0, 12, 4, 18, 2, 14, 6]

export function FeatureIconsRow() {
  return (
    <section
      className="relative overflow-hidden py-12"
      style={{ background: "#eef2f8" }}
    >
      {/* Subtle gradient fade on edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #eef2f8, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #eef2f8, transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-center gap-4 px-8 overflow-x-auto scrollbar-hide pb-4"
        style={{ minWidth: "min-content" }}
      >
        {icons.map(({ Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 flex-shrink-0"
            style={{ marginTop: `${yOffsets[i]}px` }}
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.08 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center rounded-full bg-white cursor-default"
              style={{
                width: 52,
                height: 52,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: "#444" }} />
            </motion.div>
            <span className="text-[10px] font-medium tracking-wide" style={{ color: "#888" }}>
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
