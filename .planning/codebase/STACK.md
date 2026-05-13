# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**
- TypeScript 5.x - Frontend (all `.ts` and `.tsx` files under `frontend/src/`)
- PHP 8.x - Backend (all files under `backend/`)

**Secondary:**
- CSS (Tailwind utility classes via `frontend/src/app/globals.css`)

## Runtime

**Environment:**
- Node.js 20 (pinned in CI via `.github/workflows/deploy-to-subdomain.yml`, `node-version: '20'`)
- PHP 8.x on Hostinger shared hosting (`backend/config.php` uses PDO with MySQL)

**Package Manager:**
- npm
- Lockfile: `frontend/package-lock.json` (present, lockfile version 3)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full React framework (App Router), configured for static export (`output: 'export'`) via `frontend/next.config.ts`
- React 19.2.3 - UI rendering library
- React DOM 19.2.3 - DOM bindings

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS, configured via `frontend/postcss.config.mjs` using `@tailwindcss/postcss`
- Framer Motion 12.36.0 / motion 12.36.0 - Animation library used in page components
- class-variance-authority 0.7.1 - Component variant management (used in `frontend/src/components/ui/button.tsx`)
- clsx 2.1.1 + tailwind-merge 3.5.0 - Class merging utilities (`frontend/src/lib/utils.ts`)

**UI Components:**
- Radix UI `@radix-ui/react-dialog` 1.1.15 - Accessible dialog primitives
- Radix UI `@radix-ui/react-slot` 1.2.4 - Slot composition (used in Button)
- Radix UI `@radix-ui/react-switch` 1.2.6 - Switch toggle
- lucide-react 0.577.0 - Icon library (used throughout admin and public pages)

**Forms:**
- react-hook-form 7.71.2 - Form state management
- @hookform/resolvers 5.2.2 - Form validation resolver bridge
- zod 4.3.6 - Schema validation

**Testing:**
- Jest 29.7.0 + jest-environment-jsdom 29.7.0 - Unit/component test runner
- @testing-library/react 16.3.2 + @testing-library/jest-dom 6.9.1 - DOM testing utilities
- jest-axe 10.0.0 + @types/jest-axe 3.5.9 - Accessibility testing
- Cypress 14.5.4 - End-to-end testing

**Build/Dev:**
- Next.js CLI (`next dev`, `next build`, `next start`) - Dev server and build
- ESLint 9.x - Linting via `frontend/eslint.config.mjs` with `eslint-config-next` (core-web-vitals + typescript rules)
- `@tailwindcss/postcss` 4.x - PostCSS integration for Tailwind

## Key Dependencies

**Critical:**
- `next` 16.1.6 - Core framework; static export mode means no server-side rendering at runtime
- `react` / `react-dom` 19.2.3 - Latest React with concurrent features
- `framer-motion` / `motion` 12.36.0 - Animation; used in hero and block components
- `zod` 4.3.6 - Runtime validation for form inputs

**Infrastructure:**
- PHP PDO with MySQL driver - Database access layer (`backend/config.php`)
- Native `fetch` API (browser) - HTTP client; wrapped in `frontend/src/lib/utils.ts` `safeFetch()`

## Configuration

**Environment:**
- Frontend env vars loaded from `.env.local` (git-ignored per `.gitignore`)
- Key public var: `NEXT_PUBLIC_API_URL` — defaults to `https://digi.cluxn.com/backend/api` when unset (`frontend/src/lib/constants.ts`)
- Backend DB credentials hardcoded in `backend/config.php` (Hostinger MySQL)

**Build:**
- `frontend/next.config.ts` — static export, trailing slash, Unsplash + Wikimedia remote image patterns
- `frontend/tsconfig.json` — strict mode, ES2017 target, path alias `@/*` → `./src/*`
- `frontend/postcss.config.mjs` — Tailwind PostCSS plugin only

## Platform Requirements

**Development:**
- Node.js 20+
- npm (lockfile committed at `frontend/package-lock.json`)
- PHP 8.x + MySQL for backend local testing

**Production:**
- Hostinger shared hosting at `digipexel.cluxn.com` (subdomain of `cluxn.com`)
- Frontend served as static files from `frontend/out/` → `public_html/digipexel/`
- Backend PHP files at `public_html/digipexel/backend/`
- MySQL database: `u723773599_digipexel` on `localhost` (Hostinger)

---

*Stack analysis: 2026-05-13*
