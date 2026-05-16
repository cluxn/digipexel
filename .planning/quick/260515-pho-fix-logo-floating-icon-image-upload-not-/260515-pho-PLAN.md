# Quick Task 260515-pho — Plan

**Task:** fix logo/floating-icon image upload not reflecting + complete phase 2 requirements D-21–D-25
**Date:** 2026-05-15

## Root Cause

Every public-facing component AND most admin pages use relative `/api/xxx.php` URLs.
On Hostinger: frontend is at `digipexel.cluxn.com/` (static files root) but backend is at
`digipexel.cluxn.com/backend/api/`. So `/api/logos.php` → 404. Only `${API_BASE_URL}/xxx.php`
resolves correctly. This is why logos/icons don't update on the homepage, and why
D-22 (testimonials), D-24/D-25 (newsletter) appear to fail silently.

D-21 is already done (subtitle trimmed to 1 line).
D-22–D-25: code exists but uses broken relative URLs.

Upload persistence: `backend/uploads/` directory may not exist on the server (PHP mkdir
sometimes fails on shared hosting if parent perms are restrictive). Adding the directory
with a `.gitkeep` ensures it's deployed.

## Tasks

### Task 1 — Fix all relative `/api/` URLs in public-facing blocks
Fix `safeFetch("/api/xxx.php")` → `safeFetch(\`${API_BASE_URL}/xxx.php\`)` in these files.
Add `import { API_BASE_URL } from "@/lib/constants"` where not already present.

Files:
- `frontend/src/components/blocks/logo-marquee.tsx` — `/api/logos.php`
- `frontend/src/components/blocks/testimonials.tsx` — `/api/testimonials.php`
- `frontend/src/components/blocks/success-mosaic.tsx` — `/api/testimonials.php`
- `frontend/src/components/blocks/agency-stats.tsx` — `/api/site_content.php?section=stats`
- `frontend/src/components/blocks/context-problem.tsx` — `/api/site_content.php?section=problem`
- `frontend/src/components/blocks/floating-icons-hero-demo.tsx` — `/api/site_content.php?section=hero` and `/api/site_content.php?section=nav`
- `frontend/src/components/blocks/connect-cta.tsx` — `/api/leads.php`
- `frontend/src/components/ui/footer-section.tsx` — `/api/newsletter.php`
- `frontend/src/components/ui/whatsapp-button.tsx` — `/api/settings.php?key=whatsapp_number`
- `frontend/src/app/testimonials/page.tsx` — `/api/testimonials.php`

Pattern for query-string URLs: build the URL with query string inline, e.g.:
```ts
safeFetch(`${API_BASE_URL}/site_content.php?section=stats`)
```
For POST calls with body, keep the options object unchanged — only change the URL.

### Task 2 — Fix admin pages relative URLs
Same fix for admin pages that use relative paths:
- `frontend/src/app/admin/blog/page.tsx` — `/api/blogs.php` (GET + POST)
- `frontend/src/app/admin/case-studies/page.tsx` — `/api/case_studies.php` (GET + POST)
- `frontend/src/app/admin/guides/page.tsx` — `/api/guides.php` (GET + POST)

### Task 3 — Create backend uploads directory
Create `backend/uploads/.gitkeep` so the directory is deployed via GitHub Actions SFTP.
This ensures `upload.php` can move uploaded files there without PHP mkdir failing.

Also create `backend/uploads/.htaccess` to allow direct browser access to uploaded images:
```
Options -Indexes
Allow from all
```

### Task 4 — Update testimonials test to match new URL
`frontend/src/components/blocks/__tests__/testimonials.test.tsx` line 70 mocks
`safeFetch("/api/testimonials.php")`. After Task 1 changes the component to use
`API_BASE_URL`, update the mock to match the new absolute URL pattern so the test passes.

New mock target: `safeFetch` called with a string containing `testimonials.php`
(use `expect.stringContaining("testimonials.php")` to avoid hardcoding the full URL).

## Verification
- No `/api/` relative strings remain in `frontend/src/` (except test files which use stringContaining)
- `backend/uploads/` directory exists in repo
- `npm run build` passes (no ESLint/TypeScript errors from URL changes)
