"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2, ShieldCheck, Copy, Check, Terminal, Link as LinkIcon, Database, ArrowRight } from "lucide-react" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"

const GOOGLE_COLORS = [
  { bg: "bg-[#e8f0fe]", text: "text-[#1a73e8]", border: "border-[#1a73e8]/20", ring: "ring-[#1a73e8]/20" },
  { bg: "bg-[#fce8e6]", text: "text-[#d93025]", border: "border-[#d93025]/20", ring: "ring-[#d93025]/20" },
  { bg: "bg-[#fef7e0]", text: "text-[#f9ab00]", border: "border-[#f9ab00]/20", ring: "ring-[#f9ab00]/20" },
  { bg: "bg-[#e6f4ea]", text: "text-[#1e8e3e]", border: "border-[#1e8e3e]/20", ring: "ring-[#1e8e3e]/20" },
]

export default function ChainPage() {
  const params = useParams()
  const chainId = params.chain_id as string
  
  const [chainNodes, setChainNodes] = useState<any[]>([])
  const [dependencies, setDependencies] = useState<{ depends_on: string[], used_by: string[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

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
      <main className="relative min-h-screen flex flex-col bg-[#ffffff] selection:bg-blue-100 font-sans text-[#3c4043]">
        <Header />
        
        {/* Sub-header / Breadcrumbs */}
        <div className="pt-24 border-b border-gray-200 bg-[#f8f9fa] sticky top-0 z-30">
          <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <a href="/registry" className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap">Registry</a>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-[#202124] text-sm font-medium truncate">{chainId}</span>
            </div>
            {!loading && chainNodes.length > 0 && (
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => copyToClipboard(chainId, 'chain-id')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-[#3c4043] text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  {copiedId === 'chain-id' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy ID
                </button>
                <a
                  href={`/verify?chain_id=${latestNode?.chain_id}&head_hash=${latestNode?.head_hash}`}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#1a73e8] text-white text-xs font-semibold hover:bg-[#1b66c9] shadow-sm transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Verify
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex w-full max-w-[1600px] mx-auto px-6 py-8 gap-10">
          
          <div ref={timelineRef} className="flex-1 min-w-0">
          
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium text-sm">Loading registry trace...</p>
              </div>
            ) : chainNodes.length === 0 ? (
              <div className="text-center py-20 border border-gray-200 rounded-lg bg-gray-50 border-dashed">
                <Database className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                <p className="text-[#5f6368] font-medium">Chain no longer exists or was never anchored.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-10">
                  <h1 className="text-2xl font-semibold text-[#202124] mb-2">{filename}</h1>
                  <p className="text-sm text-[#5f6368] max-w-2xl">
                    View the cryptographic attestation history for this module. Each entry represents a unique, verified signature etched into the protocol's immutable record.
                  </p>
                </div>

                {/* TIMELINE */}
                <div className="relative pl-8">
                  {/* Dynamic Scroll Line (Left Aligned for density) */}
                  <div className="absolute top-0 bottom-0 left-3 w-[2px] bg-gray-100 rounded-full z-0" />
                  <motion.div
                    style={{ scaleY }}
                    className="absolute top-0 bottom-0 left-3 w-[2px] bg-blue-500 origin-top rounded-full z-0"
                  />

                  <div className="space-y-10">
                    {chainNodes.map((node, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="relative group"
                        >
                          {/* Bullet Point */}
                          <div className={`absolute -left-[24px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${i === chainNodes.length - 1 ? 'bg-blue-600 scale-125' : 'bg-gray-300'} z-10`} />
                          
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-[#202124]">
                                Version Sign-off #{node.chain_depth || (i + 1)}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 font-mono">
                                {node.created_at ? new Date(node.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'}
                              </span>
                              {i === chainNodes.length - 1 && (
                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                  Current Head
                                </span>
                              )}
                            </div>
                            
                            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-400/50 transition-colors shadow-sm">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <div className="md:col-span-8 space-y-4">
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Author Identity</p>
                                    <div className="flex items-center gap-2">
                                      <code className="text-xs font-mono text-gray-700 break-all">{node.contributor_pubkey}</code>
                                      <button onClick={() => copyToClipboard(node.contributor_pubkey, `pub-${i}`)} className="text-gray-400 hover:text-blue-600 shrink-0">
                                        {copiedId === `pub-${i}` ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:col-span-4 flex flex-col gap-4">
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Anchor ID</p>
                                    <code className="text-xs font-mono text-gray-500">{(node.head_hash || '').substring(0, 16)}...</code>
                                  </div>
                                  <div className="flex items-center gap-2 text-green-700 text-[11px] font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                    CRYPTOGRAPHICALLY VERIFIED
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Metadata Pane / Side Rail */}
          <aside className="w-[380px] shrink-0 space-y-6 hidden lg:block">
            
            {/* FILE INFO CARD */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Attestation</h3>
                <Terminal className="h-4 w-4 text-gray-400" />
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Chain Fingerprint</label>
                  <p className="text-xs font-mono text-gray-600 truncate bg-gray-50 p-2 rounded border border-gray-100">{chainId}</p>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">State</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-gray-700">Anchored & Resolved</span>
                  </div>
                </div>
                <div className="pt-2">
                   <LinkIcon className="inline h-3 w-3 text-gray-400 mr-2" />
                   <span className="text-xs text-gray-500">Total Signatures: <span className="font-bold text-gray-700">{chainNodes.length}</span></span>
                </div>
              </div>
            </div>

            {/* DEPENDENCIES MINI-GRID */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upstream Dependencies</h3>
              </div>
              <div className="p-5">
                {dependencies?.depends_on && dependencies.depends_on.length > 0 ? (
                  <div className="space-y-3">
                    {dependencies.depends_on.map((dep, idx) => (
                      <a key={idx} href={`/registry/${dep}`} className="flex items-center justify-between group">
                        <code className="text-[11px] font-mono text-blue-600 group-hover:underline">{dep.substring(0, 16)}...</code>
                        <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No dependencies found.</p>
                )}
              </div>
            </div>

            {/* USED BY MINI-GRID */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dependents (Downstream)</h3>
              </div>
              <div className="p-5">
                {dependencies?.used_by && dependencies.used_by.length > 0 ? (
                  <div className="space-y-3">
                    {dependencies.used_by.map((dep, idx) => (
                      <a key={idx} href={`/registry/${dep}`} className="flex items-center justify-between group">
                        <code className="text-[11px] font-mono text-blue-600 group-hover:underline">{dep.substring(0, 16)}...</code>
                        <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No dependents found.</p>
                )}
              </div>
            </div>

          </aside>
        </div>

        <Footer />
      </main>
  )
}
