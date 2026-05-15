---
phase: 04-content-pages-blog-case-studies-guides
plan: "04"
subsystem: frontend/guides
tags: [guides, listing, pagination, filter, sort, newsletter, content-rendering]
dependency_graph:
  requires: [04-01]
  provides: [GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-05]
  affects: [frontend/src/app/guides/page.tsx, frontend/src/components/page-clients/guide-client.tsx]
tech_stack:
  added: []
  patterns: [client-side pagination, category-filter-chips, sort-buttons, dangerouslySetInnerHTML prose, newsletter-signup-block]
key_files:
  created: []
  modified:
    - frontend/src/app/guides/page.tsx
    - frontend/src/components/page-clients/guide-client.tsx
decisions:
  - "Guide cards navigate to /guides/{id} via absolute Link overlay; CTA bottom area replaced with div+ArrowRight (no cta_link href) per D-21"
  - "Category chips derived from loaded guide.category values at render time — no hardcoded category list"
  - "Guide detail uses dangerouslySetInnerHTML for guide.content HTML prose — consistent with blog approach"
  - "Newsletter block uses API_BASE_URL from @/lib/constants (not hardcoded path) — works in both local dev and production"
  - "Guide detail ends with newsletter block then Footer; no Connect CTA per D-07/D-08"
  - "Recent sort falls back to position DESC since guides table has no published_at column"
metrics:
  duration: 12
  completed_date: "2026-05-15"
  tasks_completed: 2
  files_modified: 2
---

# Phase 04 Plan 04: Guides Listing + Detail Upgrade Summary

Upgraded guides listing with 10-per-page numbered pagination, category filter chips derived from live data, Popular/Recent sort buttons, and fixed card navigation to /guides/{id}. Rebuilt guide detail client to render full guide.content as HTML prose and added a dark newsletter signup block posting to API_BASE_URL/newsletter.php.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Add pagination, category filter, sort, fix card links in guides listing | 4e4f257 | frontend/src/app/guides/page.tsx |
| 2 | Rebuild guide detail with content rendering and newsletter block | fd35ac1 | frontend/src/components/page-clients/guide-client.tsx |

## What Was Built

### Task 1 — Guides Listing (guides/page.tsx)
- Added `PAGE_SIZE = 10` constant and `currentPage` state for numbered pagination controls (Prev / page buttons / Next)
- Added `selectedCategory` state with derived category chips from `guides.map(g => g.category)` — no hardcoded list
- Added `sortBy` state (`"popular" | "recent"`) with Sort toggle buttons
- Replaced single `filteredGuides` with 3-step pipeline: filter (search + category) → sort (position asc/desc) → paginate (slice)
- Added `useEffect` to reset `currentPage` to 1 whenever search query, category, or sort changes
- Fixed `GuideCard` CTA: removed `<a href={guide.cta_link}>` anchor at bottom, replaced with `<div>` showing label + ArrowRight icon; card navigates via existing absolute `<Link href={/guides/${guide.id}}>` overlay
- Removed unused imports: `Button`, `Download`, `BookOpen`

### Task 2 — Guide Detail (guide-client.tsx)
- Added `import { API_BASE_URL } from "@/lib/constants"` — no hardcoded backend path
- Updated `safeFetch` call to use `${API_BASE_URL}/guides.php` (was `/backend/api/guides.php`)
- Added `newsletterEmail` and `newsletterStatus` state
- Added `submitNewsletter` handler posting JSON to `${API_BASE_URL}/newsletter.php`
- Replaced minimal title/description JSX with full hero layout: category Badge, h1, description, optional cover image in 2-column grid
- Added `dangerouslySetInnerHTML` prose block for `guide.content` HTML rendering with Tailwind Typography classes
- Added dark newsletter section (`bg-slate-900`) with email input, Subscribe button, sent/error states
- Removed unused imports: `Button`, `motion`, `Connect`, `CheckCircle2`, `ArrowRight`, `FileText`, `Sparkles`, `Zap`, `ShieldCheck`, `Link`

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — guide.content renders real HTML from DB; newsletter posts to real endpoint via API_BASE_URL.

## Self-Check: PASSED

Files exist:
- frontend/src/app/guides/page.tsx — FOUND
- frontend/src/components/page-clients/guide-client.tsx — FOUND

Commits exist:
- 4e4f257 — FOUND (feat(04-04): add pagination, category filter, sort to guides listing)
- fd35ac1 — FOUND (feat(04-04): rebuild guide detail with content rendering and newsletter block)
