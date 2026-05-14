<!-- GSD:project-start source:PROJECT.md -->
## Project

**Digi Pexel — Agency Website**

Digi Pexel is a digital marketing automation agency website targeting B2B decision makers (COOs, Founders, VPs, Directors) seeking AI automation and digital marketing services. The site serves as the primary lead generation platform, combining a public-facing marketing site with a full admin CMS that lets the agency manage all content, leads, and site configuration without writing code.

**Core Value:** A launch-ready agency website where every section is editable from the admin panel and every lead is captured — no hardcoded content, no broken links, no fake data.

### Constraints

- **Tech Stack**: Next.js static export — no server-side rendering at runtime. All dynamic content must be fetched client-side via API calls.
- **Hosting**: Shared Hostinger hosting — no Node.js server, no connection pooling, limited vertical scaling.
- **Backend**: PHP with no framework — follow existing action-based POST routing pattern.
- **Deployment**: GitHub Actions → SFTP to Hostinger. No staging environment.
- **Images**: Must use `images: { unoptimized: true }` in next.config.ts for static export compatibility.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - Frontend (all `.ts` and `.tsx` files under `frontend/src/`)
- PHP 8.x - Backend (all files under `backend/`)
- CSS (Tailwind utility classes via `frontend/src/app/globals.css`)
## Runtime
- Node.js 20 (pinned in CI via `.github/workflows/deploy-to-subdomain.yml`, `node-version: '20'`)
- PHP 8.x on Hostinger shared hosting (`backend/config.php` uses PDO with MySQL)
- npm
- Lockfile: `frontend/package-lock.json` (present, lockfile version 3)
## Frameworks
- Next.js 16.1.6 - Full React framework (App Router), configured for static export (`output: 'export'`) via `frontend/next.config.ts`
- React 19.2.3 - UI rendering library
- React DOM 19.2.3 - DOM bindings
- Tailwind CSS 4.x - Utility-first CSS, configured via `frontend/postcss.config.mjs` using `@tailwindcss/postcss`
- Framer Motion 12.36.0 / motion 12.36.0 - Animation library used in page components
- class-variance-authority 0.7.1 - Component variant management (used in `frontend/src/components/ui/button.tsx`)
- clsx 2.1.1 + tailwind-merge 3.5.0 - Class merging utilities (`frontend/src/lib/utils.ts`)
- Radix UI `@radix-ui/react-dialog` 1.1.15 - Accessible dialog primitives
- Radix UI `@radix-ui/react-slot` 1.2.4 - Slot composition (used in Button)
- Radix UI `@radix-ui/react-switch` 1.2.6 - Switch toggle
- lucide-react 0.577.0 - Icon library (used throughout admin and public pages)
- react-hook-form 7.71.2 - Form state management
- @hookform/resolvers 5.2.2 - Form validation resolver bridge
- zod 4.3.6 - Schema validation
- Jest 29.7.0 + jest-environment-jsdom 29.7.0 - Unit/component test runner
- @testing-library/react 16.3.2 + @testing-library/jest-dom 6.9.1 - DOM testing utilities
- jest-axe 10.0.0 + @types/jest-axe 3.5.9 - Accessibility testing
- Cypress 14.5.4 - End-to-end testing
- Next.js CLI (`next dev`, `next build`, `next start`) - Dev server and build
- ESLint 9.x - Linting via `frontend/eslint.config.mjs` with `eslint-config-next` (core-web-vitals + typescript rules)
- `@tailwindcss/postcss` 4.x - PostCSS integration for Tailwind
## Key Dependencies
- `next` 16.1.6 - Core framework; static export mode means no server-side rendering at runtime
- `react` / `react-dom` 19.2.3 - Latest React with concurrent features
- `framer-motion` / `motion` 12.36.0 - Animation; used in hero and block components
- `zod` 4.3.6 - Runtime validation for form inputs
- PHP PDO with MySQL driver - Database access layer (`backend/config.php`)
- Native `fetch` API (browser) - HTTP client; wrapped in `frontend/src/lib/utils.ts` `safeFetch()`
## Configuration
- Frontend env vars loaded from `.env.local` (git-ignored per `.gitignore`)
- Key public var: `NEXT_PUBLIC_API_URL` — defaults to `https://digi.cluxn.com/backend/api` when unset (`frontend/src/lib/constants.ts`)
- Backend DB credentials hardcoded in `backend/config.php` (Hostinger MySQL)
- `frontend/next.config.ts` — static export, trailing slash, Unsplash + Wikimedia remote image patterns
- `frontend/tsconfig.json` — strict mode, ES2017 target, path alias `@/*` → `./src/*`
- `frontend/postcss.config.mjs` — Tailwind PostCSS plugin only
## Platform Requirements
- Node.js 20+
- npm (lockfile committed at `frontend/package-lock.json`)
- PHP 8.x + MySQL for backend local testing
- Hostinger shared hosting at `digipexel.cluxn.com` (subdomain of `cluxn.com`)
- Frontend served as static files from `frontend/out/` → `public_html/digipexel/`
- Backend PHP files at `public_html/digipexel/backend/`
- MySQL database: `u723773599_digipexel` on `localhost` (Hostinger)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Style Guide
- ESLint 9 with `eslint-config-next` (no Prettier configured)
- No explicit formatting tool — relies on ESLint rules only
## TypeScript / Type Safety
- Strict mode enabled in `tsconfig.json`
- Path alias `@/*` → `src/*` for absolute imports
- TypeScript used throughout frontend; PHP backend is untyped
## Patterns Used
- **47 client components** using `"use client"` directive
- **Three component tiers:**
- `cn()` utility + CVA (class-variance-authority) for variant-based component styling
- Framer Motion for all animations — inconsistent import source: `framer-motion` vs `motion/react` (mixed usage)
- `safeFetch()` wrapper used for all public API calls
- Admin pages fall back to mock data (no real API connection)
- `react-hook-form` and `zod` installed but currently unused
## Naming Conventions
- **Components:** PascalCase (e.g., `HeroSection`, `AdminLayout`)
- **Functions:** camelCase (e.g., `safeFetch`, `handleSubmit`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files/folders:** kebab-case (e.g., `admin-layout.tsx`, `hero-section.tsx`)
## Import Style
- Absolute imports via `@/*` alias preferred
- Named exports for shared/reusable components
- Default exports for page components (Next.js convention)
- No barrel files (`index.ts`) pattern observed
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern
- Frontend is a **static export** (`next build` produces `out/` directory) — no server-side rendering at runtime; all pages are pre-rendered HTML + client-side JavaScript.
- Backend is a **thin PHP REST API** (no framework) hosted as a subdirectory of the same domain: `https://digipexel.cluxn.com/backend/api/`.
- The two halves are fully decoupled: the frontend calls the backend over HTTP using the `api` client in `frontend/src/lib/api.ts`.
- Admin panel is a set of Next.js client pages under `/admin` — authentication is handled entirely in the browser (localStorage flag + hardcoded passcode), with no server-side session.
## Data Flow
- If the PHP API returns an error or network fails, `safeFetch` returns `{ status: "error" }` and page-level client components (e.g. `blog-details-client.tsx`) fall back to hardcoded `DEMO_POST` / `DEMO_RELATED` constants embedded in the component file.
## Key Components
### Backend (`backend/`)
| File | Responsibility |
|------|---------------|
| `config.php` | Database credentials, creates `$pdo` (PDO connection object) |
| `common.php` | Requires `config.php`; exports `send_json_headers()`, `json_resp()`, `slugify()`, `get_input()` |
| `init_db.php` | One-time setup: `CREATE TABLE IF NOT EXISTS` for all 6 tables, seeds default rows |
| `api/blogs.php` | CRUD for blogs; handles auto-migration of new columns on boot |
| `api/case_studies.php` | CRUD for case studies |
| `api/guides.php` | CRUD for guides |
| `api/leads.php` | Capture + status-update + delete for leads |
| `api/logos.php` | CRUD for logo marquee entries |
| `api/testimonials.php` | CRUD for testimonials + `testimonials_focus` media |
| `api/index.php` | Catch-all fallback for the `backend/api/` directory |
| `.htaccess` | Rewrites unmatched requests to `index.php`; preserves Authorization header |
```json
```
### Frontend (`frontend/src/`)
| Module | Responsibility |
|--------|---------------|
| `lib/api.ts` | Centralized HTTP client — `api.get(endpoint, params?)` and `api.post(endpoint, body)`. Constructs URLs as `${API_BASE_URL}/${endpoint}.php`. |
| `lib/utils.ts` | `cn()` (Tailwind class merger), `safeFetch()` (error-safe fetch wrapper with JSON parse guard) |
| `lib/constants.ts` | `SITE_NAME`, `TAGLINE`, `NAV_LINKS`, `SOCIAL_LINKS`, `API_BASE_URL` (reads `NEXT_PUBLIC_API_URL` env var, falls back to `https://digi.cluxn.com/backend/api`) |
| `app/layout.tsx` | Root layout: Geist font, global CSS, mounts `<Nudges />` and `<BackToTop />` globally |
| `app/page.tsx` | Homepage — assembles ~10 block components in sequence |
| `app/services/[slug]/page.tsx` | Dynamic service pages — all service content is hardcoded in a `SERVICES` record (no DB); uses `generateStaticParams` to pre-render all slugs at build time |
| `app/blog/[slug]/page.tsx` | Blog detail — server wrapper that resolves slug, passes to `BlogDetailsClient` |
| `components/page-clients/blog-details-client.tsx` | Full blog post rendering including TOC, sections, share buttons, inline lead form |
| `components/page-clients/case-study-client.tsx` | Case study detail rendering |
| `components/page-clients/guide-client.tsx` | Guide detail rendering |
| `components/admin/admin-layout.tsx` | Shared admin sidebar + auth guard (localStorage check → redirect to `/admin/login`) |
| `components/blocks/` | Marketing section components (hero, stats, logos, testimonials, services, etc.) |
| `components/ui/` | Base UI primitives (Button, Badge, Card, Navbar, Footer, Nudges, etc.) |
## State Management
- **Server/API data:** `useState` + `useEffect` with `fetch` or `api.get()` inside client components. No SWR, React Query, or similar.
- **Admin auth:** `localStorage.getItem("admin_auth") === "true"` checked in `AdminLayout`'s `useEffect`. No JWT, no server session.
- **Form state:** Controlled `useState` per field in each form component.
- **UI state:** Local `useState` (loading, error, copied, formSent, activeSection, etc.) within each page-client component.
## API Design
| Endpoint | GET behavior | POST actions |
|----------|-------------|--------------|
| `blogs.php` | List published blogs (or all with `?admin=1`); single by `?slug=` | `save_post`, `delete_post`, `update_blogs` |
| `case_studies.php` | List / fetch by slug | `save_case_study`, `delete_case_study`, `update_case_studies` |
| `guides.php` | List / fetch by id or slug | `save_guide`, `delete_guide` |
| `leads.php` | List all leads | `add_lead`, `update_status`, `delete_lead` |
| `logos.php` | List all logos | `update_logos` (full replace) |
| `testimonials.php` | List testimonials + focus items | `update_testimonials`, `update_focus` |
## Error Handling
- Network errors → caught, return `{ status: "error", message: "Connection failed" }`.
- Non-2xx HTTP → return `{ status: "error", message: "Server returned <N>" }`.
- Invalid JSON body → return `{ status: "error", message: "Invalid server response format" }`.
- Page-level components check `d.status === "success"` and fall back to embedded demo data on failure.
## Authentication
- Login page (`/admin/login/page.tsx`) compares entered code against hardcoded string `"12345"`.
- On success, sets `localStorage.setItem("admin_auth", "true")`.
- `AdminLayout` checks this flag on mount and redirects to `/admin/login` if absent.
- No token sent to backend; backend has no authentication layer — all PHP endpoints are publicly accessible.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
