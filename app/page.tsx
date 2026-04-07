"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCinematic } from "@/components/hero-cinematic"
import { FeatureIconsRow } from "@/components/feature-icons-row"
import { ProductShowcase } from "@/components/product-showcase"
import { CryptoCoreCard } from "@/components/crypto-core-card"
import { ProtocolStepsCard } from "@/components/protocol-steps-card"
import { OpenSourceSection } from "@/components/open-source-section"
import { TiersSection } from "@/components/tiers-section"

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#ffffff" }}>
      <Header />

      {/* 1 · Hero — Cinematic dark background with GSAP SplitText, particle ring, Lenis smooth scroll */}
      <HeroCinematic />

      {/* 2 · Feature Icons Row — wavy horizontal icon strip */}
      <FeatureIconsRow />

      {/* 3 · Product Showcase — black section with colored etch dot-logo */}
      <ProductShowcase />

      {/* 4 · Cryptographic Core — card with terminal mockup */}
      <CryptoCoreCard />

      {/* 5 · Protocol Steps — "Three Commands. Permanent Proof." */}
      <ProtocolStepsCard />

      {/* 6 · Open Source First — 2-col layout with registry card */}
      <OpenSourceSection />

      {/* 7 · Tiers — dot-grid bg, For developers / For open source */}
      <TiersSection />

      {/* 8 · Footer — large wordmark + nav columns */}
      <Footer />
    </div>
  )
}
