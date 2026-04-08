# Bug Fixes and Codebase Analysis

Our analysis of the codebase reveals that while the core application statically complies and builds appropriately (zero TypeScript errors in `npm run build`), there are lingering project bugs with linting configuration as well as a large amount of unused code and dependencies. 

Here is the proposed plan to resolve these issues and clean up the dead code. 

## Proposed Changes

### 1. Fix Linting Configuration Bugs
The original `npm run lint` script failed due to ESLint's missing configuration and the `eslint` unassigned command.
- **[MODIFY]** `package.json`: Set the `lint` command to run `eslint "app/**/*.{ts,tsx}" "components/**/*.{ts,tsx}"` to bypass default `next lint` directory bugs present with Next.js 16 flat-config configurations.
- **[NEW]** `eslint.config.mjs`: Provide a modern flat-config to execute core Next.js web application linting properly without errors.

### 2. Remove Unused Components and Dead Code
Based on a codebase-wide analysis via `knip` static analyzer, several top-level files and UI components are entirely disconnected from the active rendering tree. Removing these resolves tech debt.

- **[DELETE]** `components/hero-section.tsx`
- **[DELETE]** `components/lab-notes.tsx`
- **[DELETE]** `components/projects-grid.tsx`
- **[DELETE]** `components/theme-changer.tsx`
- **[DELETE]** `components/theme-toggle.tsx`
- **[DELETE]** `components/workbench.tsx`
- **[DELETE]** `lib/themes.ts`
- **[DELETE]** `components/ui/antigravity.tsx`
- **[DELETE]** `components/ui/demo.tsx`
- **[DELETE]** `components/ui/hero-futuristic.tsx`

> [!WARNING]
> `styles/globals.css` was flagged by static analysis, but we verified it is imported in `app/layout.tsx`. We will intentionally **retain** this globals file. Similarly, we verified that `framer-motion` is actively used in `protocol-steps-card.tsx`.

### 3. Clean up Unused Dependencies
The `package.json` contains over 40 dependencies that are unused by the current components (like standalone Radix UI primitives, `gsap`, `playwright`, `zod`, `input-otp`, etc.). We will trim these to reduce dependency bloat and installation delays.

## Open Questions

> [!IMPORTANT]
> **To the User:** Are there any components in the designated "DELETE" list above (e.g. `hero-futuristic.tsx`) that you plan to utilize in upcoming integrations and would like me to spare? If everything looks good, please approve so I can proceed to execution.
