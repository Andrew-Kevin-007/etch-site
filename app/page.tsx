"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Copy, Check, Shield, Lock, Database } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-sans selection:bg-[#00c896]/20">
      <Header />

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-20">
        {/* Animated gradient orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[#00c896]/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-[#00c896]/8 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a]/5 text-xs font-medium text-[#0a0a0a]/60 border border-[#0a0a0a]/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00c896] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00c896]" />
            </span>
            Open Source · v0.1.0
          </div>

          {/* Headline */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.05]">
            Code changes.
            <br />
            <span className="text-[#00c896]">Authorship shouldn&apos;t.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#666] max-w-3xl mx-auto leading-relaxed">
            etch is a cryptographic protocol that preserves human authorship in software.
            Built for developers. Trusted by open source.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/registry"
              className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-[#0a0a0a] text-white font-medium hover:bg-[#0a0a0a]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Install etch
            </Link>
            <Link
              href="/registry"
              className="inline-flex h-12 items-center justify-center px-8 rounded-full border border-[#0a0a0a]/20 text-[#0a0a0a] font-medium hover:bg-[#0a0a0a]/5 transition-all"
            >
              View Registry
            </Link>
          </div>

          {/* Install snippet */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0a0a0a] text-white font-mono text-sm shadow-xl">
              <span className="text-[#666]">$</span> cargo install etch
              <button
                onClick={copyInstall}
                className="ml-2 p-1.5 text-[#666] hover:text-white transition-colors rounded-md hover:bg-white/10"
                aria-label="Copy command"
              >
                {copied ? <Check className="h-4 w-4 text-[#00c896]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Large text */}
            <div className="space-y-6">
              <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
                <span className="text-[#0a0a0a] line-through decoration-[#00c896]/40 decoration-2">
                  AI can generate code.
                </span>
                <br />
                <span className="text-[#666]">It cannot take responsibility.</span>
              </h2>
            </div>

            {/* Right: Stat cards */}
            <div className="grid gap-6">
              <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                <Shield className="h-8 w-8 text-[#00c896] mb-4" />
                <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Ed25519</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Cryptographic keypairs generated locally. Your private key never leaves your machine.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                <Database className="h-8 w-8 text-[#00c896] mb-4" />
                <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Append-Only</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Signatures linked in an immutable chain. History that cannot be rewritten or forged.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-[#fafafa] border border-[#0a0a0a]/5 hover:border-[#00c896]/30 transition-all hover:shadow-lg hover:shadow-[#00c896]/5">
                <Lock className="h-8 w-8 text-[#00c896] mb-4" />
                <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">Open Source</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Transparent, auditable, and built by the community. Trust through verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
              Three commands. Proven authorship.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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
          </div>
        </div>
      </section>

      {/* PRINCIPLE SECTION */}
      <section className="py-32 bg-[#0a0a0a]">
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
      </section>

      <Footer />
    </div>
  )
}
