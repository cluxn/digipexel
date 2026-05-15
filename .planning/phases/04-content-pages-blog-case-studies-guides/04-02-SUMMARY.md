---
phase: 04-content-pages-blog-case-studies-guides
plan: 02
subsystem: frontend/blog
tags: [blog, pagination, sort, filter, newsletter, related-posts]
dependency_graph:
  requires: [04-01]
  provides: [blog-listing-pagination, blog-listing-sort, blog-detail-related-posts, blog-detail-newsletter]
  affects: [frontend/src/app/blog/page.tsx, frontend/src/components/page-clients/blog-details-client.tsx]
tech_stack:
  added: []
  patterns: [client-side-filter-sort-paginate, same-category-related-algorithm, API_BASE_URL-fetch-pattern]
key_files:
  modified:
    - frontend/src/app/blog/page.tsx
    - frontend/src/components/page-clients/blog-details-client.tsx
decisions:
  - "Client-side filter + sort + paginate pipeline (filter > sort > paginate) avoids server roundtrips on category/sort changes"
  - "Related posts algorithm: same-category sorted by recent, padded with any-category, capped at 3 (D-12)"
  - "Newsletter fetch uses API_BASE_URL from @/lib/constants — works in both local dev and production (no hardcoded /backend/api path)"
  - "Reset currentPage to 1 via separate useEffect with [searchQuery, selectedCategory, sortBy] dependencies"
metrics:
  duration_minutes: 45
  completed_date: "2026-05-15"
  tasks_completed: 2
  files_modified: 2
---

# Phase 04 Plan 02: Blog Listing Pagination + Sort + Related Posts + Newsletter Summary

Blog listing upgraded with 10-per-page pagination, Popular/Recent sort buttons, and related posts section plus dark newsletter signup block on the blog detail page — delivering BLOG-02 through BLOG-11.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add pagination and sort to blog listing page | fca0cf9 | frontend/src/app/blog/page.tsx |
| 2 | Add related posts section and newsletter block to blog detail page | 3cfe9dc | frontend/src/components/page-clients/blog-details-client.tsx |

## What Was Built

### Task 1: Blog Listing — Pagination + Sort

**File:** `frontend/src/app/blog/page.tsx`

- Added `position: number` and `status: string` fields to `BlogPost` interface and fallback dummy data
- Added three new state variables: `sortBy` (popular/recent, default popular), `currentPage` (default 1), `PAGE_SIZE = 10`
- Replaced single `filteredPosts` computation with a 3-step pipeline:
  1. **Filter** by searchQuery + selectedCategory
  2. **Sort** by `position ASC` (popular) or `published_at DESC` (recent)
  3. **Paginate** with `slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE)`
- Added `useEffect` to reset `currentPage` to 1 when `searchQuery`, `selectedCategory`, or `sortBy` changes
- Added **Sort Controls** UI (Popular/Recent buttons) between category pills and post grid
- Added **Pagination Controls** UI (prev/numbered pages/next) below post grid, only renders when `totalPages > 1`
- Updated grid render to use `paginatedPosts` instead of `filteredPosts`
- Removed unused `Button` import

### Task 2: Blog Detail — Related Posts + Newsletter Block

**File:** `frontend/src/components/page-clients/blog-details-client.tsx`

- Added `import { API_BASE_URL } from "@/lib/constants"` — required for all fetch calls
- Fixed related posts algorithm: same-category posts sorted by most recent, padded with other-category posts sorted by most recent, capped at 3
- Fixed all `fetch()` calls to use `API_BASE_URL` instead of hardcoded `/backend/api` paths (blogs.php, leads.php, newsletter.php)
- Added `newsletterEmail` and `newsletterStatus` state variables
- Added `submitNewsletter` handler with `idle | sending | sent | error` state transitions
- Added **Related Articles** section (3-column card grid) before `<Footer />`
- Added **Newsletter Block** (`bg-slate-900` dark section) after Related Articles, before `<Footer />`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Fixed initial blog fetch to also use API_BASE_URL**
- **Found during:** Task 2 — while adding API_BASE_URL import for newsletter
- **Issue:** The initial `fetch(`/backend/api/blogs.php?slug=${slug}`)` was also a hardcoded path that would break in any environment where the backend is not on the same origin
- **Fix:** Changed to `fetch(`${API_BASE_URL}/blogs.php?slug=${slug}`)` — consistent with newsletter and all other fetch calls in the component
- **Files modified:** frontend/src/components/page-clients/blog-details-client.tsx
- **Commit:** 3cfe9dc

**2. [Rule 2 - Missing] Fixed leads.php fetch to use API_BASE_URL**
- **Found during:** Task 2 — while reviewing existing code for consistency
- **Issue:** The inline lead form `submitForm` was calling `/backend/api/leads.php` with a hardcoded path
- **Fix:** Changed to `${API_BASE_URL}/leads.php` — consistent with project pattern
- **Files modified:** frontend/src/components/page-clients/blog-details-client.tsx
- **Commit:** 3cfe9dc

## Known Stubs

None — all data flows from the live API (API_BASE_URL) with proper fallback to DEMO_POST/DEMO_RELATED constants when the API is unavailable.

## Self-Check: PASSED

- `frontend/src/app/blog/page.tsx` exists and contains `PAGE_SIZE`, `currentPage`, `sortBy`, `paginatedPosts`, `totalPages`, `setCurrentPage(1)`, `position`
- `frontend/src/components/page-clients/blog-details-client.tsx` exists and contains `sameCategory`, `newsletterEmail`, `API_BASE_URL`, `bg-slate-900`, `Get insights before they become common knowledge`
- No hardcoded `/backend/api/newsletter.php` string in blog-details-client.tsx
- Commits fca0cf9 and 3cfe9dc exist in git history
- TypeScript check: `npx tsc --noEmit` produced no errors on blog files
