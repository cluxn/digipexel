---
phase: 07-seo-static-pages-launch-readiness
plan: 04
subsystem: calendly-integration-seo-admin
tags: [calendly, react-calendly, admin, seo, sidebar, dynamic-import]
dependency_graph:
  requires: [07-02]
  provides: [CalendlyButton-component, admin-seo-page, calendly_url-wiring]
  affects: [connect-cta, navbar, admin-sidebar]
tech_stack:
  added: [react-calendly@4.4.0]
  patterns: [dynamic-import-ssr-false, conditional-render-fallback, PopupWidget-rootElement]
key_files:
  created:
    - frontend/src/components/ui/calendly-button.tsx
    - frontend/src/app/admin/seo/page.tsx
  modified:
    - frontend/src/components/blocks/connect-cta.tsx
    - frontend/src/components/blocks/floating-icons-hero-demo.tsx
    - frontend/src/components/admin/admin-layout.tsx
decisions:
  - CalendlyButton uses dynamic(() => ..., { ssr: false }) at import site — PopupWidget requires DOM; rootElement set via useEffect after mount to avoid SSR errors
  - Homepage hero CTA excluded from Calendly wiring — lead-capture form submits to DB and redirects to /thank-you; form-based lead capture takes precedence over Calendly booking at discovery stage (documented exception to D-01)
  - When calendly_url is empty, both connect-cta and Navbar fall back to existing Link with zero visual or behavioral regression
  - color="#7C3AED" used for PopupWidget button color — matches brand purple for visual consistency
metrics:
  duration: 8min
  completed_date: "2026-05-16"
  tasks_completed: 2
  files_modified: 5
---

# Phase 07 Plan 04: Calendly Integration + Admin SEO Editor Summary

**One-liner:** CalendlyButton component (react-calendly PopupWidget, ssr:false, brand purple) wired to connect-cta non-homepage CTA and Navbar Book a Call button via calendly_url settings fetch, plus admin SEO meta editor page with page selector, three meta fields, amber rebuild notice, and SEO sidebar entry.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create CalendlyButton + extend connect-cta + extend Navbar | 4aa9c74 | calendly-button.tsx, connect-cta.tsx, floating-icons-hero-demo.tsx, package.json, package-lock.json |
| 2 | Create admin SEO meta editor page + add SEO sidebar entry | b9f2e84 | admin/seo/page.tsx, admin-layout.tsx |

## What Was Built

### Task 1: CalendlyButton Component + CTA Wiring

**frontend/src/components/ui/calendly-button.tsx** — New component:
- `"use client"` directive — client-only component
- Imports `PopupWidget` from `react-calendly`
- `rootElement` set via `useEffect` after mount (`document.getElementById('__next') || document.body`) — required for PopupWidget; document not available during SSR/build
- Returns `null` until both `rootEl` is set and `url` is non-empty
- Brand color: `color="#7C3AED"`, `textColor="#ffffff"`
- Props: `url` (string), `label` (string), `className?` (string)

**frontend/src/components/blocks/connect-cta.tsx** — Extended:
- Dynamic import of CalendlyButton with `{ ssr: false }` — prevents SSR errors from PopupWidget DOM dependency
- New `calendlyUrl` state initialized to `""`
- Existing `useEffect` for settings.php extended to also extract `calendly_url` from response
- Non-homepage CTA section: conditional render — CalendlyButton when `calendlyUrl` is set, falls back to original `<Button asChild variant="brand"><Link>` with zero visual regression
- Homepage variant unchanged (lead-capture form takes precedence — documented exception to D-01)

**frontend/src/components/blocks/floating-icons-hero-demo.tsx (Navbar)** — Extended:
- Dynamic import of CalendlyButton with `{ ssr: false }`
- New `calendlyUrl` state in `Navbar` function
- New `useEffect` fetching `settings.php` and extracting `calendly_url`
- Navbar CTA: conditional render — CalendlyButton when `calendlyUrl` is set, falls back to existing Link for "Book a Call"

**react-calendly@4.4.0** installed to `dependencies` in package.json.

### Task 2: Admin SEO Meta Editor + Sidebar

**frontend/src/app/admin/seo/page.tsx** — New page:
- 19-option page selector dropdown (homepage, blog, case-studies, guides, testimonials, contact-us, privacy-policy, terms-and-conditions, all 11 service pages)
- Three meta fields: SEO Title (text, 60-char guidance), Meta Description (textarea, 160-char guidance), OG Image URL (url input)
- `useEffect` reloads fields from `api.get('seo_meta', { page: selectedPage })` when page selection changes
- `handleSave` posts to `api.post('seo_meta', { action: 'save_seo_meta', page_key, seo_title, meta_description, og_image })`
- Four-state save feedback: idle / saving / saved / error, auto-resets to idle after 4 seconds
- Amber rebuild notice banner with AlertTriangle icon — explains changes require rebuild
- Wrapped in `AdminLayout` for auth guard

**frontend/src/components/admin/admin-layout.tsx** — Updated:
- `Search` added to lucide-react import list
- SEO sidebar entry added between ANALYTICS and USERS: `{ name: "SEO", icon: Search, href: "/admin/seo", status: "Active" }`

## Verification Results

All acceptance criteria passed:
- `frontend/src/components/ui/calendly-button.tsx` exists with `"use client"`, `PopupWidget`, `rootElement`, `color="#7C3AED"`
- `connect-cta.tsx` contains `dynamic(`, `ssr: false`, `calendlyUrl`, `calendly_url`, `CalendlyButton`
- `floating-icons-hero-demo.tsx` contains `CalendlyButton`, `calendlyUrl`, `calendly_url`
- `frontend/package.json` contains `"react-calendly": "^4.4.0"`
- `frontend/src/app/admin/seo/page.tsx` exists with `save_seo_meta`, `Changes take effect after the next site rebuild`, `AlertTriangle`, `meta_description`, `og_image`, `AdminLayout`
- `admin-layout.tsx` contains `SEO`, `Search` (lucide icon), `/admin/seo`
- `npx tsc --noEmit` exits 0 — TypeScript compiles with no errors

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all functionality is wired:
- CalendlyButton renders conditionally based on `calendly_url` from settings.php (empty string = no Calendly configured, renders fallback Link)
- Admin SEO page fetches from and saves to the `seo_meta` PHP endpoint created in Plan 02
- The seo_meta endpoint returns null/empty for pages with no saved meta — frontend returns empty strings in all fields, which is the correct state before admin configures SEO

## Self-Check: PASSED

- `frontend/src/components/ui/calendly-button.tsx` — FOUND (created in Task 1)
- `frontend/src/app/admin/seo/page.tsx` — FOUND (created in Task 2)
- Commit `4aa9c74` — FOUND (Task 1)
- Commit `b9f2e84` — FOUND (Task 2)
