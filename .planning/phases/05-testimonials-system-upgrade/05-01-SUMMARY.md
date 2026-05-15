---
phase: 05-testimonials-system-upgrade
plan: 01
subsystem: database, api
tags: [php, mysql, testimonials, schema-migration]

# Dependency graph
requires:
  - phase: 04-content-pages-blog-case-studies-guides
    provides: established PHP action-based POST routing pattern and INSERT IGNORE seed idiom
provides:
  - Testimonials GET returns flat array under data key (fixes homepage + testimonials page consumers)
  - star_rating, video_url, logo_url, display_context columns on testimonials table
  - Individual save_testimonial and delete_testimonial POST actions
  - ?with_focus=1 query param for admin to get combined items+focus response
  - 6 professional seed testimonials with varied display_context values
affects:
  - 05-02 (homepage testimonials block connection)
  - 05-03 (testimonials page redesign)
  - admin testimonials page (extended schema fields available)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ALTER TABLE ... ADD COLUMN IF NOT EXISTS — idempotent schema migration without framework"
    - "GET shape decision: flat array by default (?with_focus=1 for structured admin response)"
    - "display_context as CSV string supporting multiple contexts from single DB row"

key-files:
  created: []
  modified:
    - backend/api/testimonials.php
    - backend/init_db.php

key-decisions:
  - "GET returns flat array under data key by default — matches ALL existing frontend consumers (json.data array check)"
  - "?with_focus=1 query param returns structured {items, focus} object for admin page only — preserves backward compat"
  - "display_context is a comma-separated string (homepage,service,testimonials-page) — simple, filter-friendly, no extra join table"
  - "ALTER TABLE ADD COLUMN IF NOT EXISTS used instead of ORM migration — matches PHP no-framework constraint"

patterns-established:
  - "Schema migrations via ALTER TABLE in init_db.php before INSERT IGNORE seeds — runs on page load, idempotent"

requirements-completed: [TEST-02, TEST-03, TEST-04, TADM-01, TADM-02]

# Metrics
duration: 2min
completed: 2026-05-15
---

# Phase 05 Plan 01: Testimonials Schema Extension and GET Shape Fix Summary

**Testimonials PHP API rewritten with flat-array GET response shape, four new columns (star_rating, video_url, logo_url, display_context), individual save/delete actions, and 6 professional seed entries with varied display contexts**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-15T17:19:33Z
- **Completed:** 2026-05-15T17:21:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Fixed the silent GET response shape mismatch that caused ALL three frontend consumers (homepage block, testimonials page, admin) to fall back to hardcoded data
- Added ALTER TABLE migrations for star_rating, video_url, logo_url, display_context columns — runs idempotently on init_db.php load
- Replaced 3 generic seed testimonials with 6 professional entries using real B2B roles, companies, and varied display_context values
- Added save_testimonial (individual upsert by id) and delete_testimonial POST actions alongside preserved bulk update_testimonials

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend testimonials table and fix testimonials.php** - `a6a72df` (feat)

**Plan metadata:** see final commit below

## Files Created/Modified
- `backend/api/testimonials.php` - Rewritten: fixed GET shape, new columns in SELECT/INSERT/UPDATE, individual save/delete actions, ?with_focus=1 param
- `backend/init_db.php` - Added ALTER TABLE for 4 new columns + replaced 3 seeds with 6 professional testimonials

## Decisions Made
- GET returns flat array under `data` key by default — matches `json.data` array check in both `testimonials.tsx` (homepage) and `testimonials/page.tsx`
- `?with_focus=1` query param returns `{ items: [...], focus: [...] }` structured object — admin page uses this to get both in one call
- `display_context` as comma-separated string (`homepage`, `service`, `testimonials-page`) — supports per-row context filtering without extra table
- ALTER TABLE `ADD COLUMN IF NOT EXISTS` syntax — idempotent, safe to re-run, matches no-framework PHP constraint

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. Schema migration runs automatically when init_db.php is visited on Hostinger.

## Next Phase Readiness
- Backend contract is now correct: `{ status: "success", data: [...] }` flat array
- Homepage testimonials block (Plan 02) can now connect to API and render live data
- Testimonials page redesign (Plan 03) has correct API shape + richer seed data with display_context
- Admin page can use `?with_focus=1` to fetch both testimonials and focus items in one request

---
*Phase: 05-testimonials-system-upgrade*
*Completed: 2026-05-15*
