"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion"
import { Loader2, ShieldCheck, Copy, Check, Terminal, Link as LinkIcon, Database, ArrowRight, Fingerprint, Activity, Clock, Shield, Cpu, Lock } from "lucide-react" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// New Cryptographic Pulse Component
function SignaturePulse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 rounded-full border border-indigo-200"
      />
      <motion.div
        animate={{
          scale: [1, 2, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="w-20 h-20 rounded-full border border-indigo-100"
      />
    </div>
  )
}

// New Hash Segment Visual
function HashSegment({ value }: { value: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-white transition-all p-4">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20" />
      <code className="text-xs font-mono text-slate-600 break-all leading-relaxed bg-transparent p-0 block relative z-10">
        {value}
      </code>
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-indigo-500/30"
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

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
          const matchingNodes = data.filter(d => d.chain_id === chainId)
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
    <main className="relative min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 font-sans text-slate-800">
      <Header />
      
      {/* Background technical accents - changed focus to Indigo */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-indigo-50/50 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-violet-50/30 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative pt-[72px] z-10 flex flex-col md:flex-row min-h-screen">
        
        {/* ==========================================
            LEFT SIDEBAR: Technical Profile
            ========================================== */}
        <aside className="w-full md:w-[320px] lg:w-[400px] shrink-0 bg-white border-r border-slate-100 p-8 md:sticky md:top-[72px] md:h-[calc(100vh-72px)] overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* Module Name & Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 shadow-sm">
                  Active Provenance
                </div>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <h1 className="text-3xl font-normal text-slate-900 mb-2 tracking-tight">
                {filename}
              </h1>
              <p className="text-sm font-mono text-slate-400 break-all leading-relaxed">
                {chainId}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="h-4 w-4 text-slate-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signatures</p>
                <p className="text-xl font-medium text-slate-900">{chainNodes.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Shield className="h-4 w-4 text-emerald-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trust Level</p>
                <p className="text-xl font-medium text-slate-900">Verified</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => copyToClipboard(chainId, 'chain-id')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all font-medium group"
              >
                <span className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 opacity-50 group-hover:opacity-100" /> Chain Identity
                </span>
                {copiedId === 'chain-id' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 opacity-30" />}
              </button>
              <a
                href={`/verify?chain_id=${latestNode?.chain_id}&head_hash=${latestNode?.head_hash}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-500/10 active:scale-95"
              >
                <ShieldCheck className="h-4 w-4" /> Run Protocol Validator
              </a>
            </div>

            {/* Dependency Graph Minimalist */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" /> Logical Pathing
                </h3>
                {dependencies?.depends_on && dependencies.depends_on.length > 0 ? (
                  <div className="space-y-3">
                    {dependencies.depends_on.map((dep, idx) => (
                      <a key={idx} href={`/registry/${dep}`} className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-40" />
                        <code className="text-xs font-mono text-slate-500 truncate flex-1">{dep}</code>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition-all" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic px-3">No identified upstream nodes</p>
                )}
              </div>
            </div>
          </motion.div>
        </aside>

        {/* ==========================================
            MAIN CONTENT: Technical Trace Timeline
            ========================================== */}
        <section ref={timelineRef} className="flex-1 p-8 md:p-16 lg:p-24 relative overflow-hidden">
          
          <div className="max-w-[700px] mx-auto relative">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-6 font-thin" />
                <p className="text-slate-400 font-mono text-xs tracking-widest uppercase text-center">Synchronizing Cryptographic Trace...</p>
              </div>
            ) : chainNodes.length === 0 ? (
              <div className="text-center py-24 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm">
                <Database className="h-12 w-12 mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-medium">Chain no longer exists or was never anchored.</p>
              </div>
            ) : (
              <>
                <div className="mb-20">
                  <div className="flex items-center gap-4 text-xs font-mono text-indigo-500 uppercase tracking-widest mb-6">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Bespoke Protocol Sequence
                  </div>
                  <h2 className="text-4xl font-normal text-slate-900 mb-6 tracking-tight leading-tight">
                    Proof <br/>
                    <span className="text-indigo-600">Authorship Stream</span>
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-light">
                    Every sequence below is rooted in an offline cryptographic assertion. The ETCH network validates stylistic invariants at the AST level to ensure high-entropy human logic.
                  </p>
                </div>

                {/* THE TRACE LINE - Updated to Indigo */}
                <div className="absolute top-[350px] bottom-0 left-0 w-px bg-gradient-to-b from-indigo-100 via-slate-100 to-transparent" />
                <motion.div
                  style={{ scaleY }}
                  className="absolute top-[350px] bottom-0 left-0 w-px bg-gradient-to-b from-indigo-500 to-violet-500 origin-top z-10 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                />

                <div className="space-y-32">
                  <AnimatePresence>
                    {chainNodes.map((node, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
                        className="relative pl-12 group"
                      >
                        {/* THE NODE INDICATOR */}
                        <div className="absolute -left-1.5 top-0 flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ring-white relative z-20 ${i === chainNodes.length - 1 ? 'bg-indigo-600' : 'bg-slate-200 transition-colors group-hover:bg-indigo-400'}`}>
                            {i === chainNodes.length - 1 && (
                              <div className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-30" />
                            )}
                          </div>
                        </div>

                        {/* CONTENT CARD */}
                        <div className="space-y-6">
                          {/* Header of node */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <Cpu className="h-3 w-3" />
                                Anchor Segment #{node.chain_depth || (i + 1)}
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                {node.created_at ? new Date(node.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                              </p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-indigo-50/50 border border-indigo-100 font-mono text-[10px] text-indigo-600 font-bold">
                              TX_{ (node.head_hash || '').substring(0, 8).toUpperCase() }
                            </div>
                          </div>

                          {/* Detail Card - Refactored to Indigo/Slate */}
                          <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:border-indigo-100 relative overflow-hidden group">
                            {/* Inner abstract accent */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-50/20 rounded-full blur-2xl group-hover:bg-indigo-50/40 transition-all" />

                            <div className="grid grid-cols-1 gap-8 items-start">
                              <div>
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Lock className="h-3.5 w-3.5 opacity-50" /> Cryptographic Signer
                                </h4>
                                
                                <HashSegment value={node.contributor_pubkey} />

                                <div className="mt-3 flex items-center gap-4">
                                  <button 
                                    onClick={() => copyToClipboard(node.contributor_pubkey, `pub-${i}`)}
                                    className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
                                  >
                                    {copiedId === `pub-${i}` ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                    {copiedId === `pub-${i}` ? 'Copied to Buffer' : 'Export Identity'}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4 border-t border-slate-50">
                                <div className="space-y-1">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Logic Entropy</p>
                                  <p className="text-xl font-normal text-slate-900">{node.logic_weight || '0.94'}<span className="text-sm text-slate-300 ml-1">v.1</span></p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Affinity</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl font-normal text-slate-900">Human</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  </div>
                                </div>
                                <div className="flex-1" />
                                <div className="relative">
                                  <SignaturePulse />
                                  <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-100">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Provenance Verified
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}


