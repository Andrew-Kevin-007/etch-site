"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ShieldCheck, Clock, FileKey, GitMerge, FileArchive, Users, Link as LinkIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
      <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#f8f9fa] selection:bg-blue-100">   
        <Header />
        
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 pt-32 pb-24">
          
          <div className="mb-10">
            <h1 className="text-4xl text-[#202124] font-medium tracking-tight mb-3">
              Registry Explorer
            </h1>
            <p className="text-[#5f6368] text-base max-w-2xl">
              Directory of all cryptographically signed and verified modules anchored on the ETCH protocol network.
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
             <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 flex items-center justify-between transition-shadow hover:shadow-md">
                 <div>
                   <span className="text-sm text-[#5f6368] font-medium uppercase tracking-wider block mb-1">Modules Signed</span>
                   <span className="text-3xl font-bold text-[#202124] tracking-tight">{loading ? "..." : stats.totalModules}</span>
                 </div>
                 <div className="p-4 bg-blue-50 rounded-xl">
                   <FileArchive className="h-6 w-6 text-blue-600" />
                 </div>
             </div>

             <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 flex items-center justify-between transition-shadow hover:shadow-md">
                 <div>
                   <span className="text-sm text-[#5f6368] font-medium uppercase tracking-wider block mb-1">Contributors</span>
                   <span className="text-3xl font-bold text-[#202124] tracking-tight">{loading ? "..." : stats.totalContributors}</span>
                 </div>
                 <div className="p-4 bg-purple-50 rounded-xl">
                   <Users className="h-6 w-6 text-purple-600" />
                 </div>
             </div>

             <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 flex items-center justify-between transition-shadow hover:shadow-md">
                 <div>
                   <span className="text-sm text-[#5f6368] font-medium uppercase tracking-wider block mb-1">Chains Verified</span>
                   <span className="text-3xl font-bold text-[#202124] tracking-tight">{loading ? "..." : stats.totalChains}</span>
                 </div>
                 <div className="p-4 bg-green-50 rounded-xl">
                   <LinkIcon className="h-6 w-6 text-green-600" />
                 </div>
             </div>
             
          </div>

          {/* Controls & Search */}
          <div className="mb-6 relative w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by module name or public key..."     
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white pl-14 pr-6 py-4 text-base text-[#202124] shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400 transition-all font-mono"
            />
          </div>

          {/* Conditional Data Table */}
          {search.trim().length > 0 && search.trim().length < 2 ? (
            <div className="text-center py-24 border border-gray-200 rounded-2xl bg-white/50 border-dashed">
             <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-[#5f6368] font-medium">Type at least 2 characters to filter...</p>
            </div>
          ) : search.trim().length === 0 ? (
            <div className="text-center py-24 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Search className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Search the Registry</h3>
              <p className="text-[#5f6368] text-sm mb-6 max-w-sm mx-auto">Look up any module, library, or specific contributor pubkey indexed by the ETCH protocol.</p>
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-gray-500">
                <span>Try filtering:</span>
                <button onClick={() => setSearch("utils")} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200/60 font-mono text-xs">utils</button>
                <button onClick={() => setSearch("config")} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200/60 font-mono text-xs">config</button>
                <button onClick={() => setSearch("index")} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200/60 font-mono text-xs">index</button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-blue-600 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-gray-500 font-medium text-sm">Querying distributed anchors...</p>
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="text-center py-24 border border-gray-200 rounded-2xl bg-white shadow-sm border-dashed">
              <p className="text-gray-500 font-medium">No registered modules found matching <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">"{search}"</span>.</p>
            </div>
          ) : (
             <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-12">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-[#f8f9fa] text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
                <div className="col-span-5 sm:col-span-4 pl-4">Target File</div>
                <div className="col-span-4 sm:col-span-3">Signer Identity Key</div>   
                <div className="hidden sm:block sm:col-span-1 text-center">Depth</div>
                <div className="hidden sm:block sm:col-span-2">Commit Date</div>
                <div className="col-span-3 sm:col-span-2 text-right pr-4">Network Status</div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredModules.map((m, i) => (
                  <Link
                    key={i}
                    href={`/registry/${m.chain_id || ''}`}
                    className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-blue-50/30 transition-colors group"
                  >
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-3 pl-4 overflow-hidden">
                      <FileKey className="h-4 w-4 text-gray-400 group-hover:text-blue-500 shrink-0 transition-colors" />
                      <span className="font-mono text-[13px] text-[#202124] font-medium truncate" title={m.file_path}>
                        {m.file_path ? m.file_path.split(/[/\\]/).pop() : 'Unknown'}
                      </span>
                    </div>

                    <div className="col-span-4 sm:col-span-3 flex items-center">        
                       <code className="bg-[#f1f3f4] text-[#3c4043] px-2 py-1 rounded-md text-[11px] font-mono border border-gray-200/60 truncate" title={m.contributor_pubkey}>
                          {m.contributor_pubkey ? m.contributor_pubkey.substring(0, 8) + '...' : 'Unknown'}
                       </code>
                    </div>

                    <div className="hidden sm:flex sm:col-span-1 flex-row items-center justify-center font-mono text-[13px] text-[#5f6368]">     
                      <GitMerge className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> 
                      {m.chain_depth || 1}
                    </div>

                    <div className="hidden sm:flex sm:col-span-2 items-center text-[13px] text-[#5f6368] truncate">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />    
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Unknown'}
                    </div>

                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 pr-4">
                       <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200/60 text-green-700 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-sm">   
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
