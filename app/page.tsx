"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Copy, Terminal, Shield, Lock, Check, Database, GitBranch, Key, BookOpen, Binary, FileKey, ShieldCheck, Github, Layers, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [copied, setCopied] = useState(false)

  const copyInstall = () => {
    navigator.clipboard.writeText("cargo install etch")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-[#00ff9d]/30">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-[1200px] px-6 lg:px-8 py-16 md:py-24 space-y-32">
        
        {/* SECTION 1 — HERO */}
        <section className="min-h-[75vh] flex flex-col justify-center items-center">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center w-full">
            <div className="space-y-8 max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
                Code changes. <br/>
                <span className="text-[#00ff9d]">Authorship shouldn't.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
                etch is a cryptographic protocol that preserves and verifies human authorship in software. Built for developers, trusted by open source.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                  <Link href="/registry" className="inline-flex h-12 items-center justify-center px-8 font-mono font-bold text-[#0a0a0a] bg-[#00ff9d] hover:bg-[#00cc7d] transition-colors rounded-sm shadow-[0_0_20px_rgba(0,255,157,0.3)]">
                    Install etch
                  </Link>
                  <Link href="/protocol" className="inline-flex h-12 items-center justify-center px-8 font-mono font-bold text-white border border-gray-700 hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors rounded-sm">
                    Read the protocol
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between max-w-md bg-black border border-gray-800 rounded-sm p-1 pr-2">
                  <div className="flex items-center gap-3 px-3 py-2 font-mono text-sm text-gray-300">
                    <span className="text-gray-500">$</span> cargo install etch
                  </div>
                  <button onClick={copyInstall} className="p-2 text-gray-500 hover:text-white transition-colors rounded hover:bg-gray-800">
                    {copied ? <Check className="h-4 w-4 text-[#00ff9d]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: animated terminal */}
            <div className="w-full relative">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#00ff9d]/20 to-transparent blur-2xl opacity-50 rounded-xl"></div>
              <div className="relative bg-black border border-gray-800 rounded-md overflow-hidden text-sm md:text-base font-mono shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/50"></div>
                  <div className="ml-2 text-gray-500 text-xs">etch-cli</div>
                </div>
                <div className="p-6 space-y-4 text-gray-300">
                  <div>
                    <span className="text-[#00ff9d] mr-2">❯</span> etch sign --path src/main.rs
                  </div>
                  <div className="text-gray-500 pl-4 border-l border-gray-800 ml-1 space-y-1">
                    Analyzing delta...<br/>
                    Calculating logic score... 0.84<br/>
                    Generating SHA-256 fingerprint...
                  </div>
                  <div>
                    <span className="text-[#00ff9d]">✓</span> Signature embedded in registry
                  </div>
                  <div className="mt-4">
                    <span className="text-[#00ff9d] mr-2">❯</span> etch verify --path src/main.rs
                  </div>
                  <div>
                    <span className="text-[#00ff9d]">✓</span> Human authorship verified. Chain depth: 6
                  </div>
                  <div className="animate-pulse text-[#00ff9d]">_</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — PROBLEM STATEMENT */}
        <section className="py-16 md:py-24 border-y border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              AI can generate code. <br className="sm:hidden" />
              <span className="text-gray-400">It cannot take responsibility.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mx-auto md:mx-0">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">No intent</h3>
              <p className="text-gray-400 leading-relaxed">
                Code generation tools outputs symbols without semantic intent. They cannot vouch for the purpose of a change.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto md:mx-0">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">No accountability</h3>
              <p className="text-gray-400 leading-relaxed">
                When critical systems fail or vulnerabilities are exploited, there is no AI entity to testify or be held responsible.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mx-auto md:mx-0">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">No authorship</h3>
              <p className="text-gray-400 leading-relaxed">
                Traditional commits only prove who pushed to a remote, not who authored the logic inside the editor.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — HOW IT WORKS */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">How it works</h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
              <div className="md:w-1/3 space-y-2 text-center md:text-right pt-4">
                <h3 className="text-xl font-bold text-white">Init your identity</h3>
                <p className="text-gray-400 text-sm">Generate your unique Ed25519 keypair locally.</p>
              </div>
              <div className="md:w-2/3 bg-black border border-gray-800 rounded-sm p-6 font-mono text-sm w-full">
                <div className="text-gray-300"><span className="text-[#00ff9d] mr-2">$</span>etch init</div>
                <div className="text-gray-500 mt-2">&gt; Identity created. Public key: 5ce6490a...</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
              <div className="md:w-1/3 space-y-2 text-center md:text-right pt-4">
                <h3 className="text-xl font-bold text-white">Sign your contribution</h3>
                <p className="text-gray-400 text-sm">Cryptographically anchor the file state to your identity.</p>
              </div>
              <div className="md:w-2/3 bg-black border border-gray-800 rounded-sm p-6 font-mono text-sm w-full">
                <div className="text-gray-300"><span className="text-[#00ff9d] mr-2">$</span>etch sign --path src/main.rs</div>
                <div className="text-gray-500 mt-2">&gt; Contribution validated (score: 0.84)</div>
                <div className="text-[#00ff9d]">&gt; Authorship anchored to notarization server ✓</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
              <div className="md:w-1/3 space-y-2 text-center md:text-right pt-4">
                <h3 className="text-xl font-bold text-white">Verify anytime, anywhere</h3>
                <p className="text-gray-400 text-sm">Check provenance against the immutable registry.</p>
              </div>
              <div className="md:w-2/3 bg-black border border-gray-800 rounded-sm p-6 font-mono text-sm w-full">
                <div className="text-gray-300"><span className="text-[#00ff9d] mr-2">$</span>etch verify --path src/main.rs</div>
                <div className="text-gray-500 mt-2">&gt; Chain depth: 6 | Server verified: YES ✓</div>
              </div>
            </div>
            
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <Lock className="h-8 w-8 text-[#00ff9d] mb-6" />
              <h3 className="text-lg font-bold text-white mb-3">Cryptographic Identity</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Each contribution is signed by an Ed25519 keypair, generated locally on your machine. Your private key never leaves your dev environment.
              </p>
            </div>
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <Database className="h-8 w-8 text-[#00ff9d] mb-6" />
              <h3 className="text-lg font-bold text-white mb-3">Append-Only Chain</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Valid signatures are linked chronologically. The history of a file's provenance forms a hash chain that cannot be rewritten or forged.
              </p>
            </div>
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <ShieldCheck className="h-8 w-8 text-[#00ff9d] mb-6" />
              <h3 className="text-lg font-bold text-white mb-3">Contribution Standards</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Not every change earns a signature. The protocol scores the logical significance of a delta, ignoring trivial whitespace or formatting.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 — THE PRINCIPLE */}
        <section className="py-24 text-center border-y border-gray-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
              AI CAN CARRY CODE.<br/>
              <span className="text-[#00ff9d]">ONLY HUMANS CAN SIGN IT.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light mx-auto max-w-3xl">
              etch doesn't fight AI. It ensures humans remain visible, accountable, and credited — even as AI transforms everything around them.
            </p>
          </div>
        </section>

        {/* SECTION 6 — GET STARTED */}
        <section className="py-16 md:py-24 pb-32">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Ready to sign?</h2>
              <p className="text-gray-400">Install the rust-based CLI binary to your system and generate your identity.</p>
              
              <div className="bg-black border border-gray-800 rounded-sm p-6 font-mono text-sm mt-8 space-y-3">
                <div className="text-gray-300"><span className="text-gray-600 mr-2">$</span>cargo install etch</div>
                <div className="text-gray-300"><span className="text-gray-600 mr-2">$</span>etch init</div>
                <div className="text-gray-300"><span className="text-gray-600 mr-2">$</span>etch sign --path yourfile.rs</div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-3xl font-bold">Explore the data</h2>
              <p className="text-gray-400">View real-time verifiable chains uploaded by other human developers globally.</p>
              <Link href="/registry" className="inline-flex h-12 items-center justify-center px-8 font-mono font-bold text-[#0a0a0a] bg-white hover:bg-gray-200 transition-colors rounded-sm mt-4">
                Join the registry <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
