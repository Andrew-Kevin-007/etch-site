# Registry Page Refactoring Plan

Based on my analysis of `app/registry/page.tsx` and the current state of the application, the `/registry` page currently sits as a legacy component utilizing the old "Cyberpunk/Hacker" dark theme. 

## Current Insights & Problems

1. **Massive Theme Mismatch:** The registry page relies heavily on deep black backgrounds (`#0a0a0a`, `#111`), glowing neon green outlines (`#00ff9d`), and raw monospace typography. It severely breaks visual continuity with our refined "Google Docs" white-theme layout.
2. **Missing Brand Mechanics:** It lacks the frosted glassmorphism elements, the sleek "Google Sans" typography, and the soft blue (`#e8f0fe` / `#1a73e8`) highlight palette established across the rest of the site.
3. **Data Grid Display:** The live-fetched cryptographic modules display cleanly, but they are rendered in a high-contrast dark table instead of a sleek, white Google-Cloud style console dashboard.

## Proposed Layout Redesign

The objective is to pivot the registry into feeling like a **Google Cloud Developer Console** or **Google Drive** file explorer. 

### 1. Structure & Layout
- Change the root container to a spacious, white edge-to-edge frame (`bg-gray-50/30` or `bg-white`).
- Constrain the maximum width naturally with generous horizontal padding, switching the grid lines to subtle light grays (`border-gray-200`).

### 2. The Hero / Dashboard Header
- Remove neon borders on the statistic cards (Modules, Contributors, Chains). 
- Introduce a clean, minimal "white card" layout for these stats—potentially with ultra-subtle box-shadows or left-aligned border highlights to designate important metrics.
- Soften the "Search" bar out of its neon state into a clean, pill-shaped Google Drive-style input (`bg-gray-100`, soft hover shadow).

### 3. The Explorer Grid
- Shift the actual `filteredModules` mapping from a black/neon table into a **material-design data table**.
- Author PubKeys and File Paths will drop their raw monospace neon tags and adopt clean, pill-shaped `<code/>` or badge structures (`bg-gray-100 text-gray-800`).
- The "VERIFIED" tags will map to Google-style Success pills (soft green background, darker green text).

## User Feedback Required

> [!IMPORTANT]  
> Before I begin executing this redesign, I want to confirm: Would you like the Registry module list to look like a standard **Google Cloud Console Data Table** (clean rows, distinct header, minimalist separation lines)? And should we apply glassmorphism to the search bar like we did on the homepage CTA?
