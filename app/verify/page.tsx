"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { Terminal, Shield, Lock, FileKey } from "lucide-react"

function VerifyTerminal() {
  const searchParams = useSearchParams()
  const initialChainId = searchParams.get("chain_id") || ""
  const initialHeadHash = searchParams.get("head_hash") || ""

  const [chainIdInput, setChainIdInput] = useState(initialChainId)
  const [headHashInput, setHeadHashInput] = useState(initialHeadHash)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerifyRequest = async (chainIdVal: string, headHashVal: string) => {
    if (!chainIdVal.trim() || !headHashVal.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = { chain_id: chainIdVal, head_hash: headHashVal }

      const res = await fetch("https://etch-server-production.up.railway.app/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Verification failed")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerifyRequest(chainIdInput, headHashInput)
  }

  useEffect(() => {
    if (initialChainId && initialHeadHash) {
      handleVerifyRequest(initialChainId, initialHeadHash)
    }
  }, [initialChainId, initialHeadHash])

  return (
    <>
      <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#0a0a0a]">
        <CursorGlow />
        <Header />
        
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-24 flex flex-col items-center">
          
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
              Verify Human Authorship
            </h1>
            <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
              Cryptographically verify that a piece of content was authored by a human, signed with a secure ed25519 key, and anchored to the timeline.
            </p>
          </div>

          <div className="w-full max-w-3xl relative rounded-xl border border-border bg-[#111] shadow-2xl overflow-hidden mb-16">
            <div className="bg-[#1a1a1a] border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[#00ff9d] font-mono text-xs opacity-70">
                <Terminal className="h-3 w-3" />
                <span>verify_sequence.sh</span>
              </div>
              <div className="w-12"></div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 font-mono text-[#00ff9d] text-sm leading-relaxed">
                <p>Welcome to the ETCH verification terminal.</p>
                <p className="text-muted-foreground mt-1">Enter a file path or chain_id to cryptographically verify human authorship.</p>
              </div>

              <form onSubmit={handleVerify} className="relative mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#00ff9d] font-mono font-bold">$</span>
                  <input
                    type="text"
                    value={chainIdInput}
                    onChange={(e) => setChainIdInput(e.target.value)}
                    placeholder="chain_id / relative path"
                    className="flex-1 bg-transparent border-0 border-b border-[#00ff9d]/30 rounded-none px-2 py-2 font-mono text-white focus:border-[#00ff9d] focus:ring-0 outline-none placeholder:text-muted-foreground/50 transition-colors"
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#00ff9d] font-mono font-bold">&gt;</span>
                  <input
                    type="text"
                    value={headHashInput}
                    onChange={(e) => setHeadHashInput(e.target.value)}
                    placeholder="head_hash (chain terminal hash)"
                    className="flex-1 bg-transparent border-0 border-b border-[#00ff9d]/30 rounded-none px-2 py-2 font-mono text-white focus:border-[#00ff9d] focus:ring-0 outline-none placeholder:text-muted-foreground/50 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !chainIdInput.trim() || !headHashInput.trim()}
                    className="px-6 py-2 rounded border border-[#00ff9d]/50 text-[#00ff9d] font-mono text-sm bg-[#00ff9d]/10 hover:bg-[#00ff9d] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest font-bold"
                  >
                    VERIFY
                  </button>
                </div>
              </form>

              <div className="min-h-[160px] bg-[#0a0a0a] border border-[#00ff9d]/20 rounded p-4 font-mono text-sm overflow-hidden relative">
                {loading && (
                  <div className="text-[#00ff9d]/70 animate-pulse">
                    &gt; establishing secure connection...<br/>
                    &gt; fetching chain sequence for [{chainIdInput}]...<br/>
                    <span className="inline-block mt-2">
                      <span className="animate-[ping_1.5s_infinite] inline-block w-2 h-4 bg-[#00ff9d] align-middle mr-2"></span>
                      verifying cryptographic signatures...
                    </span>
                  </div>
                )}

                {!loading && !result && !error && (
                  <div className="text-muted-foreground/50">
                    &gt; waiting for input...
                  </div>
                )}

                {error && !loading && (
                  <div className="text-red-500">
                    &gt; verifying chain: [{chainIdInput}]<br/>
                    &gt; status: FAILED<br/>
                    &gt; error: {error}
                  </div>
                )}

                {result && !loading && (
                  <div className="animate-fade-in text-[#00ff9d]/90 space-y-1">
                    <div>&gt; verifying chain: <span className="text-white">{chainIdInput}</span></div>
                    <div>
                      &gt; head hash: <span className="text-white">{headHashInput}</span>
                    </div>
                    <div>
                      &gt; status: <span className={result.valid ? "text-[#00ff9d] font-bold" : "text-red-500 font-bold"}>
                        {result.valid ? "VERIFIED" : "FAILED"}
                      </span>
                    </div>
                    <div>&gt; stored hash: <span className="text-white">{result.stored_head_hash || 'N/A'}</span></div>
                    <div>&gt; anchored at: <span className="text-white">{result.anchored_at ? new Date(result.anchored_at).toLocaleString() : 'N/A'}</span></div>
                    {result.mismatch_reason && (
                      <div className="text-red-500 mt-2">&gt; mismatch reason: {result.mismatch_reason}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* What gets verified section */}
          <div className="w-full max-w-4xl pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-white font-sans text-center mb-8">What gets verified</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-lg border border-border bg-[#111] flex flex-col items-center text-center">
                <FileKey className="w-8 h-8 text-[#00ff9d] mb-4" />
                <h3 className="text-white font-bold mb-2">Signature Validity</h3>
                <p className="text-sm text-muted-foreground">Ensures the ed25519 signature correctly matches the public key of the author.</p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-[#111] flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-[#00ff9d] mb-4" />
                <h3 className="text-white font-bold mb-2">Chain Integrity</h3>
                <p className="text-sm text-muted-foreground">Validates the hash chain connecting all revisions back to the genesis block.</p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-[#111] flex flex-col items-center text-center">
                <Terminal className="w-8 h-8 text-[#00ff9d] mb-4" />
                <h3 className="text-white font-bold mb-2">Artifact Binding</h3>
                <p className="text-sm text-muted-foreground">Confirms the file hash matches the content exactly as it was when signed.</p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-[#111] flex flex-col items-center text-center">
                <Lock className="w-8 h-8 text-[#00ff9d] mb-4" />
                <h3 className="text-white font-bold mb-2">Server Anchor</h3>
                <p className="text-sm text-muted-foreground">Checks the central registry for the authoritative timestamp of the signature.</p>
              </div>

            </div>
          </div>

        </div>
        
        <Footer />
      </main>
    </>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#00ff9d] font-mono">
        <CursorGlow />
        establishing secure connection...
      </main>
    }>
      <VerifyTerminal />
    </Suspense>
  )
}
