"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"

const INLINE_CODE = "bg-[#f1f3f4] text-[#3c4043] px-1.5 py-0.5 rounded text-[13px] font-mono border border-gray-200/60"

export default function ProtocolDocs() {
  const [activeSection, setActiveSection] = useState("overview")

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      // offset for fixed header
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Intersection Observer for Right Sidebar TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-120px 0px -60% 0px" }
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex w-full pt-[72px]">
        
        {/* =======================
            LEFT Nav Sidebar
            ======================= */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto pb-10">
          <div className="pl-6 pr-4 pt-8">
            <h3 className="text-gray-500 font-semibold text-xs tracking-wider uppercase mb-4 ml-3">Protocol</h3>
            <nav className="flex flex-col space-y-0.5">
              <button 
                onClick={() => scrollTo('overview')} 
                className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md bg-[#e8f0fe] text-[#1a73e8]"
              >
                Getting Started
              </button>
              <button 
                className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50"
              >
                Core Concepts
              </button>
            </nav>

            <h3 className="text-gray-500 font-semibold text-xs tracking-wider uppercase mt-8 mb-4 ml-3">Specifications</h3>
            <nav className="flex flex-col space-y-0.5">
              <button onClick={() => scrollTo('scoring')} className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50">Contributions & Scoring</button>
              <button onClick={() => scrollTo('threat-model')} className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50">Threat Model</button>
              <button onClick={() => scrollTo('signature-policy')} className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50">Signature Policy</button>
            </nav>
            
            <h3 className="text-gray-500 font-semibold text-xs tracking-wider uppercase mt-8 mb-4 ml-3">Tooling</h3>
            <nav className="flex flex-col space-y-0.5">
              <button className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50">CLI Reference</button>
              <button className="text-left w-full px-4 py-2 text-[14px] font-medium rounded-r-3xl rounded-l-md text-[#3c4043] hover:bg-gray-100/50">API Endpoints</button>
            </nav>
          </div>
        </aside>

        {/* =======================
            CENTER Main Content
            ======================= */}
        <main className="flex-1 min-w-0 flex justify-center">
          <div className="w-full max-w-[840px] px-8 pt-8 pb-32">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-[#5f6368] mb-8">
              <span>Protocol</span>
              <span className="mx-2">/</span>
              <span className="text-[#3c4043]">Getting Started</span>
            </nav>

            <h1 className="text-4xl font-normal text-[#202124] mb-4 tracking-tight" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
              Getting Started
            </h1>
            <p className="text-lg text-[#5f6368] mb-12 font-normal leading-[1.6]">
              Understand the technical specification for generating, verifying, and preserving human authorship signatures across your cryptographic development environments.
            </p>

            <hr className="border-gray-200 mb-12" />

            <div className="space-y-16">
              
              {/* OVERVIEW SECTION */}
              <section id="overview" className="scroll-mt-[100px]">
                <h2 className="text-[26px] font-normal text-[#202124] tracking-tight mb-4 border-b border-gray-100 pb-2">Overview</h2>
                <div className="text-[16px] text-[#3c4043] font-normal leading-[1.65] space-y-4">
                  <p>
                    ETCH is a cryptographic authorship protocol designed for the modern continuous-intelligence era. While automated agents can rapidly generate and refactor software modules, only verified human counterparts are authorized to cryptographically seal the artifact via the <code className={INLINE_CODE}>etch-v1</code> spec.
                  </p>
                  
                  {/* Google-tier Info Callout */}
                  <div className="mt-6 p-5 bg-[#e8f0fe] rounded-r-lg border-l-4 border-[#1a73e8]">
                    <h4 className="font-semibold text-[#1a73e8] mb-1 text-sm tracking-wide">NOTE</h4>
                    <p className="text-sm text-[#3c4043] leading-relaxed">
                      Protocol internals and direct access to cryptographic primitives are strictly restricted to verified contributors possessing a valid enterprise token. Please ensure your <code className={INLINE_CODE}>.env</code> has been properly provisioned before querying the API.
                    </p>
                  </div>
                </div>
              </section>

              {/* SCORING SECTION */}
              <section id="scoring" className="scroll-mt-[100px]">
                <h2 className="text-[26px] font-normal text-[#202124] tracking-tight mb-4 border-b border-gray-100 pb-2">Contributions & Scoring</h2>
                <p className="text-[16px] text-[#3c4043] leading-[1.65] mb-6">
                  Every proposed delta traversing the ETCH network is mathematically evaluated against three primary constraint metrics. A minimum threshold score of <code className={INLINE_CODE}>0.6 / 1.0</code> is required to trigger a valid merge commit.
                </p>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-[#3c4043] text-sm">
                      <tr>
                        <th className="py-3 px-4 font-medium w-1/3">Metric</th>
                        <th className="py-3 px-4 font-medium w-[15%]">Weight</th>
                        <th className="py-3 px-4 font-medium">Evaluation Targets</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-[#3c4043] divide-y divide-gray-100">
                      <tr>
                        <td className="py-3 px-4 font-medium">Logic Weight</td>
                        <td className="py-3 px-4 text-[#1a73e8] font-medium">40%</td>
                        <td className="py-3 px-4">New functions, deep control flow branching, and explicit error handling closures.</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Architecture Weight</td>
                        <td className="py-3 px-4 text-[#1a73e8] font-medium">30%</td>
                        <td className="py-3 px-4">Introduction of new data-structures (structs), trait definitions, and module composition.</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Complexity Weight</td>
                        <td className="py-3 px-4 text-[#1a73e8] font-medium">20%</td>
                        <td className="py-3 px-4">Relative delta in cyclomatic complexity across the updated nodes.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <h3 className="text-[18px] font-medium text-[#202124] mb-3 tracking-tight">Disqualifying Behaviors</h3>
                  <ul className="list-disc list-outside ml-5 text-[#3c4043] leading-[1.65] space-y-2">
                    <li>Detection of unreachable <strong>dead code</strong> segments.</li>
                    <li>Highly nested abstraction layers without semantic value (spam).</li>
                    <li>Submissions containing <em>test-only</em> modifications lacking core logic changes.</li>
                  </ul>
                </div>
              </section>

              {/* THREAT MODEL SECTION */}
              <section id="threat-model" className="scroll-mt-[100px]">
                 <h2 className="text-[26px] font-normal text-[#202124] tracking-tight mb-4 border-b border-gray-100 pb-2">Threat Model</h2>
                 
                 <div className="grid md:grid-cols-2 gap-8 mt-6">
                    <div>
                      <h3 className="text-[16px] font-medium text-green-700 tracking-tight mb-4 flex items-center gap-2">
                        <span className="text-green-600 bg-green-50 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        In Scope (Protects)
                      </h3>
                      <ul className="space-y-3 text-[#3c4043] text-[15px] leading-relaxed">
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Unauthorized authorship claims.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Chain tampering and transaction history rewriting.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Replay attacks across different context registries.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> AI-generated logic attempting to assert human provenance.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-medium text-red-600 tracking-tight mb-4 flex items-center gap-2">
                        <span className="text-red-600 bg-red-50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✕</span>
                        Out of Scope
                      </h3>
                      <ul className="space-y-3 text-[#3c4043] text-[15px] leading-relaxed">
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Private key theft or local machine compromise.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Social engineering and phishing attempts.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Standard copyright or open-source licensing disputes.</li>
                        <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0"></span> Evaluation of code quality or runtime correctness.</li>
                      </ul>
                    </div>
                 </div>
              </section>

              {/* AI POLICY SECTION */}
              <section id="signature-policy" className="scroll-mt-[100px]">
                <h2 className="text-[26px] font-normal text-[#202124] tracking-tight mb-6 border-b border-gray-100 pb-2">Cryptographic Signature Policy</h2>
                
                <div className="p-6 bg-[#fce8e6] rounded-lg border-l-4 border-[#d93025]">
                  <h3 className="text-[18px] font-semibold text-[#d93025] mb-2 tracking-tight">Strict Requirement: Human Signatures Only</h3>
                  <p className="text-[16px] text-[#3c4043] leading-relaxed">
                    AI systems are structurally incapable of producing valid ETCH network fingerprints by design. 
                    Validating a payload permanently strictly requires an offline, physical hardware-based <code className="bg-white border text-[#d93025] border-red-200 px-1.5 rounded">human private key</code> assertion. 
                    No language model prompt, heuristic script, or autonomous workflow agent can forge algorithmic authorship within the ETCH strict mode layer.
                  </p>
                </div>
              </section>

            </div>

          </div>
        </main>

        {/* =======================
            RIGHT Sticky TOC
            ======================= */}
        <aside className="hidden xl:block w-[240px] shrink-0 sticky top-[72px] h-[calc(100vh-72px)] pt-12 pr-6">
          <p className="text-gray-500 font-semibold text-[13px] tracking-wide mb-3">On this Page</p>
          <ul className="text-[14px]">
            <li>
              <button 
                onClick={() => scrollTo('overview')} 
                className={`block w-full text-left py-1.5 pl-4 border-l-2 text-[13px] ${activeSection === 'overview' ? 'border-[#1a73e8] text-[#1a73e8] font-medium' : 'border-gray-200 text-[#5f6368] hover:text-[#202124]'}`}
              >
                Getting Started
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('scoring')} 
                className={`block w-full text-left py-1.5 pl-4 border-l-2 text-[13px] ${activeSection === 'scoring' ? 'border-[#1a73e8] text-[#1a73e8] font-medium' : 'border-gray-200 text-[#5f6368] hover:text-[#202124]'}`}
              >
                Contributions & Scoring
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollTo('threat-model')} 
                className={`block w-full text-left py-1.5 pl-4 border-l-2 text-[13px] ${activeSection === 'threat-model' ? 'border-[#1a73e8] text-[#1a73e8] font-medium' : 'border-gray-200 text-[#5f6368] hover:text-[#202124]'}`}
              >
                Threat Model
              </button>
            </li>
             <li>
              <button 
                onClick={() => scrollTo('signature-policy')} 
                className={`block w-full text-left py-1.5 pl-4 border-l-2 text-[13px] ${activeSection === 'signature-policy' ? 'border-[#1a73e8] text-[#1a73e8] font-medium' : 'border-gray-200 text-[#5f6368] hover:text-[#202124]'}`}
              >
                Signature Policy
              </button>
            </li>
          </ul>
        </aside>

      </div>
    </div>
  )
}
