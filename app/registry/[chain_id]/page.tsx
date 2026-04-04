"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2, ShieldCheck, Copy, Check, Terminal, Link as LinkIcon } from "lucide-react" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function ChainPage() {
  const params = useParams()
  const chainId = params.chain_id as string
  
  const [chainNodes, setChainNodes] = useState<any[]>([])
  const [dependencies, setDependencies] = useState<{ depends_on: string[], used_by: string[] } | null>(null)
  const [loading, setLoading] = useState(true)
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
        if (Array.isArray(data)) {
          // Find all anchors with matching chain_id
          const matchingNodes = data.filter(d => d.chain_id === chainId)
          // Sort by depth ascending
          matchingNodes.sort((a, b) => (a.chain_depth || 1) - (b.chain_depth || 1))
          setChainNodes(matchingNodes)
        }
        setLoading(false)

        fetch(`https://etch-server-production.up.railway.app/anchors/${chainId}/dependencies`)
          .then(res => res.json())
          .then(depData => {
            setDependencies(depData)
          })
          .catch(err => {
            console.error("Failed to fetch dependencies", err)
            setDependencies({ depends_on: [], used_by: [] })
          })
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        setDependencies({ depends_on: [], used_by: [] })
      })
  }, [chainId])

  const latestNode = chainNodes.length > 0 ? chainNodes[chainNodes.length - 1] : null
  const filename = latestNode?.file_path ? latestNode.file_path.split(/[/\\]/).pop() : "Unknown Module"

  return (
    <>
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24">
            
            {loading ? (
              <div className="flex items-center justify-center py-32 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chainNodes.length === 0 ? (
              <div className="text-center py-20 border border-border/50 rounded-xl bg-card/20 border-dashed">
                <Terminal className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-mono">Chain not found in registry.</p>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h1 className="text-4xl font-bold tracking-tight font-mono text-primary mb-2 truncate" title={filename}>
                    {filename}
                  </h1>
                  <p className="text-muted-foreground font-mono tracking-widest uppercase text-sm">Authorship Chain</p>
                </div>

                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
                  {chainNodes.map((node, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary font-mono text-xs font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10" title="Latest Anchor Depth">
                        #{node.chain_depth || (i + 1)}
                      </div>
                      
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl border border-primary/20 bg-card/60 glass shadow-md relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-primary/30 text-[10px] text-primary/80 whitespace-nowrap font-mono">
                          Showing latest anchor — chain depth: {node.chain_depth || (i + 1)}
                        </div>
                        <div className="flex justify-between items-center mb-4 mt-2 border-b border-primary/10 pb-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            {node.created_at ? new Date(node.created_at).toLocaleString() : 'Unknown Time'}
                          </span>
                          <div className="flex items-center gap-1 text-primary text-[10px] font-mono border border-primary/30 bg-primary/10 px-2 py-0.5 rounded">
                            <ShieldCheck className="h-3 w-3" /> VERIFIED
                          </div>
                        </div>
                        
                        <div className="space-y-3 text-sm font-mono break-all">
                          <div>
                            <p className="text-foreground/50 text-[10px] uppercase mb-1">Author Pubkey</p>
                            <p className="text-primary/90">{node.contributor_pubkey}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-foreground/50 text-[10px] uppercase mb-1">File Hash</p>
                              <p className="text-foreground/80">{(node.head_hash || '').substring(0, 16)}...</p>
                            </div>
                            <div>
                              <p className="text-foreground/50 text-[10px] uppercase mb-1">Prev Hash</p>
                              <p className="text-foreground/80">{(node.prev_hash || 'genesis_block_00').substring(0, 16)}...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 p-6 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 glass">
                  <div className="w-full sm:w-auto overflow-hidden">
                    <p className="font-mono text-xs text-primary/70 mb-1">CHAIN HEAD HASH</p>
                    <p className="font-mono text-sm text-primary truncate sm:max-w-md" title={latestNode.head_hash}>{latestNode.head_hash}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(latestNode.head_hash, 'head-hash')}
                    className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded border border-primary/50 text-primary font-mono text-xs bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto outline-none"
                  >
                    {copiedId === 'head-hash' ? (
                      <><Check className="h-4 w-4" /> COPIED!</>
                    ) : (
                      <><Copy className="h-4 w-4" /> COPY HASH</>
                    )}
                  </button>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <a
                    href={`/verify?chain_id=${latestNode.chain_id}&head_hash=${latestNode.head_hash}`}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-md border border-primary/50 bg-primary/20 text-primary font-mono text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                  >
                    <ShieldCheck className="h-5 w-5" /> VERIFY THIS CHAIN
                  </a>
                </div>

                {dependencies && (
                  <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-xl font-mono text-primary mb-4 border-b border-primary/20 pb-2">DEPENDS ON</h2>
                      {dependencies.depends_on && dependencies.depends_on.length > 0 ? (
                        <div className="space-y-3">
                          {dependencies.depends_on.map((dep, idx) => (
                            <a key={`dep-${idx}`} href={`/registry/${dep}`} className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-card/40 hover:bg-primary/10 transition-colors group cursor-pointer">
                              <span className="font-mono text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                {dep.substring(0, 16)}...
                              </span>
                              <LinkIcon className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded border border-border/50 border-dashed bg-card/20 text-center">
                          <p className="text-muted-foreground font-mono text-sm">&gt; No dependencies registered</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-mono text-primary mb-4 border-b border-primary/20 pb-2">USED BY</h2>
                      {dependencies.used_by && dependencies.used_by.length > 0 ? (
                        <div className="space-y-3">
                          {dependencies.used_by.map((dep, idx) => (
                            <a key={`used-${idx}`} href={`/registry/${dep}`} className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-card/40 hover:bg-primary/10 transition-colors group cursor-pointer">
                              <span className="font-mono text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                {dep.substring(0, 16)}...
                              </span>
                              <LinkIcon className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded border border-border/50 border-dashed bg-card/20 text-center">
                          <p className="text-muted-foreground font-mono text-sm">&gt; No dependents registered</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </>
            )}
            
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}



