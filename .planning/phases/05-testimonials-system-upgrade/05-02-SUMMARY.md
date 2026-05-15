---
phase: 05-testimonials-system-upgrade
plan: 02
subsystem: admin, frontend
tags: [typescript, react, admin, testimonials, multi-format, display-context]

# Dependency graph
requires:
  - phase: 05-01
    provides: save_testimonial and delete_testimonial POST actions, ?with_focus=1 GET param, star_rating/video_url/logo_url/display_context columns
provides:
  - Admin can create/edit/delete testimonials individually (no accidental bulk-wipe)
  - Admin can set star rating (0-5 or none) per testimonial
  - Admin can set video URL for video-format testimonials
  - Admin can set company logo URL with inline preview
  - Admin can assign display context (homepage, service pages, testimonials page) via checkboxes
affects:
  - 05-03 (testimonials page redesign — same API, richer admin data now available)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-card save button with savingIndex state — avoids blocking UI during individual saves"
    - "display_context as Set toggle — comma-string parsed/serialized on each checkbox change"
    - "Format badge derived from field values (video_url > image_url > text-only) — no separate DB column needed"
    - "?with_focus=1 fetch with dual response shape guard (data.data.items vs Array.isArray)"

key-files:
  created: []
  modified:
    - frontend/src/app/admin/testimonials/page.tsx

key-decisions:
  - "Removed global 'Publish Changes' button — individual save per card is the only path, preventing accidental bulk-delete"
  - "API_BASE_URL imported explicitly from @/lib/constants — removes implicit global dependency"
  - "Format badge derived dynamically (not stored) — video_url present = Video, image_url present = Image, else Text Only"
  - "savingIndex tracks which card is saving (null when none) — enables per-card loading state without extra state arrays"

# Metrics
duration: 1min
completed: 2026-05-15
---

# Phase 05 Plan 02: Admin Testimonials Multi-Format Form Rewrite Summary

**Admin testimonials page rewritten with individual save/delete API calls, star rating selector (0-5), video URL field, company logo URL with preview, and display context checkboxes (homepage/service/testimonials-page) — bulk replace eliminated**

## Performance

- **Duration:** 1 min
- **Started:** 2026-05-15T17:23:02Z
- **Completed:** 2026-05-15T17:24:49Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced bulk `update_testimonials` action with `save_testimonial` individual upsert per card — one save no longer overwrites others
- Added `delete_testimonial` API call in `removeTestimonial` (was previously local-state-only filter with no API call)
- Added star rating selector rendering 6 clickable buttons (None + 1★–5★) with active state highlighting
- Added video URL input with purple indicator badge when set ("card will render as video format")
- Added company logo URL input with 32px inline preview image and load-error handling
- Added display context checkboxes (Homepage Block / Service Pages / Testimonials Page) with pill-style toggle UI
- Changed fetch URL from `/testimonials.php` to `/testimonials.php?with_focus=1` with dual response shape guard
- Added explicit `import { API_BASE_URL } from "@/lib/constants"` — previous page used it as an undeclared global

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite admin testimonials page with multi-format form fields** - `25312c2` (feat)

**Plan metadata:** see final commit below

## Files Created/Modified
- `frontend/src/app/admin/testimonials/page.tsx` - Rewritten: individual save/delete, star_rating selector, video_url field, logo_url field with preview, display_context checkboxes, ?with_focus=1 fetch, explicit API_BASE_URL import

## Decisions Made
- Global "Publish Changes" button removed — per-card Save is the only save path (prevents accidental bulk-delete, matches TADM-01/02 requirement for individual saves)
- `savingIndex: number | null` tracks which card is currently saving — provides targeted loading state without blocking other cards
- Format badge (Video/Image/Text Only) derived from `video_url` and `image_url` field values at render time — no separate DB column needed
- `API_BASE_URL` imported from `@/lib/constants` explicitly — fixes implicit global that would break in strict mode builds

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None — changes are frontend-only. Backend API (from Plan 01) is already deployed.

## Known Stubs
None — all form fields are wired to real `save_testimonial` / `delete_testimonial` API actions from Plan 01. No placeholder data paths remain in the new form.

## Next Phase Readiness
- Admin can now manage testimonials with full multi-format control
- Plan 03 (testimonials page redesign) has all the data it needs: rich seed data from Plan 01 + display_context filtering support
- Homepage testimonials block (if Plan 02 targets that) can filter by `display_context` containing "homepage"

---
*Phase: 05-testimonials-system-upgrade*
*Completed: 2026-05-15*
