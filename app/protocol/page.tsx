"use client"

import Link from "next/link"
import { Terminal, Shield, AlertTriangle, Code, ArrowRight, FileText, Lock, GitMerge, Check, X } from "lucide-react"
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
          
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24">
            <div className="mb-12 border-b border-primary/20 pb-8">
              <h1 className="text-4xl font-bold tracking-tight font-mono text-primary mb-2 flex items-center gap-3">
                <Terminal className="h-8 w-8" />
                PROTOCOL
              </h1>
              <p className="text-primary/70 font-mono tracking-widest uppercase text-sm">
                etch-v1 specification
              </p>
            </div>

            <div className="space-y-12">
              
              {/* OVERVIEW */}
              <section className="relative rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                <h2 className="text-xl font-mono text-primary mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" /> OVERVIEW
                </h2>
                <p className="font-mono text-muted-foreground leading-relaxed text-sm sm:text-base">
                  etch is a cryptographic authorship protocol. AI can carry code. Only humans can sign it. 
                  Code may change. Authorship should not disappear.
                </p>
              </section>

              {/* FINGERPRINT FORMAT */}
              <section className="relative rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8 overflow-x-auto">
                <h2 className="text-xl font-mono text-primary mb-6 flex items-center gap-2">
                  <Code className="h-5 w-5" /> FINGERPRINT FORMAT
                </h2>
                <table className="w-full text-left border-collapse font-mono text-sm">
                  <thead>
                    <tr className="border-b border-primary/30 text-primary">
                      <th className="py-3 pr-4 font-normal">Field</th>
                      <th className="py-3 pr-4 font-normal">Type</th>
                      <th className="py-3 font-normal">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10 text-muted-foreground">
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">contributor_pubkey</td>
                      <td className="py-3 pr-4 whitespace-nowrap">hex[64]</td>
                      <td className="py-3">Ed25519 public key of the author</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">timestamp</td>
                      <td className="py-3 pr-4 whitespace-nowrap">RFC3339 UTC</td>
                      <td className="py-3">When the contribution was signed</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">code_hash</td>
                      <td className="py-3 pr-4 whitespace-nowrap">hex[64]</td>
                      <td className="py-3">SHA-256 of the file contents</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">prev_hash</td>
                      <td className="py-3 pr-4 whitespace-nowrap">hex[64]</td>
                      <td className="py-3">Hash of previous chain entry</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">signature</td>
                      <td className="py-3 pr-4 whitespace-nowrap">hex[128]</td>
                      <td className="py-3">Ed25519 signature over canonical payload</td>
                    </tr>
                    <tr className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 pr-4 text-primary/90">metadata</td>
                      <td className="py-3 pr-4 whitespace-nowrap">object</td>
                      <td className="py-3">Optional name, project, domain fields</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* SIGNING ALGORITHM */}
              <section className="relative rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                <h2 className="text-xl font-mono text-primary mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" /> SIGNING ALGORITHM
                </h2>
                <div className="bg-background/80 border border-primary/20 rounded p-4 overflow-x-auto">
                  <pre className="font-mono text-sm text-primary/80"><code>{`payload = {
  protocol: "etch-v1",
  algorithm: "sha2-256",
  code_hash: hash(file_contents),
  contributor: public_key,
  prev_entry: hash(previous_fingerprint),
  timestamp: utc_now()
}
signature = ed25519_sign(private_key, canonical_json(payload))`}</code></pre>
                </div>
              </section>

              {/* CHAIN STRUCTURE */}
              <section className="relative rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                <h2 className="text-xl font-mono text-primary mb-4 flex items-center gap-2">
                  <GitMerge className="h-5 w-5" /> CHAIN STRUCTURE
                </h2>
                <div className="bg-background/80 border border-primary/20 rounded p-4 overflow-x-auto">
                  <pre className="font-mono text-sm text-primary/80"><code>{`chain = [fingerprint_1, fingerprint_2, ..., fingerprint_n]
each entry: prev_hash == sha256(canonical(entry[i-1]))
genesis: prev_hash == "genesis"
tamper_detected: if any prev_hash mismatch → chain invalid`}</code></pre>
                </div>
              </section>

              {/* CONTRIBUTION STANDARDS */}
              <section className="relative rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                <h2 className="text-xl font-mono text-primary mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" /> CONTRIBUTION STANDARDS
                </h2>
                <ul className="space-y-3 font-mono text-sm sm:text-base text-muted-foreground list-none pl-0">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">&gt;</span> Minimum score: 0.6 / 1.0
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">&gt;</span> Logic weight: 40% — new functions, control flow, error handling
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">&gt;</span> Architecture weight: 30% — new structs, traits, modules
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">&gt;</span> Complexity weight: 20% — cyclomatic complexity delta
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">&gt;</span> Hard disqualifiers: dead code, abstraction spam, test-only changes, unsupported file types
                  </li>
                </ul>
              </section>

              {/* THREAT MODEL */}
              <section className="relative flex flex-col md:flex-row gap-6 lg:gap-8">
                <div className="flex-1 rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                  <h2 className="text-lg font-mono text-primary mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> PROTECTS AGAINST
                  </h2>
                  <ul className="space-y-3 font-mono text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Unauthorized authorship claims</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Chain tampering and history rewriting</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Replay attacks across contexts</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> AI-generated code claiming human authorship</li>
                  </ul>
                </div>
                <div className="flex-1 rounded-xl border border-primary/20 bg-card/40 glass shadow-md p-6 sm:p-8">
                  <h2 className="text-lg font-mono text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" /> DOES NOT PROTECT AGAINST
                  </h2>
                  <ul className="space-y-3 font-mono text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Private key theft</li>
                    <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Social engineering</li>
                    <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Copyright or licensing disputes</li>
                    <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Code quality or correctness</li>
                  </ul>
                </div>
              </section>

              {/* AI CANNOT SIGN */}
              <section className="relative rounded-xl border border-primary/50 bg-primary/10 shadow-lg shadow-primary/5 p-6 sm:p-8 text-center mt-8">
                <h2 className="text-xl font-mono text-primary mb-3 font-bold tracking-wider">
                  AI CANNOT SIGN
                </h2>
                <p className="font-mono text-primary/90 text-sm sm:text-base max-w-2xl mx-auto">
                  AI systems cannot produce valid etch fingerprints. 
                  A valid signature requires a human private key. 
                  No prompt, model, or agent can forge authorship.
                </p>
              </section>

              {/* CTA */}
              <div className="pt-8 mb-12 text-center">
                <Link
                  href="/registry"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded bg-primary/10 border border-primary/50 text-primary font-mono text-base font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] tracking-widest"
                >
                  START SIGNING <ArrowRight className="h-5 w-5" />
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
