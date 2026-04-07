"use client"

import Link from "next/link"
import { Terminal, Shield, ArrowRight, FileText, Check, X, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function ProtocolPage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <main className="relative min-h-screen bg-white text-[#202124] selection:bg-blue-100">
        <Header />

        <div className="mx-auto max-w-7xl pt-32 pb-24 px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="md:col-span-3 hidden md:block">
            <div className="sticky top-32">
              <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Terminal className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">ETCH Protocol</h3>
                  <p className="text-xs text-gray-500">v0.1.0 Specification</p>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-1 border-l border-gray-200">
                <button onClick={() => scrollTo('overview')} className="text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:-ml-[1px] hover:border-blue-500 transition-all font-medium">Overview</button>
                <button onClick={() => scrollTo('standards')} className="text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:-ml-[1px] hover:border-blue-500 transition-all font-medium">Contribution Standards</button>
                <button onClick={() => scrollTo('threat-model')} className="text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:-ml-[1px] hover:border-blue-500 transition-all font-medium">Threat Model</button>
                <button onClick={() => scrollTo('ai-policy')} className="text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:border-l-2 hover:-ml-[1px] hover:border-blue-500 transition-all font-medium">AI Signature Policy</button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="md:col-span-9 space-y-16">
            
            {/* Header Section */}
            <header>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#202124] mb-4">
                Protocol Documentation
              </h1>
              <p className="text-lg text-[#5F6368] max-w-2xl">
                The technical specification for verifying and preserving human authorship in software development environments.
              </p>
            </header>

            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-md">
                  <FileText className="h-4 w-4 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-[#5F6368] leading-relaxed">
                  ETCH is a cryptographic authorship protocol designed for the modern coding era. While AI can autonomously generate, refactor, and carry code, only verified human entities hold the cryptographic proofs required to sign it. Code may evolve rapidly, but authorship integrity should not be lost in translation.
                </p>
                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 m-0 leading-relaxed font-medium">Protocol internals and source code implementation details are actively restricted to verified contributors only at this stage of the v0.1.0 release.</p>
                </div>
              </div>
            </section>

            {/* CONTRIBUTION STANDARDS */}
            <section id="standards" className="scroll-mt-32">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-md">
                  <Shield className="h-4 w-4 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Contribution Standards</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Logic Weight</h3>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md">40%</span>
                  </div>
                  <p className="text-sm text-gray-500">Evaluates the impact of new functions, control flow, and error handling mechanisms.</p>
                </div>

                <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Architecture Weight</h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">30%</span>
                  </div>
                  <p className="text-sm text-gray-500">Evaluates the introduction of new structs, traits, modules, and data models.</p>
                </div>

                <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Complexity Weight</h3>
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-md">20%</span>
                  </div>
                  <p className="text-sm text-gray-500">Measures the cyclomatic complexity delta brought by the pull request.</p>
                </div>

                <div className="p-5 rounded-2xl border border-red-100 bg-red-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-red-800">Disqualifiers</h3>
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-sm text-red-600/80">Dead code, abstraction spam, test-only changes, or unsupported file formats.</p>
                </div>
              </div>
            </section>

            {/* THREAT MODEL */}
            <section id="threat-model" className="scroll-mt-32">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-50 border border-gray-100 rounded-md">
                  <Shield className="h-4 w-4 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Threat Model</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Protects Against */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-green-700 flex items-center gap-2">
                    <Check className="h-4 w-4" /> In Scope (Protects)
                  </h3>
                  <ul className="space-y-3">
                    {['Unauthorized authorship claims', 'Chain tampering and history rewriting', 'Replay attacks across contexts', 'AI-generated code claiming human authorship'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Does Not Protect Against */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4" /> Out of Scope (Does Not Protect)
                  </h3>
                  <ul className="space-y-3">
                    {['Private key theft', 'Social engineering', 'Copyright or licensing disputes', 'Code quality or runtime correctness'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* AI CANNOT SIGN STATEMENT */}
            <section id="ai-policy" className="scroll-mt-32">
              <div className="rounded-3xl border border-red-200 bg-[#FFF5F5] p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EA4335] via-orange-400 to-[#EA4335]" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                  AI <span className="text-[#EA4335]">Cannot</span> Sign
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  AI systems cannot produce valid ETCH fingerprints. A valid signature strictly requires a <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded shadow-sm">human private key</span>. No prompt, model, or autonomous agent can forge authorship on the ETCH protocol.
                </p>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* CTA */}
            <div className="pb-12 pt-6 text-center md:text-left flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Ready to secure your code?</h3>
                <p className="text-gray-500">Sign your first commit today.</p>
              </div>
              <Link href="/registry">
                <motion.button
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-[15px] text-white shadow-lg"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.15)"
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.95)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Explore the Registry</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
