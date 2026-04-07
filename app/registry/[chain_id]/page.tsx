"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2, ShieldCheck, Copy, Check, Terminal, Link as LinkIcon, Database, ArrowRight } from "lucide-react" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

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
      <main className="relative min-h-screen flex flex-col bg-[#f8f9fa] selection:bg-blue-100">
        <Header />
        
        <div className="flex-1 max-w-5xl w-full mx-auto px-6 sm:px-8 pt-36 pb-24">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-blue-600 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-gray-500 font-medium text-sm">Querying distributed anchors...</p>
            </div>
          ) : chainNodes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border border-gray-200 rounded-2xl bg-white shadow-sm border-dashed"
            >
              <Database className="h-10 w-10 mx-auto text-gray-300 mb-4" />
              <p className="text-[#5f6368] font-medium">Chain not found in registry.</p>
            </motion.div>
          ) : (
            <>
              {/* Header Title Section */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-14 border-b border-gray-200 pb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold tracking-wider font-mono">
                    CHAIN ID
                  </span>
                  <span className="text-gray-500 font-mono text-sm truncate max-w-sm">
                    {chainId}
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-[#202124] mb-3 truncate" title={filename}>
                  {filename}
                </h1>
                <p className="text-[#5f6368] text-base">
                  Action trace log representing the cryptographically verified authorship history of this module.
                </p>
              </motion.div>

              {/* TIMELINE (Google Cloud Trace Style) */}
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
                {chainNodes.map((node, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    
                    {/* Center Node Avatar */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#f8f9fa] bg-blue-50 text-blue-600 font-mono text-sm font-semibold shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                      {node.chain_depth || (i + 1)}
                    </div>
                    
                    {/* Log Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md relative group">
                      
                      {/* Active Node Indicator Overlay */}
                      {i === chainNodes.length - 1 && (
                        <div className="absolute -top-3 left-6 sm:left-auto sm:right-6 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm text-[10px] text-gray-500 whitespace-nowrap font-semibold uppercase tracking-wider">
                          Latest Signature
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                        <span className="font-mono text-[13px] text-gray-500 font-medium">
                          {node.created_at ? new Date(node.created_at).toLocaleString() : 'Unknown Time'}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200/60 text-green-700 text-[11px] font-semibold tracking-wide whitespace-nowrap">
                          <ShieldCheck className="h-3 w-3" /> VERIFIED
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-sm break-all">
                        <div>
                          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Signer Identity</p>
                          <code className="bg-[#f1f3f4] text-[#3c4043] px-2 py-1 rounded text-xs font-mono border border-gray-200/60 inline-block font-medium">
                            {node.contributor_pubkey}
                          </code>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">File Hash</p>
                            <code className="text-gray-700 text-xs font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200/40 inline-block">
                              {(node.head_hash || '').substring(0, 16)}...
                            </code>
                          </div>
                          <div>
                            <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Prev Hash</p>
                            <code className="text-gray-500 text-xs font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200/40 inline-block">
                              {(node.prev_hash || 'genesis_block_00').substring(0, 16)}...
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CHAIN HEAD HASH BANNER */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: chainNodes.length * 0.1 }}
                className="mt-20 p-6 sm:p-8 rounded-2xl border border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="w-full sm:w-auto overflow-hidden">
                  <p className="text-blue-800 text-[11px] font-semibold uppercase tracking-wider mb-2">Primary Chain Head Hash</p>
                  <code className="text-[#3c4043] font-mono text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg truncate block sm:max-w-md shadow-sm" title={latestNode.head_hash}>
                    {latestNode.head_hash}
                  </code>
                </div>
                <button 
                  onClick={() => copyToClipboard(latestNode.head_hash, 'head-hash')}
                  className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-blue-200 text-blue-700 font-semibold text-[13px] bg-white hover:bg-blue-50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 w-full sm:w-auto outline-none shadow-sm"
                >
                  {copiedId === 'head-hash' ? (
                    <><Check className="h-4 w-4" /> COPIED</>
                  ) : (
                    <><Copy className="h-4 w-4" /> COPY HASH</>
                  )}
                </button>
              </motion.div>
              
              {/* PRIMARY CTA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (chainNodes.length * 0.1) + 0.1 }}
                className="mt-12 flex justify-center"
              >
                <a
                  href={`/verify?chain_id=${latestNode.chain_id}&head_hash=${latestNode.head_hash}`}
                  className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[14px] text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(26,115,232,0.39)] hover:shadow-[0_6px_20px_rgba(26,115,232,0.23)]"
                >
                  <ShieldCheck className="h-4 w-4" /> VERIFY CHAIN INTEGRITY
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform ml-1" />
                </a>
              </motion.div>

              {/* DEPENDENCIES GRID */}
              {dependencies && (
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Depends On */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-[15px] font-semibold text-[#202124] mb-5 border-b border-gray-200 pb-3 flex items-center gap-2 uppercase tracking-wide">
                      <Database className="h-4 w-4 text-gray-400" /> Depends On
                    </h2>
                    {dependencies.depends_on && dependencies.depends_on.length > 0 ? (
                      <div className="space-y-3">
                        {dependencies.depends_on.map((dep, idx) => (
                          <a key={`dep-${idx}`} href={`/registry/${dep}`} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group cursor-pointer">
                            <code className="font-mono text-sm text-gray-600 px-2 py-0.5 rounded bg-gray-100 group-hover:bg-white border border-gray-200/50 transition-colors">
                              {dep.substring(0, 16)}...
                            </code>
                            <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl border border-gray-200 border-dashed bg-white text-center shadow-sm">
                        <p className="text-gray-400 font-medium text-sm">No upstream dependencies</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Used By */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h2 className="text-[15px] font-semibold text-[#202124] mb-5 border-b border-gray-200 pb-3 flex items-center gap-2 uppercase tracking-wide">
                      <LinkIcon className="h-4 w-4 text-gray-400" /> Used By
                    </h2>
                    {dependencies.used_by && dependencies.used_by.length > 0 ? (
                      <div className="space-y-3">
                        {dependencies.used_by.map((dep, idx) => (
                          <a key={`used-${idx}`} href={`/registry/${dep}`} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group cursor-pointer">
                            <code className="font-mono text-sm text-gray-600 px-2 py-0.5 rounded bg-gray-100 group-hover:bg-white border border-gray-200/50 transition-colors">
                              {dep.substring(0, 16)}...
                            </code>
                            <LinkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl border border-gray-200 border-dashed bg-white text-center shadow-sm">
                        <p className="text-gray-400 font-medium text-sm">No downstream dependents</p>
                      </div>
                    )}
                  </motion.div>
                  
                </div>
              )}

            </>
          )}
          
        </div>
        <Footer />
      </main>
    </>
  )
}
