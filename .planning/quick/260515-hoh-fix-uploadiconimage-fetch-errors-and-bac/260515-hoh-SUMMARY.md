---
quick_task: 260515-hoh
title: fix uploadIconImage fetch errors and backend API unreachable in admin panel
date: 2026-05-15
status: complete
commits:
  - 498d3f5
  - a0e0550
  - b09fd39
tags: [bugfix, admin, api, logos, site-content, deploy]
key-files:
  modified:
    - frontend/src/app/admin/site-content/page.tsx
    - frontend/src/app/admin/logos/page.tsx
    - frontend/src/lib/constants.ts
    - .github/workflows/deploy-to-subdomain.yml
---

# Quick Task 260515-hoh: fix uploadIconImage fetch errors and backend API unreachable in admin panel

**One-liner:** Replaced raw `fetch()` with `safeFetch()` in upload handlers, fixed logos page to use `API_BASE_URL` instead of broken relative paths, and aligned `constants.ts` + CI build to `digipexel.cluxn.com`.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Fix upload functions to use safeFetch | `498d3f5` | `site-content/page.tsx`, `logos/page.tsx` |
| 2 | Fix logos page API URLs | `a0e0550` | `logos/page.tsx` |
| 3 | Fix API base URL and deploy config | `b09fd39` | `constants.ts`, `deploy-to-subdomain.yml` |

## What Was Fixed

### Bug 1 — uploadIconImage / handleLogoFileChange raw fetch calls
Both `site-content/page.tsx` (`uploadIconImage`) and `logos/page.tsx` (`handleLogoFileChange`) called `fetch()` directly then `res.json()`. When the backend is unreachable the Chrome extension `frame_ant.js` monkey-patches `window.fetch` and fires an `unhandledrejection` before the async try-catch catches it. Fixed by replacing both with `safeFetch()`, which includes `fetchPromise.catch(() => {})` to suppress the extension's unhandled rejection event.

Also added `safeFetch` to the import statement in `site-content/page.tsx` (it was already imported in `logos/page.tsx` via `@/lib/utils`).

### Bug 2 — Logos page using relative `/api/logos.php` paths
Three call sites in `logos/page.tsx` used the relative URL `/api/logos.php`:
- `fetchData` — `safeFetch("/api/logos.php")` → resolves to a 404 on both local dev and Hostinger
- `handleToggleSection` — raw `fetch("/api/logos.php", ...)` → 404 + unhandled rejection
- `saveChanges` — `safeFetch("/api/logos.php", ...)` → 404, silently fell through to localStorage alert

All three updated to `${API_BASE_URL}/logos.php`. `handleToggleSection` also converted from raw `fetch` to `safeFetch` and received a `Content-Type: application/json` header (matching the pattern used everywhere else).

### Bug 3 — API base URL pointing to wrong subdomain
`constants.ts` hardcoded `digi.cluxn.com` as fallback but the CI/CD workflow deploys the backend to `digipexel.cluxn.com`. The `NEXT_PUBLIC_API_URL` env var was never set during the GitHub Actions build, so the wrong fallback URL was baked into every production build.

Two fixes:
- `constants.ts`: changed fallback from `https://digi.cluxn.com/backend/api` to `https://digipexel.cluxn.com/backend/api`
- `deploy-to-subdomain.yml`: added `env: NEXT_PUBLIC_API_URL: https://digipexel.cluxn.com/backend/api` to the build step — ensures the env var is explicitly set at build time regardless of fallback

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all changes are functional wiring, no placeholder data.

## Self-Check: PASSED

- `498d3f5` — confirmed in git log
- `a0e0550` — confirmed in git log
- `b09fd39` — confirmed in git log
- No relative `/api/logos` paths remain in `logos/page.tsx`
- No raw `fetch()` calls remain in upload handlers
- `constants.ts` uses `digipexel.cluxn.com`
- `deploy-to-subdomain.yml` sets `NEXT_PUBLIC_API_URL`
