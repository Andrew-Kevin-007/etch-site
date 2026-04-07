"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, ShieldCheck, Clock, FileKey, RefreshCw, FolderSearch, Star, Trash2, Shield, LayoutGrid, List, CheckSquare, Square, ChevronRight, GitMerge } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function RegistryPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [stats, setStats] = useState({
    totalModules: 0,
    totalContributors: 0,
    totalChains: 0
  })

  // Simulated row selection for visually matching Google Drive
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const toggleRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) newSelected.delete(index)
    else newSelected.add(index)
    setSelectedRows(newSelected)
  }

  const toggleAll = () => {
    if (selectedRows.size === filteredModules.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredModules.map((_, i) => i)))
    }
  }

  useEffect(() => {
    fetch("https://etch-server-production.up.railway.app/anchors")
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data)) {
          const uniqueContributors = new Set()
          let totalChainDepth = 0
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

          setModules(dedupedModules)
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
      <main className="relative min-h-screen flex flex-col bg-white selection:bg-blue-100">   
        {/* Fixed Header */}
        <div className="flex-shrink-0 z-50 bg-white">
           <Header />
        </div>
        
        {/* Workspace Container */}
        <div className="flex-1 flex overflow-hidden pt-20">
          
          {/* LEFT SIDEBAR (GOOGLE DRIVE STYLE) */}
          <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#f1f3f4] shrink-0 pt-4 pb-6">
             <div className="px-3 mb-6">
                <button className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all text-gray-700 font-medium text-[14px]">
                   <ShieldCheck className="h-5 w-5 text-blue-600" />
                   New Signature
                </button>
             </div>

             <nav className="flex-1 space-y-1">
                {/* Active Tab */}
                <div className="flex items-center gap-4 px-6 py-2.5 bg-[#e8f0fe] rounded-r-full text-[#1a73e8] font-medium text-[13px] mr-4 cursor-pointer">
                   <Shield className="h-[18px] w-[18px]" />
                   All Modules
                </div>
                
                {/* Inactive Tabs */}
                <div className="flex items-center gap-4 px-6 py-2.5 hover:bg-[#f5f5f5] rounded-r-full text-[#3c4043] font-medium text-[13px] mr-4 transition-colors cursor-pointer">
                   <FolderSearch className="h-[18px] w-[18px] text-[#5f6368]" />
                   My Contributions
                </div>
                
                <div className="flex items-center gap-4 px-6 py-2.5 hover:bg-[#f5f5f5] rounded-r-full text-[#3c4043] font-medium text-[13px] mr-4 transition-colors cursor-pointer">
                   <Star className="h-[18px] w-[18px] text-[#5f6368]" />
                   Starred
                </div>
                
                <div className="flex items-center gap-4 px-6 py-2.5 hover:bg-[#f5f5f5] rounded-r-full text-[#3c4043] font-medium text-[13px] mr-4 transition-colors cursor-pointer">
                   <Trash2 className="h-[18px] w-[18px] text-[#5f6368]" />
                   Trash
                </div>
             </nav>

             {/* Migrated Hero Stats as Storage Overview */}
             <div className="px-6 mt-10 space-y-4">
                <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Network Indices</h3>
                <div className="space-y-3">
                   <div>
                     <p className="flex justify-between items-center text-[13px] text-gray-700 mb-1">
                       <span>Total Modules</span>
                       <span className="font-mono text-gray-500">{loading ? "..." : stats.totalModules}</span>
                     </p>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[45%]" />
                     </div>
                   </div>
                   <div>
                     <p className="flex justify-between items-center text-[13px] text-gray-700 mb-1">
                       <span>Contributors</span>
                       <span className="font-mono text-gray-500">{loading ? "..." : stats.totalContributors}</span>
                     </p>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[25%]" />
                     </div>
                   </div>
                   <div>
                     <p className="flex justify-between items-center text-[13px] text-gray-700 mb-1">
                       <span>Chains Verified</span>
                       <span className="font-mono text-gray-500">{loading ? "..." : stats.totalChains}</span>
                     </p>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[85%]" />
                     </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* MAIN EXPLORER CONTENT */}
          <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
             
             {/* BREADCRUMB & ACTION BAR */}
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-white min-h-[64px]">
                
                {/* Breadcrumb Navigation */}
                <div className="flex items-center text-[18px] text-[#202124] mb-4 sm:mb-0">
                   <div className="font-normal truncate cursor-pointer hover:underline">Registry</div>
                   <ChevronRight className="h-4 w-4 mx-2 text-[#5f6368]" />
                   <div className="font-medium truncate border-b border-transparent">All Modules</div>
                </div>

                {/* Explorer Action Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   
                   {/* Pill Search */}
                   <div className="relative w-full sm:w-64 md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5f6368]" />
                      <input
                        type="text"
                        placeholder="Search in Registry"     
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#f1f3f4] text-[#202124] px-10 py-2.5 rounded-full text-[14px] focus:bg-white focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] focus:outline-none transition-all placeholder:text-[#5f6368]"
                      />
                   </div>

                   {/* Toggle Actions */}
                   <div className="hidden sm:flex items-center">
                     <button className="p-2.5 rounded-full hover:bg-[#f5f5f5] text-[#5f6368] transition-colors" title="List View">
                        <List className="h-[20px] w-[20px]" />
                     </button>
                     <button className="p-2.5 rounded-full hover:bg-[#f5f5f5] text-[#5f6368] transition-colors" title="Grid View">
                        <LayoutGrid className="h-[20px] w-[20px]" />
                     </button>
                     <button className="p-2.5 rounded-full hover:bg-[#f5f5f5] text-[#5f6368] transition-colors ml-1" title="Refresh data">
                        <RefreshCw className="h-[18px] w-[18px]" />
                     </button>
                   </div>
                </div>
             </div>

             {/* DATA TABLE AREA */}
             <div className="flex-1 overflow-y-auto w-full pb-10 custom-scrollbar">
                
                {search.trim().length > 0 && search.trim().length < 2 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-[#5f6368]">
                    <Search className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="font-medium text-[14px]">Type more characters to filter...</p>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center py-32 text-blue-600 bg-white">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#1a73e8]" />
                  </div>
                ) : filteredModules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white">
                    <FolderSearch className="h-16 w-16 text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium text-[14px]">No modules match your query.</p>
                  </div>
                ) : (
                  <div className="min-w-[800px] w-full">
                    {/* Header Row */}
                    <div className="flex items-center px-6 py-2.5 border-b border-[#dadce0] text-[12px] font-semibold text-[#5f6368] tracking-wider sticky top-0 bg-white z-10 transition-colors">
                      <div className="w-12 shrink-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1.5 rounded-full transition-colors" onClick={toggleAll}>
                         {selectedRows.size === filteredModules.length && filteredModules.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-[#1a73e8]" />
                         ) : (
                            <Square className="h-4 w-4 text-gray-300 hover:text-gray-400" />
                         )}
                      </div>
                      <div className="w-[35%] lg:w-[40%] pl-2 uppercase">Name</div>
                      <div className="w-[25%] uppercase">Signer PublicKey</div>   
                      <div className="w-[15%] text-center uppercase">Depth</div>
                      <div className="flex-1 text-right pr-4 uppercase">Last Modified</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col">
                      {filteredModules.map((m, i) => {
                        const isSelected = selectedRows.has(i);
                        return (
                        <div key={i} className="flex relative">
                           {/* Clickable Row background */}
                           <Link
                             href={`/registry/${m.chain_id || ''}`}
                             className={`absolute inset-0 z-0 ${isSelected ? 'bg-[#e8f0fe] hover:bg-[#e8f0fe]' : 'hover:bg-[#f5f5f5]'} transition-colors border-b border-[#f1f3f4] last:border-none`}
                           />
                           
                           {/* Content Layer (on top of link) */}
                           <div className="flex items-center w-full px-6 py-2 z-10 pointer-events-none">
                              
                              <div className="w-12 shrink-0 flex items-center justify-center pointer-events-auto">
                                <div onClick={(e) => { e.preventDefault(); toggleRow(i); }} className="cursor-pointer hover:bg-gray-200/50 p-1.5 rounded-full transition-colors">
                                   {isSelected ? (
                                      <CheckSquare className="h-[18px] w-[18px] text-[#1a73e8]" />
                                   ) : (
                                      <Square className="h-[18px] w-[18px] text-gray-300 group-hover:text-gray-400" />
                                   )}
                                </div>
                              </div>
                              
                              <div className="w-[35%] lg:w-[40%] pl-2 flex items-center gap-3">
                                <div className={`${isSelected ? 'text-[#1a73e8]' : 'text-[#8ab4f8]'} transition-colors shrink-0`}>
                                   <FileKey className="h-5 w-5 fill-current opacity-20" />
                                </div>
                                <span className={`font-mono text-[13px] ${isSelected ? 'text-[#1a73e8] font-bold' : 'text-[#202124] font-medium'} truncate transition-colors`} title={m.file_path}>
                                  {m.file_path ? m.file_path.split(/[/\\]/).pop() : 'Unknown'}
                                </span>
                              </div>

                              <div className="w-[25%] flex items-center">        
                                 <code className={`px-2 py-0.5 rounded text-[12px] font-mono border transition-colors truncate ${isSelected ? 'bg-white border-[#1a73e8]/30 text-[#1a73e8]' : 'bg-[#f8f9fa] border-gray-200 text-[#5f6368]'}`} title={m.contributor_pubkey}>
                                    {m.contributor_pubkey ? m.contributor_pubkey.substring(0, 10) + '...' : 'Unknown'}
                                 </code>
                              </div>

                              <div className={`w-[15%] flex flex-row items-center justify-center font-mono text-[13px] ${isSelected ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>     
                                <GitMerge className={`h-3.5 w-3.5 mr-1.5 ${isSelected ? 'text-[#1a73e8]' : 'text-gray-400'}`} /> 
                                {m.chain_depth || 1}
                              </div>

                              <div className={`flex-1 flex items-center justify-end text-[13px] truncate pr-4 ${isSelected ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>
                                {m.created_at ? new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                              </div>
                           </div>
                        </div>
                        )
                      })}
                    </div>
                  </div>
                )}
             </div>

          </section>
        </div>
      </main>

      {/* Global Custom Scrollbar Styles for the Table Area */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}} />
    </>
  )
}
