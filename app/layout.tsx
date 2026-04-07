import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, DM_Sans, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eindev.ir'),
  title: {
    default: "ETCH — HUMAN AUTHORSHIP, ETCHED IN CODE",
    template: "%s | ETCH",
  },
  description:
    "etch is a cryptographic protocol that preserves and verifies human authorship in software. Sign your code. Prove you wrote it.",
  keywords: ["Software Engineering", "Web Development", "Next.js", "React", "TypeScript", "AI", "Machine Learning", "Systems Programming", "Code Experiments"],
  authors: [{ name: "Ehsan Ghaffar", url: "https://github.com/ehsanghaffar" }],
  creator: "Ehsan Ghaffar",
  publisher: "Ehsan Ghaffar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ETCH — HUMAN AUTHORSHIP, ETCHED IN CODE",
    description: "etch is a cryptographic protocol that preserves and verifies human authorship in software. Sign your code. Prove you wrote it.",
    siteName: "ETCH",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ETCH — HUMAN AUTHORSHIP, ETCHED IN CODE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ETCH — HUMAN AUTHORSHIP, ETCHED IN CODE",
    description: "etch is a cryptographic protocol that preserves and verifies human authorship in software. Sign your code. Prove you wrote it.",
    creator: "@ehsanghaffar",
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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
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
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
