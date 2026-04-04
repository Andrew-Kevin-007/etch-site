"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ShieldCheck, Copy, Check, Clock, FileKey, GitMerge } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function RegistryPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://etch-server-production.up.railway.app/anchors")
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data)) {
          // Deduplicate by file_path
          const latestAnchors = new Map<string, any>()
          for (const anchor of data) {
            const current = latestAnchors.get(anchor.file_path)
            if (!current) {
              latestAnchors.set(anchor.file_path, anchor)
            } else {
              const currentDepth = current.chain_depth || 1
              const anchorDepth = anchor.chain_depth || 1
              if (anchorDepth > currentDepth) {
                latestAnchors.set(anchor.file_path, anchor)
              } else if (anchorDepth === currentDepth) {
                if (new Date(anchor.created_at) > new Date(current.created_at)) {
                  latestAnchors.set(anchor.file_path, anchor)
                }
              }
            }
          }
          
          const dedupedModules = Array.from(latestAnchors.values())
          
          // Fetch dependencies for each module
          const modulesWithDeps = await Promise.all(dedupedModules.map(async (m) => {
            try {
              const res = await fetch(`https://etch-server-production.up.railway.app/anchors/${m.chain_id}/dependencies`)
              if (res.ok) {
                const depData = await res.json()
                return { ...m, dependencies: depData }
              }
              return { ...m, dependencies: { depends_on: [], used_by: [] } }
            } catch (err) {
              return { ...m, dependencies: { depends_on: [], used_by: [] } }
            }
          }))

          setModules(modulesWithDeps)
        } else {
          setModules([])
        }
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
    return true
  })

  return (
    <>
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-36 pb-24">
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl font-bold tracking-tight font-mono text-primary">REGISTRY</h1>
              <p className="text-muted-foreground font-mono">Verified human-authored modules</p>
            </div>

            <div className="mb-8 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a module by name or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-primary/30 bg-card/60 pl-12 pr-4 py-4 text-base font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
            </div>

            {search.trim().length < 2 ? (
              <div className="text-center py-24 border border-border/50 rounded-xl bg-card/20 border-dashed">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-sm sm:text-base">Search for a module by name or author...</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-20 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredModules.length === 0 ? (
              <div className="text-center py-20 border border-border/50 rounded-xl bg-card/20 border-dashed">
                <p className="text-muted-foreground font-mono">No modules found in registry.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 bg-card/40 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-primary/20 bg-primary/5 text-xs font-mono font-semibold text-muted-foreground tracking-wider uppercase">
                  <div className="col-span-5 sm:col-span-4 pl-2">Module / File</div>
                  <div className="col-span-4 sm:col-span-3">Author</div>
                  <div className="hidden sm:block sm:col-span-1 text-center">Depth</div>
                  <div className="hidden sm:block sm:col-span-2">Last Signed</div>
                  <div className="col-span-3 sm:col-span-2 text-right pr-2">Status</div>
                </div>
                <div className="divide-y divide-primary/10">
                  {filteredModules.map((m, i) => (
                    <Link
                      key={i}
                      href={`/registry/${m.chain_id || ''}`}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-primary/10 transition-colors group"
                    >
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3 pl-2 overflow-hidden">
                        <FileKey className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                        <span className="font-mono text-sm text-primary font-medium truncate" title={m.file_path}>
                          {m.file_path ? m.file_path.split(/[/\\]/).pop() : 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="col-span-4 sm:col-span-3 font-mono text-xs text-muted-foreground truncate" title={m.contributor_pubkey}>
                        {m.contributor_pubkey ? m.contributor_pubkey.substring(0, 8) + '...' : 'Unknown'}
                      </div>
                      
                      <div className="hidden sm:flex sm:col-span-1 flex-row items-center justify-center font-mono text-xs text-muted-foreground">
                        <GitMerge className="h-3 w-3 mr-1.5 opacity-60" />
                        {m.chain_depth || 1}
                      </div>

                      <div className="hidden sm:flex sm:col-span-2 items-center font-mono text-xs text-muted-foreground truncate">
                        <Clock className="h-3 w-3 mr-1.5 opacity-60" />
                        {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Unknown'}
                      </div>

                      <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 pr-2">
                        {m.dependencies?.depends_on?.length > 0 ? (
                          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono font-medium border border-purple-500/20 whitespace-nowrap truncate">
                            MERGED
                          </div>
                        ) : (
                          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-mono font-medium border border-green-500/20 whitespace-nowrap truncate">
                            STANDALONE
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono font-medium whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-shadow">
                          <ShieldCheck className="h-3 w-3" /> VERIFIED
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
