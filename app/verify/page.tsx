"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { Terminal, Shield } from "lucide-react"

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
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24 flex flex-col items-center justify-center">
            
            <div className="w-full relative rounded-xl border border-border bg-card/60 glass shadow-2xl p-6 sm:p-10 mb-8">
              <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-background/50 rounded-md px-3 py-1 font-mono text-xs text-muted-foreground flex items-center gap-2">
                <Terminal className="h-3 w-3" /> verify_sequence.sh
              </div>

              <div className="mt-8">
                <div className="mb-6 font-mono text-primary text-sm sm:text-base leading-relaxed">
                  <p>Welcome to etch verification terminal.</p>
                  <p className="text-muted-foreground mt-2">Enter a file path or chain_id to cryptographically verify human authorship.</p>
                </div>

                <form onSubmit={handleVerify} className="relative mb-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono font-bold">$</span>
                    <input
                      type="text"
                      value={chainIdInput}
                      onChange={(e) => setChainIdInput(e.target.value)}
                      placeholder="chain_id / file path (SHA-256)"
                      className="flex-1 bg-transparent border-0 border-b border-primary/30 rounded-none px-2 py-2 font-mono text-foreground focus:border-primary focus:ring-0 outline-none placeholder:text-muted-foreground/50 transition-colors"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono font-bold">&gt;</span>
                    <input
                      type="text"
                      value={headHashInput}
                      onChange={(e) => setHeadHashInput(e.target.value)}
                      placeholder="head_hash (chain terminal hash)"
                      className="flex-1 bg-transparent border-0 border-b border-primary/30 rounded-none px-2 py-2 font-mono text-foreground focus:border-primary focus:ring-0 outline-none placeholder:text-muted-foreground/50 transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !chainIdInput.trim() || !headHashInput.trim()}
                      className="px-6 py-2 rounded border border-primary/50 text-primary font-mono text-sm bg-primary/10 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest"
                    >
                      VERIFY
                    </button>
                  </div>
                </form>

                <div className="min-h-[160px] bg-background/50 border border-primary/20 rounded p-4 font-mono text-sm overflow-hidden relative">
                  {loading && (
                    <div className="text-primary/70 animate-pulse">
                      &gt; establishing secure connection...<br/>
                      &gt; fetching chain sequence for [{chainIdInput}]...<br/>   
                      <span className="inline-block mt-2">
                        <span className="animate-[ping_1.5s_infinite] inline-block w-2 h-4 bg-primary align-middle mr-2"></span>
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
                    <div className="text-destructive">
                      &gt; verifying chain: [{chainIdInput}]<br/>
                      &gt; status: FAILED<br/>
                      &gt; error: {error}
                    </div>
                  )}

                  {result && !loading && (
                    <div className="animate-fade-in text-primary/90 space-y-1">
                      <div>&gt; verifying chain: <span className="text-foreground">{chainIdInput}</span></div>
                      <div>
                        &gt; head hash: <span className="text-foreground">{headHashInput}</span>
                      </div>
                      <div>
                        &gt; status: <span className={result.valid ? "text-primary font-bold" : "text-destructive font-bold"}>
                          {result.valid ? "VERIFIED" : "FAILED"}
                        </span>
                      </div>
                      <div>&gt; stored hash: <span className="text-foreground">{result.stored_head_hash || 'N/A'}</span></div>
                      <div>&gt; anchored at: <span className="text-foreground">{result.anchored_at ? new Date(result.anchored_at).toLocaleString() : 'N/A'}</span></div>
                      {result.mismatch_reason && (
                        <div className="text-destructive mt-2">&gt; mismatch reason: {result.mismatch_reason}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <Shield className="h-8 w-8 mx-auto text-primary/40" />
              <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
                The verification process checks the ed25519 signature against the file hash
                and ensures the cryptographic chain of authorship is intact.
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen overflow-hidden scanlines flex items-center justify-center text-primary font-mono">
        <CursorGlow />
        establishing secure connection...
      </main>
    }>
      <VerifyTerminal />
    </Suspense>
  )
}

