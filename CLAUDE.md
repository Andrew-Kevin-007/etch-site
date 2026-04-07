# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**ETCH** is a cryptographic protocol landing page and digital portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The project demonstrates modern web technologies with an interactive particle system and serves as a showcase for the "etch" code signing protocol concept.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (localhost:3000)
pnpm dev -- -p 3001   # Start on different port
pnpm build            # Production build
pnpm start            # Serve production build
pnpm lint             # Run ESLint
pnpm lint --fix       # Fix auto-fixable ESLint issues
pnpm analyze          # Analyze bundle with Next.js experimental analyze
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.2.2 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.9.3
- **Styling**: Tailwind CSS v4.1.9 (CSS-first, no tailwind.config.js)
- **UI Primitives**: Radix UI (full component library)
- **Animations**: Framer Motion 12.38.0
- **3D/Particles**: Three.js 0.183.2 + React Three Fiber 9.5.0 + Postprocessing
- **Theme**: next-themes 0.4.6 (light mode forced, storage key: `theme-mode`)
- **Icons**: Lucide React 0.454.0
- **Package Manager**: pnpm

### Fonts
- **Primary**: DM Sans (variable font with weights 300-800)
- **Secondary**: Geist + Geist Mono
- **Display**: Space Grotesk

### Project Structure

```
app/                          # Next.js App Router pages (server components by default)
├── layout.tsx                # Root layout: fonts, metadata, ThemeProvider (FORCED LIGHT MODE)
├── page.tsx                  # Homepage with 8 section components
├── globals.css               # Tailwind v4 config + design tokens + animations
├── error.tsx                 # Global error boundary
├── not-found.tsx             # 404 page
├── robots.ts                 # SEO robots config
├── sitemap.ts                # SEO sitemap config
├── registry/                 # Registry pages
│   └── [chain_id]/
├── verify/                   # Verification page
├── protocol/                 # Documentation page
└── (public)/                 # Route group with shared layout
    ├── layout.tsx            # Public layout with Header, Footer, CursorGlow, scanlines
    ├── blog/                 # Blog routes with loading states
    ├── projects/             # Projects showcase
    ├── workbench/            # Workbench/experiments
    ├── notes/                # Notes section
    └── introduction/         # Introduction page

components/                   # Reusable UI components
├── header.tsx                # Fixed navigation with scroll effect
├── footer.tsx                # Multi-column footer with large wordmark
├── cursor-glow.tsx           # Custom cursor glow effect (client)
├── hero-section.tsx          # Hero with Antigravity particles + typing code
├── feature-icons-row.tsx     # Wavy horizontal icon strip
├── product-showcase.tsx      # Black section with colored dot-logo
├── crypto-core-card.tsx      # Terminal mockup card
├── protocol-steps-card.tsx   # "Three Commands. Permanent Proof." section
├── open-source-section.tsx   # 2-col layout with registry card
├── tiers-section.tsx         # Dot-grid bg pricing tiers
├── lab-notes.tsx             # Lab notes component
├── projects-grid.tsx         # Projects grid display
├── workbench.tsx             # Workbench component
├── theme-*.tsx               # Theme components (changer, provider, toggle)
├── public/                   # Page-specific components
│   ├── blog/                 # Blog hero, list, post content, sidebar
│   ├── projects/
│   ├── workbench/
│   └── notes/
└── ui/                       # Base UI primitives
    ├── antigravity.tsx       # WebGL particle system (Three.js)
    ├── avatar.tsx
    ├── button.tsx
    └── input.tsx

lib/                          # Utilities and data
├── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── themes.ts                 # Theme configurations (golden, cyan, purple, emerald, rose)
├── blog-data.tsx             # Source of truth for blog content
└── structured-data.ts        # SEO structured data

public/                       # Static assets
├── *.png, *.svg              # Icons, images, OG images
├── site.webmanifest          # PWA manifest
└── og-images/                # Social share images
```

### Key Conventions

1. **Server-First by Default**: Next.js App Router uses server components by default. Add `"use client"` only when using hooks, browser APIs, or interactivity.

2. **Styling**:
   - Design tokens defined in `app/globals.css` using `@theme inline` and CSS custom properties
   - No `tailwind.config.js` - configuration lives in CSS with Tailwind v4
   - Primary colors: Emerald green (`oklch(0.5 0.22 170)` light, `oklch(0.72 0.2 170)` dark)
   - Custom utilities: `.dot-grid`, `.pill-btn-*`, `.cursor-glow`, `.glass`, `.hover-lift`
   - Use `cn()` from `lib/utils.ts` to compose class names

3. **Theme System**:
   - Forced light mode: `defaultTheme="light"`, `enableSystem={false}`, `forcedTheme="light"`
   - Theme variants stored in `lib/themes.ts`: golden, cyan, purple, emerald, rose
   - Storage key: `theme-mode`

4. **Data Flow**:
   ```
   Static Data (lib/blog-data.tsx)
       ↓
   Route Component (app/)
       ↓
   Page-Specific Component (components/public/)
       ↓
   Base UI Component (components/ui/)
   ```

5. **Blog Content**: All blog posts stored in `lib/blog-data.tsx`. Adding/editing posts here updates `/blog` pages directly. Each post has: slug, title, excerpt, content (markdown), date, readTime, category, tags, author, featured flag, color gradient.

## Configuration Notes

### next.config.mjs
```javascript
{
  typescript: {
    ignoreBuildErrors: true,  // Build succeeds despite TS errors
  },
  images: {
    unoptimized: true,      // No Image Optimization API
  },
}
```

### Tailwind CSS v4 Setup
- PostCSS config: `@tailwindcss/postcss` plugin
- No `tailwind.config.js` - all config in `globals.css`
- Uses `@import "tailwindcss"` and `@theme inline` for custom tokens
- Custom animations: fade-in-up, fade-in-down, scale-in, slide-in, float, pulse-glow, shimmer

### TypeScript
- Target: ES6
- Module: ESNext with Bundler resolution
- Strict mode enabled
- Path alias: `@/*` maps to `./*`

## Important Components

### Antigravity Particle System
Location: `components/ui/antigravity.tsx`
- WebGL-based particle system using Three.js + React Three Fiber
- Interactive repulsion effect on mouse hover
- Custom shaders for gradient capsules with bloom
- Props: count, magnetRadius, ringRadius, waveSpeed, colorGradient, etc.
- Used in HeroSection with Google-inspired colors

### Hero Section
Location: `components/hero-section.tsx`
- Light blue gradient background (`#f0f4ff` to `#f5f0ff`)
- Animated headline with Framer Motion
- Typing code snippet effect: "cargo install etch"
- Copy-to-clipboard functionality
- Scroll indicator at bottom

### Header
Location: `components/header.tsx`
- Fixed position with backdrop blur on scroll
- Transparent → White transition when scrolled
- Navigation: Registry, Verify, Docs
- "Install" CTA button

## Design System

### Colors (Light Mode - Default)
- Background: `#f0f4ff` (light blue) / `oklch(0.985 0.002 260)`
- Foreground: `#1a1a1a` / `oklch(0.12 0.015 260)`
- Primary: Emerald green `oklch(0.5 0.22 170)`
- Muted text: `#5f6368`
- Borders: `rgba(0,0,0,0.08)`

### Typography
- Headlines: DM Sans, bold, tight tracking (`tracking-tight`)
- Body: DM Sans with relaxed leading
- Monospace: Geist Mono

### Effects
- **Cursor Glow**: Radial gradient follows mouse (400px diameter)
- **Scanlines**: Subtle overlay effect on public pages
- **Glass**: Backdrop blur with semi-transparent backgrounds
- **Hover Lift**: Cards lift on hover with shadow

## Development Workflow

1. Make changes to components or add new pages under `app/(public)/`
2. Run `pnpm lint` to check for issues
3. Run `pnpm dev` and verify changes in browser
4. For styling changes, prefer edits in `app/globals.css` over inline styles

## SEO & Metadata

- Base URL: `https://eindev.ir` (or `NEXT_PUBLIC_SITE_URL` env var)
- Title template: `%s | ETCH`
- OG images: `/og-image.png` (1200x630)
- Icons: Light/dark variants with SVG fallback
- Structured data in `lib/structured-data.ts`

## Dependencies to Know

**Animation**: Framer Motion for React animations, GSAP-like capabilities
**3D**: Three.js + React Three Fiber + Postprocessing for particle effects
**Forms**: React Hook Form + Zod for validation
**Charts**: Recharts for data visualization
**Carousel**: Embla Carousel
**Date**: date-fns for date formatting
**CLI**: cmdk for command palette UI

## File Locations

- `app/layout.tsx` - Global layout, fonts, metadata, theme provider (FORCED LIGHT)
- `app/globals.css` - Design tokens, Tailwind config, animations
- `components/header.tsx` - Main navigation
- `components/hero-section.tsx` - Hero with particles
- `lib/blog-data.tsx` - Blog content source
- `lib/utils.ts` - `cn()` utility
- `next.config.mjs` - Build configuration
