"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ShieldCheck, Link as LinkIcon, Copy, Check } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function RegistryPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    fetch("https://etch-server-production.up.railway.app/anchors")
      .then(res => res.json())
      .then(data => {
        setModules(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setModules([])
        setLoading(false)
      })
  }, [])

  const filteredModules = modules.filter(m => {
    const filename = m.file_path ? m.file_path.split(/[/\\]/).pop() : ""
    const matchesSearch = filename.toLowerCase().includes(search.toLowerCase()) || 
                          (m.contributor_pubkey || "").toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filter === "VERIFIED") return true
    if (filter === "RECENT") return true // Simplification
    return true
  })

  return (
    <>
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24">
            <div className="space-y-4 mb-12">
              <h1 className="text-4xl font-bold tracking-tight font-mono text-primary">REGISTRY</h1>
              <p className="text-muted-foreground font-mono">Verified human-authored modules</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by name or author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-border bg-card/50 pl-10 pr-4 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex p-1 rounded-lg border border-border bg-card/50 shrink-0 w-full sm:w-auto">
                {["ALL", "VERIFIED", "RECENT"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-mono rounded-md transition-colors ${filter === f ? 'bg-primary/20 text-primary border border-primary/50' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredModules.length === 0 ? (
              <div className="text-center py-20 border border-border/50 rounded-xl bg-card/20 border-dashed">
                <p className="text-muted-foreground font-mono">No modules found in registry.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((m, i) => (
                  <div key={i} className="flex flex-col p-6 rounded-xl border border-primary/20 bg-card/40 hover:bg-card/60 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-mono font-semibold text-lg text-primary truncate pr-2" title={m.file_path}>{m.file_path ? m.file_path.split(/[/\\]/).pop() : 'Unknown'}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono leading-none">
                        <ShieldCheck className="h-3 w-3" /> VERIFIED
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 flex-1 text-sm font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/60">Author:</span>
                        <button 
                          onClick={() => copyToClipboard(m.contributor_pubkey, `author-${m.id || i}`)}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors group/copy relative outline-none"
                          title="Copy full author pubkey"
                        >
                          {copiedId === `author-${m.id || i}` ? (
                            <span className="text-primary flex items-center"><Check className="h-3 w-3 mr-1" /> Copied!</span>
                          ) : (
                            <>
                              {(m.contributor_pubkey || 'Unknown').substring(0, 8)}...
                              <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/60">Chain ID:</span>
                        <button 
                          onClick={() => copyToClipboard(m.chain_id, `chain-${m.id || i}`)}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors group/copy relative outline-none"
                          title="Copy full chain ID"
                        >
                          {copiedId === `chain-${m.id || i}` ? (
                            <span className="text-primary flex items-center"><Check className="h-3 w-3 mr-1" /> Copied!</span>
                          ) : (
                            <>
                              {(m.chain_id || 'Unknown').substring(0, 8)}...
                              <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/60">Chain Depth:</span> 
                        <span>{m.chain_depth || 1}</span>
                        <button 
                          onClick={() => copyToClipboard(m.chain_id, `depth-copy-${m.id || i}`)}
                          className="flex items-center hover:text-primary transition-colors group/copy relative outline-none"
                          title="Copy full chain ID"
                        >
                          {copiedId === `depth-copy-${m.id || i}` ? (
                            <span className="text-primary flex items-center"><Check className="h-3 w-3" /></span>
                          ) : (
                            <Copy className="h-3 w-3 opacity-50 group-hover/copy:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </div>
                      <p><span className="text-foreground/60">Last Signed:</span> {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                    <Link
                      href={`/registry/${m.chain_id || ''}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 mt-auto rounded border border-primary/50 bg-primary/10 text-primary font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <LinkIcon className="h-3 w-3" /> VIEW CHAIN
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
