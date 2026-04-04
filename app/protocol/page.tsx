"use client"

import Link from "next/link"
import { Terminal, Shield, ArrowRight, FileText, Check, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function ProtocolPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#0a0a0a]">   
        <CursorGlow />
        <Header />

        <div className="flex-1 w-full max-w-[1200px] mx-auto pt-32 pb-24 px-6">
          <div className="mb-20 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-sans text-white mb-6 flex items-center justify-center md:justify-start gap-4">
              <Terminal className="h-10 w-10 md:h-12 md:w-12 text-[#00ff9d]" />
              PROTOCOL
            </h1>
            <p className="text-muted-foreground font-mono tracking-widest uppercase text-sm sm:text-base border-b border-[#00ff9d]/20 pb-8 inline-block md:block">
              etch-v1 specification
            </p>
          </div>

          {/* OVERVIEW */}
          <section className="mb-16">
            <h2 className="text-lg font-mono text-[#00ff9d] mb-4 flex items-center gap-3">
              <FileText className="h-5 w-5" /> OVERVIEW
            </h2>
            <p className="font-sans text-white leading-relaxed text-xl sm:text-2xl font-light pb-4 border-b border-border">
              ETCH is a cryptographic authorship protocol. AI can carry code. Only humans can sign it. Code may change. Authorship should not disappear.
            </p>
          </section>

          <p className="font-mono text-[#00ff9d]/70 tracking-widest text-xs uppercase my-16 text-center border border-[#00ff9d]/10 bg-[#00ff9d]/5 rounded p-4 font-bold">
            Protocol internals are available to verified contributors only.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-24">        
            {/* CONTRIBUTION STANDARDS */}
            <section className="flex flex-col">
              <h2 className="text-sm font-mono text-[#00ff9d] mb-6 flex items-center gap-3 uppercase tracking-widest font-bold border-b border-border pb-3">
                <Shield className="h-4 w-4" /> Contribution Standards  
              </h2>
              <ul className="space-y-6 font-mono text-sm text-muted-foreground list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff9d] mt-0.5 font-bold">&gt;</span> 
                  <div>
                    <span className="text-white">Minimum score: 0.6 / 1.0</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff9d] mt-0.5 font-bold">&gt;</span>
                  <div>
                    <span className="text-white bg-[#111] px-1 py-0.5 rounded mr-2">Logic weight: 40%</span> 
                    <p className="mt-2 text-xs opacity-70 leading-relaxed font-sans">new functions, control flow, error handling</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff9d] mt-0.5 font-bold">&gt;</span>
                  <div>
                     <span className="text-white bg-[#111] px-1 py-0.5 rounded mr-2">Architecture weight: 30%</span> 
                     <p className="mt-2 text-xs opacity-70 leading-relaxed font-sans">new structs, traits, modules</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00ff9d] mt-0.5 font-bold">&gt;</span>
                  <div>
                    <span className="text-white bg-[#111] px-1 py-0.5 rounded mr-2">Complexity weight: 20%</span> 
                    <p className="mt-2 text-xs opacity-70 leading-relaxed font-sans">cyclomatic complexity delta</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 mt-4 pt-4 border-t border-border">
                  <span className="text-red-500 mt-0.5 font-bold">&gt;</span> 
                  <div>
                    <span className="text-red-400 font-bold uppercase tracking-wider">Disqualifiers</span>
                    <p className="mt-2 text-xs opacity-80 leading-relaxed text-red-500/70 font-sans">dead code, abstraction spam, test-only changes, unsupported files</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* THREAT MODEL */}
            <section className="flex flex-col">
              <h2 className="text-sm font-mono text-[#00ff9d] mb-6 flex items-center gap-3 uppercase tracking-widest font-bold border-b border-border pb-3">
                <Shield className="h-4 w-4" /> Threat Model
              </h2>

              <div className="flex-1 space-y-10">
                <div>
                  <h3 className="text-xs font-mono text-white mb-4 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Check className="h-3 w-3 text-[#00ff9d]" /> Protects against
                  </h3>
                  <ul className="space-y-4 font-sans text-sm text-muted-foreground">
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-[#00ff9d] mt-2 shrink-0"></div> Unauthorized authorship claims</li>
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-[#00ff9d] mt-2 shrink-0"></div> Chain tampering and history rewriting</li>
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-[#00ff9d] mt-2 shrink-0"></div> Replay attacks across contexts</li>
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-[#00ff9d] mt-2 shrink-0"></div> AI-generated code claiming human authorship</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-white mb-4 uppercase tracking-widest font-bold flex items-center gap-2">
                    <X className="h-3 w-3 text-red-500" /> Does not protect against 
                  </h3>
                  <ul className="space-y-4 font-sans text-sm text-muted-foreground">
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0"></div> Private key theft</li>    
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0"></div> Social engineering</li>   
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0"></div> Copyright or licensing disputes</li>
                    <li className="flex items-start gap-3"><div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0"></div> Code quality or correctness</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* AI CANNOT SIGN STATEMENT */}
          <section className="mb-24 py-16 md:py-24 border-y border-[#222]">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans text-white mb-8 font-black uppercase tracking-tight text-center">
              AI <span className="text-red-500">CANNOT</span> SIGN
            </h2>
            <p className="font-sans text-muted-foreground text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed text-center font-light">
              AI systems cannot produce valid ETCH fingerprints.       
              A valid signature requires a <span className="text-white font-medium border-b-2 border-red-500">human private key</span>.
              No prompt, model, or agent can forge authorship.
            </p>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/registry"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded bg-[#00ff9d] text-black font-sans font-bold hover:bg-[#00ff9d]/90 transition-colors uppercase tracking-widest text-sm"
            >
              Explore Registry <ArrowRight className="h-4 w-4" />      
            </Link>
          </div>

        </div>
        <Footer />
      </main>
    </>
  )
}
