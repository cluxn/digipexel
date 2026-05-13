# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**Internal REST API (self-hosted PHP):**
- Base URL: `https://digi.cluxn.com/backend/api` (or `NEXT_PUBLIC_API_URL` env override)
- Client: `frontend/src/lib/api.ts` — thin wrapper around native `fetch` via `safeFetch()` in `frontend/src/lib/utils.ts`
- Endpoints consumed by frontend:
  - `blogs.php` — CRUD for blog posts
  - `case_studies.php` — CRUD for case studies
  - `guides.php` — CRUD for downloadable guides
  - `leads.php` — Lead capture and status management (contact form submissions)
  - `logos.php` — Client logo management
  - `testimonials.php` — Testimonial management

**Image CDNs (allowed remote patterns in `frontend/next.config.ts`):**
- `images.unsplash.com` — Stock images used in seed data (guides, blogs, case studies)
- `upload.wikimedia.org` — SVG logos used in seed data (e.g., Dish, Deloitte, Pfizer, Adobe)
- `i.pravatar.cc` — Avatar placeholder images used in seed testimonials (`backend/init_db.php`)

**Google Maps:**
- Embedded as an `<iframe>` on the contact page (`frontend/src/app/contact-us/page.tsx`)
- No API key required; uses Google Maps Embed URL
- URL: `https://www.google.com/maps/embed?pb=...` (points to Kanpur, UP office address)

## Authentication Providers

**Admin Authentication:**
- Custom / none detected — the admin section (`frontend/src/app/admin/`) has a login page at `frontend/src/app/admin/login/page.tsx` but no third-party auth SDK is installed
- No OAuth, Auth0, Clerk, NextAuth, or similar library found in `package.json`
- Authentication state is likely managed client-side (localStorage or cookie); implementation details in `frontend/src/app/admin/login/page.tsx`

## Databases & Storage

**Database:**
- MySQL (via Hostinger shared hosting)
- Database name: `u723773599_digipexel`
- Host: `localhost` (Hostinger internal)
- PHP client: PDO (`backend/config.php`) — `PDO::ATTR_ERRMODE` set to `ERRMODE_EXCEPTION`
- Schema initialized by `backend/init_db.php` — creates tables: `logos`, `leads`, `guides`, `testimonials`, `testimonials_focus`, `blogs`, `case_studies`

**File Storage:**
- No cloud file storage (no S3, Cloudinary, Supabase Storage, etc.)
- Images are stored as URLs pointing to external CDNs (Unsplash, Wikimedia) or user-supplied URLs stored as `TEXT` columns in MySQL

**Caching:**
- None — no Redis, Memcached, or HTTP caching layer detected

## Infrastructure

**Hosting:**
- Platform: Hostinger shared hosting
- Domain: `digipexel.cluxn.com` (subdomain of `cluxn.com`, account `u723773599`)
- Frontend: Static HTML/CSS/JS exported by Next.js, uploaded to `public_html/digipexel/`
- Backend: PHP files uploaded to `public_html/digipexel/backend/`
- Server config: `backend/.htaccess` (present; controls PHP routing)

**CI/CD:**
- GitHub Actions — `.github/workflows/deploy-to-subdomain.yml`
- Trigger: push to `master` branch or manual `workflow_dispatch`
- Build: `npm install` + `npm run build` inside `frontend/` on `ubuntu-latest`
- Deploy tool: `lftp` — mirrors `frontend/out/` and `backend/` to Hostinger via SFTP (port 22) with FTPS fallback
- Post-deploy: HTTP GET to `https://digipexel.cluxn.com/backend/init_db.php` to initialize/migrate database
- Secrets used: Hostinger FTP credentials embedded in workflow (not stored as GitHub Secrets — a security concern)

**CDN:**
- None configured explicitly; Hostinger may provide basic caching at the edge

## Third-Party SDKs

**Fonts:**
- Google Fonts (via Next.js `next/font/google`) — `Geist` and `Geist_Mono` font families loaded in `frontend/src/app/layout.tsx`
- No external HTTP request at runtime; Next.js self-hosts downloaded font files at build time

**Icons:**
- lucide-react 0.577.0 — SVG icon library, used extensively across admin and public pages (no external requests)

**Analytics:**
- None detected — no Google Analytics, Plausible, Mixpanel, or similar

**Error Tracking:**
- None detected — no Sentry, Bugsnag, or similar

**Email / Newsletter:**
- None integrated — admin panel has a `newsletter` route (`frontend/src/app/admin/newsletter/page.tsx`) but no email SDK (SendGrid, Mailchimp, Resend, etc.) found in `package.json` or backend files

**Payment:**
- None — no Stripe, Razorpay, or payment SDK detected

**Automation / Workflow Tools (referenced in marketing copy only):**
- n8n, Make (formerly Integromat), Zapier — mentioned in site metadata keywords (`frontend/src/app/layout.tsx`) and UI component names (`frontend/src/components/ui/n8n-workflow-block-shadcnui.tsx`) as services the agency offers, but not integrated as SDKs into the codebase itself

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected — lead submissions are stored in MySQL only; no webhook forwarding to CRM or Slack

## Environment Configuration

**Required env vars (frontend):**
- `NEXT_PUBLIC_API_URL` — Backend API base URL (optional; defaults to `https://digi.cluxn.com/backend/api`)

**Required env vars (backend):**
- None via env — DB credentials are hardcoded in `backend/config.php`

**Secrets location:**
- Frontend: `.env.local` (git-ignored)
- Backend: Hardcoded in `backend/config.php` (committed to repo — security concern)
- CI/CD: Hostinger credentials hardcoded in `.github/workflows/deploy-to-subdomain.yml` (not using GitHub Secrets)

---

*Integration audit: 2026-05-13*
