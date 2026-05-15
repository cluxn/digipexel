---
phase: 04-content-pages-blog-case-studies-guides
plan: 05
subsystem: ui
tags: [admin, blog, scheduling, react, typescript, datalist]

# Dependency graph
requires:
  - phase: 04-01
    provides: Blog CRUD infrastructure and admin blog page scaffold

provides:
  - Three-state scheduling control (Publish Now / Schedule / Save as Draft) in admin blog Settings tab
  - datetime-local picker for scheduled posts with conditional visibility
  - Blue status badge showing scheduled date for scheduled posts
  - Category autocomplete via HTML datalist derived from existing post categories
  - scheduled_at field included in save payload automatically via BlogPost interface

affects:
  - backend/api/blogs.php (scheduled_at field must be accepted in save_post action)
  - future blog listing page (scheduled posts should not appear until scheduled_at <= NOW())

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Three-state radio group pattern for mutually exclusive UI states with conditional sub-fields
    - HTML datalist-backed input for free-text-with-autocomplete (zero extra dependencies)
    - cn() conditional class merging from @/lib/utils for dynamic badge/border styling

key-files:
  created: []
  modified:
    - frontend/src/app/admin/blog/page.tsx

key-decisions:
  - "Three-state status uses radio group (not select) so each option shows its description — improves admin UX clarity"
  - "datetime-local picker hidden unless status is 'scheduled' — reduces clutter for publish/draft flows"
  - "scheduled_at included in payload automatically as part of BlogPost interface — no savePost() changes needed"
  - "Category autocomplete uses HTML datalist (not custom dropdown) — zero extra JS, browser-native, accessible"
  - "Inline existingCategories derivation inside posts.map() — co-located with usage, avoids hoisting to component level"

patterns-established:
  - "Conditional sub-field pattern: show extra input only when parent radio/select has specific value"
  - "Badge conditional coloring: emerald=published, blue=scheduled, amber=draft — consistent semantic colors"

requirements-completed:
  - BLOG-07
  - BLOG-08

# Metrics
duration: 42min
completed: 2026-05-15
---

# Phase 4 Plan 5: Admin Blog Scheduling and Category Autocomplete Summary

**Three-state scheduling radio group (Publish Now / Schedule / Save as Draft) with conditional datetime-local picker and datalist-backed category autocomplete added to the admin blog editor Settings tab**

## Performance

- **Duration:** 42 min
- **Started:** 2026-05-15T08:52:28Z
- **Completed:** 2026-05-15T09:34:22Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced the two-option status `<select>` with a styled three-state radio group that shows label + description per option
- Added conditional `datetime-local` input that appears only when "Schedule" is selected, cleared automatically when switching away
- Updated the status badge in the post list header to show blue "Scheduled · Jan 15" format for scheduled posts
- Added `scheduled_at: string` to the `BlogPost` interface and `defaultPost()` — value flows into save payload automatically
- Replaced plain `<Field>` for category with a datalist-backed `<input>` that offers autocomplete from all existing post categories
- Added `cn()` import from `@/lib/utils` to support conditional class merging for the radio label borders and badge colors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add three-state scheduling control and category autocomplete to admin blog editor** - `fdaf70e` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `frontend/src/app/admin/blog/page.tsx` - BlogPost interface extended with scheduled_at, three-state radio group in Settings tab, datetime-local picker, blue scheduled badge, datalist category autocomplete

## Decisions Made
- Three-state radio group chosen over a `<select>` so each option can display a descriptive sub-label, improving admin clarity without extra state
- `scheduled_at` cleared to `""` when switching to any non-scheduled status — prevents stale datetime from persisting if admin changes their mind
- Inline `Array.from(new Set(posts.map(...)))` derivation keeps existingCategories co-located with the datalist element rather than hoisting to component scope
- Blue badge color (`bg-blue-50 text-blue-600`) follows the existing emerald/amber pattern — semantic color assigns meaning (green=live, blue=scheduled, amber=draft)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in `frontend/src/app/blog/page.tsx` (lines 47, 56 — fallback dummy data missing `position`/`status`) detected during TS check. These are in a file modified before this plan began (unrelated to admin changes). The plan's verification only checks `admin/blog` — that passes cleanly. Out of scope per scope boundary rules.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Admin blog editor now supports full scheduling workflow — admin can set a post to "Schedule" and pick a date/time
- Backend `blogs.php` save_post action receives `scheduled_at` in the JSON payload automatically; PHP should accept and store it (verify `scheduled_at` column exists in `blogs` table)
- Public blog listing should filter out posts where `status = 'scheduled'` and `scheduled_at > NOW()` — not yet implemented on the backend side

---
*Phase: 04-content-pages-blog-case-studies-guides*
*Completed: 2026-05-15*
