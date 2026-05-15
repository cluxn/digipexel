---
phase: 06-admin-panel-completion
plan: "04"
subsystem: public-site-config-wiring
tags: [analytics, banners, settings, whatsapp, footer, connect-cta, nudges]
dependency_graph:
  requires: [06-01, 06-02, 06-03]
  provides: [live-analytics-injection, db-driven-nudges, db-driven-social-links, db-driven-whatsapp, db-driven-cta-link]
  affects: [layout.tsx, nudges.tsx, footer-section.tsx, whatsapp-button.tsx, connect-cta.tsx, blog-details-client.tsx, guide-client.tsx]
tech_stack:
  added: []
  patterns: [safeFetch-for-all-api-calls, useEffect-dom-injection, settings.php-multi-key-fetch]
key_files:
  created:
    - frontend/src/components/ui/analytics-injector.tsx
  modified:
    - frontend/src/app/layout.tsx
    - frontend/src/components/ui/nudges.tsx
    - frontend/src/components/page-clients/blog-details-client.tsx
    - frontend/src/components/page-clients/guide-client.tsx
    - frontend/src/components/ui/footer-section.tsx
    - frontend/src/components/ui/whatsapp-button.tsx
    - frontend/src/components/blocks/connect-cta.tsx
key_decisions:
  - "AnalyticsInjector uses DOM manipulation (document.head.appendChild) instead of Next.js Metadata API — required for static export compatibility"
  - "Nudges exit_popup (snake_case from DB) mapped to exitPopup (camelCase internal) — preserves type safety"
  - "Footer social icons degrade gracefully to non-interactive spans when URL not configured — no broken links"
  - "WhatsApp button defaults to visible with fallback number 911234567890 — button never disappears on fetch failure"
  - "Connect CTA effectiveCtaLink = ctaHref prop (if provided) || fetchedLink from DB — prop override pattern preserved for service pages"
metrics:
  duration: 18
  completed_date: "2026-05-15"
  tasks_completed: 5
  files_modified: 8
---

# Phase 06 Plan 04: Public Site Config Wiring Summary

**One-liner:** Wired six public-site components (analytics, nudges, footer social links, WhatsApp button, Connect CTA, content-page banners) to DB-backed APIs via safeFetch so admin changes take effect without a code deploy.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Create AnalyticsInjector + wire into root layout | 1a96e17 | analytics-injector.tsx (new), layout.tsx |
| 2 | Nudges fetches from banners.php + ContentPageBanner in blog/guide | 45ee743 | nudges.tsx, blog-details-client.tsx, guide-client.tsx |
| 3 | Footer social links wired to settings API (SET-01) | 4076b0f | footer-section.tsx |
| 4 | WhatsApp button reads toggle + phone number from settings API (SET-04) | bc7ec31 | whatsapp-button.tsx |
| 5 | Connect CTA button link wired to settings API (SET-05) | 80908fd | connect-cta.tsx |

## What Was Built

### Task 1 — AnalyticsInjector
New `"use client"` component that fetches `google_analytics`, `search_console`, and `custom_head_scripts` from `analytics.php` on mount. Uses DOM manipulation (`document.createElement`, `document.head.appendChild`) instead of the Next.js Metadata API — the only approach compatible with static export. Deduplicates by `src` attribute (scripts) and `name` attribute (meta tags). Returns `null` so it renders nothing visible. Mounted in `layout.tsx` before `<Nudges />` so it runs on every public page.

### Task 2 — Nudges + ContentPageBanner
Replaced the `loadConfig()` / `localStorage.getItem(CONFIG_KEY)` pattern in `nudges.tsx` with an async `loadFromDB()` that calls `banners.php` via `safeFetch`. Maps the DB's snake_case `exit_popup` key to the internal `exitPopup` camelCase field. Dismiss keys (BANNER_DISMISS_KEY, POPUP_DISMISS_KEY, EXIT_DISMISS_KEY) are kept — dismiss state is correctly per-browser. Added a local `ContentPageBanner` function component to both `blog-details-client.tsx` and `guide-client.tsx`, placed above the newsletter block, that fetches `banners.php` and renders a colored banner bar when `banner.enabled` is true.

### Task 3 — Footer Social Links
Added `socialUrls` state and a `useEffect` in the `Footer` component that fetches `settings.php` on mount. Social icons now render as real `<a target="_blank">` tags when a URL is configured, or as non-interactive `<span>` tags with "(not configured)" title when empty. Removed the "Coming soon" placeholder.

### Task 4 — WhatsApp Button
Replaced the single-key query (`?key=whatsapp_number`) with a full `settings.php` GET. Added `whatsappEnabled` state (defaults `true`) and `whatsappNumber` state (defaults `"911234567890"`). Checks `whatsapp_enabled !== "false"` because the settings table stores booleans as strings. Returns `null` when disabled. Falls back to the default number when fetch fails — button always works offline.

### Task 5 — Connect CTA
Added `fetchedLink` state (defaults `"/contact-us"`) and a `useEffect` that fetches `default_cta_link` from `settings.php`. Introduced `effectiveCtaLink = ctaHref || fetchedLink` so service pages can still pass a per-page override via the new `ctaHref` prop. The non-homepage `<Link href="/contact-us">` was replaced with `<Link href={effectiveCtaLink}>`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — Missing critical functionality] WhatsApp button was already partially wired but only fetched number, not enabled toggle**
- **Found during:** Task 4
- **Issue:** The existing `whatsapp-button.tsx` already used `safeFetch` but only fetched `?key=whatsapp_number` (single-key endpoint) rather than the full settings, and had no `whatsapp_enabled` check.
- **Fix:** Rewrote the fetch to use the full `settings.php` GET and added `whatsappEnabled` state with toggle logic.
- **Files modified:** frontend/src/components/ui/whatsapp-button.tsx
- **Commit:** bc7ec31

## Requirements Fulfilled

- POP-01: Nudges/Popups live on site (banners.php-driven config) — fulfilled
- POP-02: Exit-intent popup config from DB — fulfilled
- POP-03: Announcement banner from DB — fulfilled
- ANA-02: Analytics codes injected into page head from DB — fulfilled
- NEWS-02: Newsletter section on blog and guide pages — fulfilled (ContentPageBanner above newsletter)
- NEWS-03: Content-page banners on blog/guide when configured — fulfilled
- SET-01: Social links editable from Settings panel, live on site — fulfilled
- SET-02: WhatsApp toggle controlled from Settings — fulfilled (SET-04)
- SET-03: WhatsApp phone number from Settings — fulfilled (SET-04)
- SET-04: WhatsApp button controlled by settings DB — fulfilled
- SET-05: Default CTA link from settings DB — fulfilled

## Known Stubs

None — all components fetch live data from the DB with correct fallbacks. No placeholder text or hardcoded stub values remain in the modified files.

## Self-Check: PASSED

Files exist:
- frontend/src/components/ui/analytics-injector.tsx — FOUND
- frontend/src/app/layout.tsx — FOUND (contains AnalyticsInjector x2)
- frontend/src/components/ui/nudges.tsx — FOUND (contains banners.php)
- frontend/src/components/page-clients/blog-details-client.tsx — FOUND (ContentPageBanner x2)
- frontend/src/components/page-clients/guide-client.tsx — FOUND (ContentPageBanner x2)
- frontend/src/components/ui/footer-section.tsx — FOUND (settings.php, socialUrls)
- frontend/src/components/ui/whatsapp-button.tsx — FOUND (whatsapp_enabled)
- frontend/src/components/blocks/connect-cta.tsx — FOUND (default_cta_link)

Commits verified:
- 1a96e17 — Task 1 AnalyticsInjector
- 45ee743 — Task 2 Nudges + ContentPageBanner
- 4076b0f — Task 3 Footer social links
- bc7ec31 — Task 4 WhatsApp button
- 80908fd — Task 5 Connect CTA
