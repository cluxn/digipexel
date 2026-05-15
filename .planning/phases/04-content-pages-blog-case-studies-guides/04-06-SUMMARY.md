---
phase: 04-content-pages-blog-case-studies-guides
plan: "06"
subsystem: admin-cms
tags: [admin, case-studies, crud, editor]
dependency_graph:
  requires:
    - 04-01 (blog admin editor pattern)
  provides:
    - CS-03: admin can create and manage all case study content
  affects:
    - frontend/src/app/admin/case-studies/page.tsx
tech_stack:
  added: []
  patterns:
    - AdminLayout wrapper for auth guard + sidebar
    - safeFetch for API calls
    - Expandable card pattern with tab system (info/hero/sections/settings)
    - Section type registry with buildDefaultSection factory
key_files:
  created: []
  modified:
    - frontend/src/app/admin/case-studies/page.tsx
decisions:
  - Admin case studies page wraps in AdminLayout for auth guard consistency with other admin pages
  - AdminLayout missing from case-studies page while all other admin content pages use it — added as deviation Rule 2 (missing critical auth protection)
  - Existing action names (save_case, delete_case) and payload key (case:) already matched backend contract — preserved exactly
metrics:
  duration: 37
  completed_date: "2026-05-15"
  tasks: 1
  files: 1
---

# Phase 04 Plan 06: Admin Case Studies CRUD Editor Summary

**One-liner:** Admin case studies page wrapped in AdminLayout with full CRUD: expandable cards, Info/Hero/Sections/Settings tabs, hero stats grid, 11 section types, save_case + delete_case backend contract.

## What Was Built

The admin case studies page at `frontend/src/app/admin/case-studies/page.tsx` was updated to add `AdminLayout` wrapper and fix a TypeScript type cast.

The existing file was already a complete CRUD editor with:
- Correct backend action names: `save_case` (not `save_case_study`), `delete_case` (not `delete_case_study`)
- Correct payload key: `{ action: "save_case", case: cs }` (not `case_study:`)
- `hero_stats` editor in a dedicated "Hero & Stats" tab with add/remove/value+label edit, up to 4 stats, dark preview strip
- `CaseSection` interface with all section fields (comparison, metrics, timeline, testimonial, tech_stack, image_gallery, etc.)
- 11 section types selectable from a type picker grid
- `safeFetch` from `@/lib/utils` for all API calls
- Status badge (published/draft), featured badge in list view
- Info tab with eyebrow, slug, read time, title, subtitle, description, client name, industry, published date, service tags, image fields
- Settings tab with featured toggle, show_related, show_industry_section, status select, position, preview URL

**Key change made:** Added `import AdminLayout from "@/components/admin/admin-layout"` and wrapped the loading state return and main return in `<AdminLayout>`. Also fixed TypeScript: replaced `as any` with typed cast `as "published" | "draft"`.

## Acceptance Criteria — All Passed

- [x] Contains `save_case` as action value (NOT `save_case_study`)
- [x] Contains payload key `case:` (NOT `case_study:`) in saveCase() POST body
- [x] Contains `hero_stats` state field and editor UI
- [x] Contains `CaseSection` interface
- [x] Contains `AdminLayout` import and wraps return value
- [x] Contains `delete_case` action in removeCase() (NOT `delete_case_study`)
- [x] Contains sections tab with "Add Section" button
- [x] Contains safeFetch import from `@/lib/utils`
- [x] Does NOT contain `save_case_study` or `delete_case_study`

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rebuild admin case studies page as full CRUD editor | 66224a8 | frontend/src/app/admin/case-studies/page.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added AdminLayout wrapper**
- **Found during:** Task 1 — existing file had no AdminLayout
- **Issue:** All other admin content pages (guides, testimonials, logos, leads, site-content, services, dashboard) use AdminLayout for sidebar navigation and auth guard. The case-studies page was missing this, leaving it without the standard admin shell.
- **Fix:** Added `import AdminLayout from "@/components/admin/admin-layout"` and wrapped both the loading state return and the main return in `<AdminLayout>`.
- **Files modified:** frontend/src/app/admin/case-studies/page.tsx
- **Commit:** 66224a8

**2. [Rule 1 - Bug] Fixed TypeScript `as any` type cast**
- **Found during:** Task 1 — existing file used `as any` for status select onChange
- **Fix:** Replaced `e.target.value as any` with properly typed `e.target.value as "published" | "draft"`
- **Files modified:** frontend/src/app/admin/case-studies/page.tsx
- **Commit:** 66224a8

## Known Stubs

None — the page is a fully functional admin CRUD editor. All API calls use real endpoints. No hardcoded demo data flows to UI rendering.

## Self-Check: PASSED

- File exists: frontend/src/app/admin/case-studies/page.tsx — FOUND
- Commit 66224a8 — FOUND
- save_case action — FOUND
- AdminLayout import and usage — FOUND
- hero_stats — FOUND
- CaseSection interface — FOUND
- delete_case — FOUND
- No save_case_study or delete_case_study — CONFIRMED ABSENT
