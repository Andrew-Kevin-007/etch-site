"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ShieldCheck, Clock, FileKey, GitMerge, FileArchive, Users, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function RegistryPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [stats, setStats] = useState({
    totalModules: 0,
    totalContributors: 0,
    totalChains: 0
  })

  useEffect(() => {
    fetch("https://etch-server-production.up.railway.app/anchors")
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data)) {
          // Calculate high level stats before deduping
          const uniqueContributors = new Set()
          let totalChainDepth = 0

          // Deduplicate by file_path
          const latestAnchors = new Map<string, any>()
          for (const anchor of data) {
            
            if (anchor.contributor_pubkey) {
               uniqueContributors.add(anchor.contributor_pubkey)
            }
            totalChainDepth += (anchor.chain_depth || 1)

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

          setStats({
            totalModules: dedupedModules.length,
            totalContributors: uniqueContributors.size,
            totalChains: totalChainDepth
          })

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
      <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#0a0a0a]">   
        <CursorGlow />
        <Header />
        
        <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-32 pb-24">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans mb-4">
              Registry
            </h1>
            <p className="text-muted-foreground font-mono text-sm max-w-2xl">
              Explore the index of cryptographically signed modules anchored on ETCH.
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             <div className="border border-[#00ff9d]/20 bg-[#111] rounded-lg p-6 flex flex-col items-center justify-center">
                 <FileArchive className="h-6 w-6 text-[#00ff9d] mb-2" />
                 <span className="text-3xl font-mono text-white font-bold">{loading ? "..." : stats.totalModules}</span>
                 <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">Modules Signed</span>
             </div>
             <div className="border border-border bg-[#111] rounded-lg p-6 flex flex-col items-center justify-center">
                 <Users className="h-6 w-6 text-muted-foreground mb-2" />
                 <span className="text-3xl font-mono text-white font-bold">{loading ? "..." : stats.totalContributors}</span>
                 <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">Contributors</span>
             </div>
             <div className="border border-border bg-[#111] rounded-lg p-6 flex flex-col items-center justify-center">
                 <LinkIcon className="h-6 w-6 text-muted-foreground mb-2" />
                 <span className="text-3xl font-mono text-white font-bold">{loading ? "..." : stats.totalChains}</span>
                 <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">Chains Verified</span>
             </div>
          </div>

          <div className="mb-8 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for a module by name or author..."     
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#00ff9d]/30 bg-[#111] pl-12 pr-4 py-4 text-base font-mono text-white focus:border-[#00ff9d] focus:outline-none focus:ring-1 focus:ring-[#00ff9d] placeholder:text-muted-foreground transition-all"
            />
          </div>

          {search.trim().length > 0 && search.trim().length < 2 ? (
            <div className="text-center py-24 border border-border/50 rounded-xl bg-[#111] border-dashed">
              <p className="text-muted-foreground font-mono">Type at least 2 characters to search...</p>
            </div>
          ) : search.trim().length === 0 ? (
            <div className="text-center py-24 border border-border/50 rounded-xl bg-[#111] border-dashed">
              <Search className="h-10 w-10 text-[#00ff9d]/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-sm mb-4">Search the registry for a specific module or author.</p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground/70">
                <span>Try:</span>
                <button onClick={() => setSearch("utils")} className="px-2 py-1 rounded bg-[#1a1a1a] hover:bg-[#222] hover:text-[#00ff9d] transition-colors border border-border">utils</button>
                <button onClick={() => setSearch("config")} className="px-2 py-1 rounded bg-[#1a1a1a] hover:bg-[#222] hover:text-[#00ff9d] transition-colors border border-border">config</button>
                <button onClick={() => setSearch("index")} className="px-2 py-1 rounded bg-[#1a1a1a] hover:bg-[#222] hover:text-[#00ff9d] transition-colors border border-border">index</button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20 text-[#00ff9d]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="text-center py-20 border border-border/50 rounded-xl bg-[#111] border-dashed">
              <p className="text-muted-foreground font-mono">No modules found matching "{search}".</p>
            </div>
          ) : (
             <div className="rounded-xl border border-[#00ff9d]/20 bg-[#111] overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#00ff9d]/20 bg-[#1a1a1a] text-xs font-mono font-semibold text-muted-foreground tracking-wider uppercase">
                <div className="col-span-5 sm:col-span-4 pl-2">Module / File</div>
                <div className="col-span-4 sm:col-span-3">Author</div>   
                <div className="hidden sm:block sm:col-span-1 text-center">Depth</div>
                <div className="hidden sm:block sm:col-span-2">Last Signed</div>
                <div className="col-span-3 sm:col-span-2 text-right pr-2">Status</div>
              </div>
              <div className="divide-y divide-border">
                {filteredModules.map((m, i) => (
                  <Link
                    key={i}
                    href={`/registry/${m.chain_id || ''}`}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-3 pl-2 overflow-hidden">
                      <FileKey className="h-4 w-4 text-muted-foreground group-hover:text-[#00ff9d] shrink-0 transition-colors" />
                      <span className="font-mono text-sm text-[#00ff9d] font-medium truncate" title={m.file_path}>
                        {m.file_path ? m.file_path.split(/[/\\]/).pop() : 'Unknown'}
                      </span>
                    </div>

                    <div className="col-span-4 sm:col-span-3 font-mono text-xs text-muted-foreground truncate" title={m.contributor_pubkey}>        
                      {m.contributor_pubkey ? m.contributor_pubkey.substring(0, 8) + '...' : 'Unknown'}
                    </div>

                    <div className="hidden sm:flex sm:col-span-1 flex-row items-center justify-center font-mono text-xs text-muted-foreground">     
                      <GitMerge className="h-3 w-3 mr-1.5 opacity-60 group-hover:text-[#00ff9d] transition-colors" /> 
                      {m.chain_depth || 1}
                    </div>

                    <div className="hidden sm:flex sm:col-span-2 items-center font-mono text-xs text-muted-foreground truncate">
                      <Clock className="h-3 w-3 mr-1.5 opacity-60" />    
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Unknown'}
                    </div>

                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 pr-2">
                       <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-[10px] font-mono font-medium whitespace-nowrap group-hover:bg-[#00ff9d]/20 transition-colors">   
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
      </main>
    </>
  )
}
