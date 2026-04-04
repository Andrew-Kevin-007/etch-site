"use client"

import Link from "next/link"
import { Terminal, Shield, AlertTriangle, ArrowRight, FileText, Check, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function ProtocolPage() {
  return (
    <>
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          
          <div className="flex-1 w-full mx-auto pt-36 pb-24 px-4 sm:px-8 lg:px-12 max-w-7xl">
            <div className="mb-16 border-b border-primary/20 pb-10 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-mono text-primary mb-4 flex items-center justify-center md:justify-start gap-4">
                <Terminal className="h-12 w-12 md:h-14 md:w-14" />
                PROTOCOL
              </h1>
              <p className="text-primary/70 font-mono tracking-widest uppercase text-base sm:text-lg">
                etch-v1 specification
              </p>
            </div>

            <div className="space-y-16">
              
              {/* OVERVIEW */}
              <section className="relative rounded-2xl border border-primary/20 bg-card/40 glass shadow-md p-8 sm:p-10 lg:p-12">
                <h2 className="text-2xl font-mono text-primary mb-6 flex items-center gap-3 border-b border-primary/10 pb-4">
                  <FileText className="h-6 w-6" /> OVERVIEW
                </h2>
                <p className="font-mono text-muted-foreground leading-relaxed text-base sm:text-lg tracking-wide">
                  etch is a cryptographic authorship protocol. AI can carry code. Only humans can sign it. 
                  Code may change. Authorship should not disappear.
                </p>
              </section>

              <p className="font-mono text-primary/80 tracking-widest text-sm uppercase italic py-8 text-center border-y border-transparent bg-primary/5 rounded-lg border-dashed">
                Protocol internals are available to verified contributors only.
              </p>

              {/* CONTRIBUTION STANDARDS & THREAT MODEL grid */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                
                {/* CONTRIBUTION STANDARDS */}
                <section className="flex flex-col relative rounded-2xl border border-primary/20 bg-card/40 glass shadow-md p-8 sm:p-10">
                  <h2 className="text-xl font-mono text-primary mb-6 flex items-center gap-3 border-b border-primary/10 pb-4">
                    <Shield className="h-6 w-6" /> CONTRIBUTION STANDARDS
                  </h2>
                  <ul className="space-y-4 font-mono text-base text-muted-foreground list-none pl-0 flex-1">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 font-bold">&gt;</span> Minimum score: 0.6 / 1.0
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 font-bold">&gt;</span> Logic weight: 40% <br/><span className="text-sm opacity-70">new functions, control flow, error handling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 font-bold">&gt;</span> Architecture weight: 30% <br/><span className="text-sm opacity-70">new structs, traits, modules</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 font-bold">&gt;</span> Complexity weight: 20% <br/><span className="text-sm opacity-70">cyclomatic complexity delta</span>
                    </li>
                    <li className="flex items-start gap-3 text-red-400 mt-2">
                      <span className="text-red-500 mt-0.5 font-bold">&gt;</span> Disqualifiers: <br/><span className="text-sm opacity-80">dead code, abstraction spam, test-only changes, unsupported files</span>
                    </li>
                  </ul>
                </section>

                {/* THREAT MODEL */}
                <section className="flex flex-col relative rounded-2xl border border-primary/20 bg-card/40 glass shadow-md p-8 sm:p-10">
                  <h2 className="text-xl font-mono text-primary mb-6 flex items-center gap-3 border-b border-primary/10 pb-4">
                    <Shield className="h-6 w-6" /> THREAT MODEL
                  </h2>
                  
                  <div className="flex-1 space-y-8">
                    <div>
                      <h3 className="text-sm font-mono text-primary mb-3 uppercase tracking-widest font-bold flex items-center gap-2">
                        <Check className="h-4 w-4" /> PROTECTS AGAINST
                      </h3>
                      <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-2"></div> Unauthorized authorship claims</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-2"></div> Chain tampering and history rewriting</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-2"></div> Replay attacks across contexts</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-primary mt-2"></div> AI-generated code claiming human authorship</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-mono text-red-500 mb-3 uppercase tracking-widest font-bold flex items-center gap-2">
                        <X className="h-4 w-4" /> DOES NOT PROTECT AGAINST
                      </h3>
                      <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-500 mt-2"></div> Private key theft</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-500 mt-2"></div> Social engineering</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-500 mt-2"></div> Copyright or licensing disputes</li>
                        <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-500 mt-2"></div> Code quality or correctness</li>
                      </ul>
                    </div>
                  </div>
                </section>

              </div>

              {/* AI CANNOT SIGN */}
              <section className="relative rounded-3xl border border-red-500/50 bg-red-500/5 shadow-[0_0_80px_rgba(239,68,68,0.15)] p-12 sm:p-16 md:p-24 text-center my-20 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[slide_10s_linear_infinite]"></div>
                
                <h2 className="relative z-10 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-mono text-red-500 mb-8 font-black tracking-[0.2em] uppercase drop-shadow-lg">
                  AI CANNOT SIGN
                </h2>
                <p className="relative z-10 font-mono text-red-400/90 text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed font-bold tracking-wide">
                  AI systems cannot produce valid etch fingerprints. 
                  A valid signature requires a <span className="text-red-400 underline decoration-red-500/50 underline-offset-8">human private key</span>. 
                  No prompt, model, or agent can forge authorship.
                </p>
              </section>

              {/* CTA */}
              <div className="pt-4 mb-8 text-center">
                <Link
                  href="/registry"
                  className="inline-flex items-center justify-center gap-4 px-10 py-5 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] tracking-widest uppercase"
                >
                  EXPLORE REGISTRY <ArrowRight className="h-6 w-6" />
                </Link>
              </div>

            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
