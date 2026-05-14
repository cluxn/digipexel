---
phase: 01-bugs-foundation
plan: "01"
subsystem: foundation
tags: [bugfix, config, admin, footer, htaccess]
dependency_graph:
  requires: []
  provides: [clean-image-config, https-enforcement, working-admin-sidebar, clean-admin-dashboard, non-clickable-social-icons]
  affects: [all-pages-using-next-image, backend-api-requests, admin-panel-navigation, public-footer]
tech_stack:
  added: []
  patterns: [static-export-image-config, htaccess-mod-rewrite, lucide-react-icon-imports]
key_files:
  created: []
  modified:
    - frontend/next.config.ts
    - backend/.htaccess
    - frontend/src/components/admin/admin-layout.tsx
    - frontend/src/app/admin/page.tsx
    - frontend/src/lib/constants.ts
    - frontend/src/components/ui/footer-section.tsx
  deleted:
    - frontend/src/app/admin/approvals/ (directory + page.tsx)
    - frontend/src/app/admin/waitlist/ (directory + page.tsx)
decisions:
  - "D-01: unoptimized: true added to next.config.ts images block"
  - "D-02: dashboardCategories array and Category Navigation JSX removed from admin/page.tsx"
  - "D-03: Newsletter, Banners, Settings sidebar hrefs updated from # to real routes"
  - "D-04: overflow-y-auto added to sidebar nav element"
  - "D-05: APPROVAL QUEUE entry and Clock import removed from admin-layout.tsx"
  - "D-06: approvals/ and waitlist/ directories deleted"
  - "D-07: Waitlist removed via D-02 dashboardCategories cleanup"
  - "D-08: All sidebar item names updated per rename table"
  - "D-09: HTTPS 301 redirect prepended to backend/.htaccess"
  - "D-10: SOCIAL_LINKS href values removed; social icons converted to non-clickable spans"
  - "D-11: No other # links found in public component files"
  - "D-12: Admin sidebar # hrefs fixed via D-03"
metrics:
  duration: "~25 minutes"
  completed: "2026-05-14"
  tasks_completed: 4
  files_modified: 6
  files_deleted: 2
---

# Phase 1 Plan 01: Bugs & Foundation Summary

**One-liner:** Eliminated all 8 blocking bugs — static export image config, HTTPS redirect, admin sidebar renamed/repaired/scrollable, dashboard double-nav removed, stub pages deleted, social icons made non-clickable.

## What Was Changed

### frontend/next.config.ts
Added `unoptimized: true` as the first key inside the `images` object. All existing `remotePatterns`, `output: 'export'`, and `trailingSlash: true` preserved unchanged. Fixes next/image console errors in static export mode.

### backend/.htaccess
Inserted `RewriteCond %{HTTPS} off` + `RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]` after `RewriteEngine On` and before the existing `REQUEST_FILENAME` rules. Authorization header rule at bottom is unchanged.

### frontend/src/components/admin/admin-layout.tsx
- Removed `Clock` import (was only used by APPROVAL QUEUE entry)
- Replaced entire `sidebarItems` array: 12 entries → 11 entries
  - Deleted: APPROVAL QUEUE
  - Renamed: LOGO MARQUEE → PARTNER LOGOS, PRODUCT REGISTRY → CASE STUDIES, BLOG HUB → BLOG POSTS, INSIGHTS & GUIDES → GUIDES, CLIENT LEADS → LEADS, NUDGES & POPUPS → POPUPS, MARKETING BANNERS → BANNERS
  - Fixed hrefs: NEWSLETTER `#` → `/admin/newsletter`, BANNERS `#` → `/admin/banners`, SETTINGS `#` → `/admin/settings`
  - All entries now `status: "Active"` (no more SOON badges)
- Added `overflow-y-auto` to `<nav>` element className

### frontend/src/app/admin/page.tsx
- Deleted `dashboardCategories` constant array (9 entries)
- Deleted `{/* Category Navigation */}` comment and entire pill-tab `<div>` block
- Removed now-unused lucide-react imports: `ArrowRight`, `Mail`, `Settings`, `CheckCircle2`
- Stats grid, Captured Leads panel, and Nudge Campaigns panel untouched

### frontend/src/lib/constants.ts
- Changed `SOCIAL_LINKS` from `Array<{ label: string; href: string }>` to `Array<{ label: string; href?: string }>`
- Removed all four `href: '#'` values — entries now only have `label`

### frontend/src/components/ui/footer-section.tsx
- Removed `href: '#'` property from all four `socialLinks` array entries
- Changed social icon rendering from `<a href={social.href} ...>` to `<span title="Coming soon" ...>`
- Updated className: removed `hover:text-brand hover:border-brand/40 hover:bg-brand/5`, added `cursor-default`

## Decisions Honored

All 12 decisions (D-01 through D-12) from `01-CONTEXT.md` were implemented exactly as specified.

- D-01 through D-12: See "What Was Changed" above for per-decision implementation details.
- Claude's discretion on social icon approach: Used `<span>` element (cleanest — no href, no pointer events needed separately, `cursor-default` on the element itself). Added `title="Coming soon"` tooltip as suggested.

## Verification Results

All 4 automated checks from the plan's `<verification>` block passed:

1. **Build check:** `npm run build` completed successfully with no TypeScript or import errors. All 30+ static pages generated without issue.
2. **Sidebar item count:** `{ name:` appears exactly 11 times in admin-layout.tsx.
3. **Deleted paths:** `frontend/src/app/admin/approvals` and `frontend/src/app/admin/waitlist` do not exist.
4. **No # hrefs:** Neither `constants.ts` nor `footer-section.tsx` contain `href: '#'`.

## Commits

| Hash | Message |
|------|---------|
| f395afc | fix(phase-1): image config, HTTPS redirect, admin sidebar overhaul |
| c654d72 | fix(phase-1): dashboard cleanup, social links fix, delete stub pages |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing cleanup] Removed unused imports after dashboardCategories deletion**
- **Found during:** Task 3
- **Issue:** After removing `dashboardCategories` and the Category Navigation JSX block, four lucide-react imports (`ArrowRight`, `Mail`, `Settings`, `CheckCircle2`) became unused. Leaving unused imports in strict TypeScript mode can cause lint/build warnings and was an implicit consequence of the planned deletion.
- **Fix:** Removed the four unused imports from the `admin/page.tsx` import statement.
- **Files modified:** `frontend/src/app/admin/page.tsx`
- **Commit:** c654d72

Note: `approvals/` and `waitlist/` directories were untracked in git (new files not yet committed), so deletion required no `git rm` — filesystem removal was sufficient.

## Known Stubs

The following stub pages exist intentionally per the plan's CONTEXT.md (D-06):
- `frontend/src/app/admin/banners/page.tsx` — stub page, real functionality in Phase 6
- `frontend/src/app/admin/newsletter/page.tsx` — stub page, real functionality in Phase 6
- `frontend/src/app/admin/settings/page.tsx` — stub page, real functionality in Phase 6

These pages are now correctly linked from the sidebar (real hrefs) but contain placeholder UI. They are tracked as intentional stubs for Phase 6 completion.

Social icons in the footer are visible but non-functional (`<span>` with `cursor-default`). Real URLs will be wired in Phase 6 Settings.

## Self-Check: PASSED
