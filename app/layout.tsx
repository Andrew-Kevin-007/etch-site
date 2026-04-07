import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, DM_Sans, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

// Configure fonts with proper options
const geist = Geist({
  subsets: ["latin"],
  variable: '--font-geist',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
})
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://etch.so'),
  title: {
    default: "ETCH | Cryptographic Authorship Attribution & Provenance",
    template: "%s | ETCH Protocol",
  },
  description:
    "ETCH is a high-performance cryptographic protocol for verifiable human authorship in software development. Secure your code provenance against AI-generated noise.",
  keywords: [
    "ETCH Protocol", 
    "Code Authorship", 
    "Software Provenance", 
    "Cryptographic Attribution", 
    "Verifiable Software", 
    "Human-Centric Development", 
    "AST Analysis", 
    "Merkle Proofs", 
    "Developer Authentication",
    "Source Code Security"
  ],
  authors: [{ name: "ETCH Core Team", url: "https://etch.so" }],
  creator: "ETCH Protocol",
  publisher: "ETCH Protocol",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ETCH | Cryptographic Authorship Attribution",
    description: "Verifiable human authorship for the modern software era. Sign, verify, and trace your code's origin with cryptographic certainty.",
    siteName: "ETCH",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ETCH — Cryptographic Authorship Attribution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ETCH | Cryptographic Authorship Attribution",
    description: "Verifiable human authorship etched in code. The standard for protocol-level developer attribution.",
    creator: "@etch_protocol",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme-mode">
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
