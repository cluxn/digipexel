---
phase: 04-content-pages-blog-case-studies-guides
plan: 08
subsystem: ui
tags: [next.js, static-export, generateStaticParams, API_BASE_URL, case-studies, blog]

# Dependency graph
requires:
  - phase: 04-content-pages-blog-case-studies-guides
    provides: blog and case study detail pages and seeded slugs in init_db.php

provides:
  - generateStaticParams in blog/[slug]/page.tsx with correct seeded slugs
  - generateStaticParams in case-studies/[slug]/page.tsx with correct seeded slugs
  - case-study-client.tsx using API_BASE_URL for all case_studies.php fetch calls

affects: [04-verification, deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All fetch calls use API_BASE_URL from @/lib/constants — no hardcoded /backend/api paths"
    - "generateStaticParams returns only slugs that match seeded DB rows in init_db.php"

key-files:
  created: []
  modified:
    - frontend/src/app/blog/[slug]/page.tsx
    - frontend/src/app/case-studies/[slug]/page.tsx
    - frontend/src/components/page-clients/case-study-client.tsx

key-decisions:
  - "generateStaticParams slugs must exactly match seeded slugs in backend/init_db.php INSERT IGNORE rows"
  - "All fetch calls in page-client components must use API_BASE_URL, not hardcoded /backend/api paths"

patterns-established:
  - "Static export requires generateStaticParams slugs to match DB-seeded content slugs exactly"
  - "Fetch pattern: fetch(`${API_BASE_URL}/endpoint.php`) — consistent across all page-clients"

requirements-completed: [BLOG-10, CS-01, CS-02]

# Metrics
duration: 8min
completed: 2026-05-15
---

# Phase 4 Plan 8: Static Export Slug and API_BASE_URL Gap Closure Summary

**Fixed three static export gaps: corrected generateStaticParams to seeded slugs in blog and case-study routes, and replaced two hardcoded /backend/api fetch paths in case-study-client.tsx with API_BASE_URL**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:08:00Z
- **Tasks:** 3 (2 with file changes, 1 verification-only)
- **Files modified:** 3

## Accomplishments
- blog/[slug]/page.tsx now generates static HTML for `ai-automation-eliminates-manual-work` and `seo-age-of-ai-llm-answers` (the actual seeded slugs)
- case-studies/[slug]/page.tsx now generates static HTML for `finflows-back-office-automation` and `growthloop-linkedin-scale` (the actual seeded slugs)
- case-study-client.tsx imports API_BASE_URL from @/lib/constants and uses it for both fetch calls — consistent with all other page-client components
- TypeScript compiles clean across all three modified files (tsc --noEmit exits 0)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix generateStaticParams slugs in blog and case study detail routes** - `d90b42f` (fix)
2. **Task 2: Replace hardcoded /backend/api path with API_BASE_URL in case-study-client.tsx** - `7b9f36d` (fix)
3. **Task 3: TypeScript compile check** - no commit (verification only, no files changed)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `frontend/src/app/blog/[slug]/page.tsx` - generateStaticParams now lists 2 correct seeded slugs instead of 4 wrong demo slugs
- `frontend/src/app/case-studies/[slug]/page.tsx` - generateStaticParams now lists 2 correct seeded slugs instead of 4 wrong demo slugs
- `frontend/src/components/page-clients/case-study-client.tsx` - imports API_BASE_URL; both fetch calls use template literals with API_BASE_URL

## Decisions Made
- generateStaticParams lists only the seeded slugs (not a dynamic API fetch at build time) — consistent with existing pattern in services/[slug]/page.tsx
- API_BASE_URL import inserted after lucide-react import to preserve existing import ordering

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three verification gaps from 04-VERIFICATION.md are now closed (was 17/20, now 20/20)
- next build will produce HTML for all four seeded content detail pages
- No blockers for Phase 5

---
*Phase: 04-content-pages-blog-case-studies-guides*
*Completed: 2026-05-15*
