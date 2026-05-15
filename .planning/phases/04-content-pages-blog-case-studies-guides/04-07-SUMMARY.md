---
phase: 04-content-pages-blog-case-studies-guides
plan: 07
subsystem: admin, cms, guides
tags: [php, react, nextjs, guides, crud, admin]

requires:
  - phase: 04-01
    provides: guides table schema and base API endpoint
provides:
  - Individual guide save (INSERT/UPDATE by id) via save_guide action in guides.php
  - Individual guide delete (DELETE by id) via delete_guide action in guides.php
  - Admin guides CRUD editor with expandable cards and per-guide save/delete
affects: [admin/guides, backend/api/guides, public /guides pages]

tech-stack:
  added: []
  patterns:
    - expandable card list pattern for admin CRUD (matching blog/case-studies)
    - per-guide save using individual action instead of bulk replace
    - GField helper component for consistent admin form field styling

key-files:
  created: []
  modified:
    - backend/api/guides.php
    - frontend/src/app/admin/guides/page.tsx

key-decisions:
  - save_guide action uses INSERT or UPDATE by id — matches blogs.php save_post pattern
  - GField helper co-located in page file to avoid prop-drilling
  - expandedId tracks expanded card by String(g.id) for saved guides, g.slug for new unsaved

patterns-established:
  - safeFetch used for all API calls in admin guides page
  - expandedId state pattern: String(g.id) when saved, g.slug when new

requirements-completed: [GUIDE-04]

duration: 15min
completed: 2026-05-15
---

# Phase 04 Plan 07: Admin Guides CRUD Editor Summary

**Individual save_guide (INSERT/UPDATE by id) and delete_guide actions added to guides.php; admin guides page rebuilt as expandable card CRUD editor matching the blog admin pattern**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-15T08:00:00Z
- **Completed:** 2026-05-15T08:15:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added  action to  with INSERT (new) or UPDATE (existing by id) logic
- Added  action to  with DELETE WHERE id=?
- Preserved existing  bulk action for backward compatibility
- Rebuilt  as a full per-guide CRUD editor
- Replaced bulk update pattern with individual save/delete per entry
- Added expandable card list with category badge and position display
- All guide fields editable: title, slug, description, content (HTML), image_url, category, cta_label, cta_link, position
- Added  helper component for consistent field styling
- Removed localStorage fallback and all old bulk-save logic
- Wrapped in AdminLayout (sidebar + auth guard)

## Commits

| Task | Description | Hash |
|------|-------------|------|
| Task 1 | Add save_guide and delete_guide to guides.php | 0a6efb2 |
| Task 2 | Rebuild admin guides page as full CRUD editor | a78b37a |

## Files Created/Modified

-  — Added save_guide and delete_guide POST actions
-  — Fully rewritten as per-guide CRUD editor

## Decisions Made

- save_guide action uses  array with id presence check (UPDATE when id present, INSERT when not) — mirrors blogs.php save_post pattern exactly
- GField helper defined as non-exported function co-located in page file
- expandedId uses String(g.id) for saved guides, g.slug for new unsaved — handles transition on first save when id is assigned

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

-  exists and contains save_guide + delete_guide actions
-  exists with save_guide, delete_guide, AdminLayout, safeFetch
- No localStorage or update_guides in frontend file
- Commits 0a6efb2 and a78b37a verified in git log