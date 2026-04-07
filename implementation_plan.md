# Refactor Protocol Docs Page for Light Theme Brand

The goal is to transform the `/protocol` page from its current dark, "hacker-themed" neon aesthetic into a premium, clean, Google-inspired documentation layout that seamlessly matches the new homepage brand.

## User Review Required

> [!IMPORTANT]
> The current page operates as a single long-scrolling document. To make it feel like a "real docs page", I am proposing a **two-column layout** featuring a sticky sidebar on the left and content on the right, which is the industry standard for technical documentation (similar to Google Cloud or Vercel docs). Please confirm if you are happy with introducing a sidebar layout for this page.

## Proposed Changes

### `app/protocol/page.tsx`

We will completely rewrite this file with the following updates:

#### [MODIFY] `app/protocol/page.tsx`
- **Theme & Colors:** Change `bg-[#0a0a0a]` to `bg-white`. Update all text colors from white/neon green to high-contrast `#202124` for headings and `#5F6368` for body text.
- **Layout:** Implement a `grid-cols-1` md:`grid-cols-4` layout with a sticky left sidebar for quick navigation (Overview, Standards, Threat Model).
- **Typography:** Remove all uppercase hacker monospace fonts from headings. Use clean, `tracking-tight` sans-serif fonts for headings and highly readable fonts for paragraphs.
- **Components to Remove:** `<CursorGlow />` will be deleted from this page.
- **Styling Details:** 
  - Convert the "AI CANNOT SIGN" banner from a giant neon block into a sophisticated, modern "Alert / Note" callout block using a soft red or yellow border.
  - Convert lists and bullet points into highly structured documentation cards or standard tech-doc bulleting.
  - Update the "Explore Registry" button to match the primary pill-shaped black CTA button implemented in the hero section.

## Open Questions

- Should we split the docs into multiple files/routes, or keep it as a single page with jump links in the sidebar? (I will assume a single page with jump links for now to keep the scope focused on UI refactoring, unless you specify otherwise).

## Verification Plan

- Check the `/protocol` page in the browser to ensure no dark mode remnants exist.
- Verify the sticky sidebar behaves correctly on scroll.
- Ensure mobile responsiveness (collapsing the sidebar on small screens).
