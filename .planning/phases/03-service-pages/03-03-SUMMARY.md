---
phase: 03-service-pages
plan: "03"
subsystem: ui
tags: [react, nextjs, typescript, static-export, api-fetch, safeFetch, useState, useEffect]

# Dependency graph
requires:
  - phase: 03-02
    provides: service_content.php GET endpoint returning hero/features/roadmap/market_impact/cta/testimonials blobs per slug
provides:
  - Hybrid client service page that renders SERVICES[slug] immediately then silently merges API data into 6 typed section states
  - Connect CTA component extended with optional badge/title/copy props using ?? fallback to hardcoded defaults
affects:
  - 03-04-admin-services-editor

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hybrid static+API pattern: render SERVICES[slug] on mount (zero latency), replace fields with API data in useEffect (no loading state)"
    - "Section state typed interfaces matching RESEARCH.md canonical field names — each section has its own typed state object"
    - "Optional prop override with ?? fallback: badge ?? 'Deployment Ready' — downstream component stays functional when parent provides nothing"

key-files:
  created: []
  modified:
    - frontend/src/app/services/[slug]/page.tsx
    - frontend/src/components/blocks/connect-cta.tsx

key-decisions:
  - "6 separate useState objects (one per section) rather than one merged state — each section updates independently on API success, isolated re-renders"
  - "Empty object initial state for all section states — API fields are optional so ?? staticData.field fallback handles undefined gracefully without null checks"
  - "Icons kept from staticData.features[i].icon — icons are hardcoded per D-14, only title/description come from API"
  - "ctaSecondary field not rendered per D-20 lock — single CTA button only"
  - "Comparison section (gapHeading/gapLeft/gapRight) stays hardcoded from staticData per D-13 lock — service-specific gap content not in admin scope"

patterns-established:
  - "Hybrid client pattern: 'use client' + generateStaticParams + React.use(params) coexist — static params for build-time pre-render, client hooks for runtime API fetch"
  - "Section interface naming: HeroSectionData, FeaturesSectionData, RoadmapSectionData, MarketImpactSectionData, CtaSectionData, TestimonialsSectionData — Plan 04 admin must match these names"
  - "Connect optional props: badge?, title?, copy? — Plan 04 passes ctaData.ctaBadge/ctaTitle/ctaCopy from service_content API"

requirements-completed: [SVC-01, SVC-02, SVC-06, SVC-08]

# Metrics
duration: 4min
completed: 2026-05-15
---

# Phase 03 Plan 03: Service Pages Summary

**Hybrid client service page with API fetch + SERVICES fallback across 6 typed section states, and Connect CTA extended with per-service badge/title/copy prop overrides**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-15T07:41:53+05:30
- **Completed:** 2026-05-15T07:45:00+05:30
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Extended ConnectProps with badge?, title?, copy? — non-homepage path uses ?? fallback to hardcoded defaults; homepage path is fully untouched
- Converted services/[slug]/page.tsx to a "use client" component with 6 typed section states, a single useEffect fetch against service_content.php?slug={slug}, and ?? fallback merging for every field
- Preserved generateStaticParams (all 11 slugs pre-render at build time) and React.use(params) (required for "use client" + Promise params) exactly as-is
- Verified all hero and feature card "Get Started" buttons link to /contact-us (SVC-02); all 6 section eyebrow badges confirmed present (SVC-01/SVC-08)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Connect component with optional badge, title, copy props** - `5f99f6e` (feat)
2. **Task 2: Convert service page to hybrid client component with API fetch and section state** - `9e7d058` (feat)

## Files Created/Modified

- `frontend/src/components/blocks/connect-cta.tsx` - Added badge?, title?, copy? to ConnectProps; updated function signature; non-homepage render path uses props with ?? hardcoded fallbacks; homepage path unchanged
- `frontend/src/app/services/[slug]/page.tsx` - Added "use client", useState/useEffect, safeFetch + API_BASE_URL imports, 6 typed section interfaces, 6 section states, useEffect fetching service_content.php, ?? fallback wiring for all 6 sections, Connect call now passes ctaData.ctaBadge/ctaTitle/ctaCopy

## Section State Field Names (for Plan 04 admin page reference)

| State variable | Type | API section key | Key fields |
|---|---|---|---|
| heroData | HeroSectionData | res.data.hero | badge, heroLine1, heroLine2, heroCopy, ctaPrimary, pills, snapshotTitle, snapshotRows, statLabel1, statValue1, statLabel2, statValue2 |
| featuresData | FeaturesSectionData | res.data.features | cards: [{ title, description }] |
| roadmapData | RoadmapSectionData | res.data.roadmap | roadmapTitle, roadmapTitleAccent, roadmapCopy, items: [{ step, title, desc }] |
| marketData | MarketImpactSectionData | res.data.market_impact | outcomesTitle, outcomesTitleAccent, outcomesCopy, cards: [{ quote, company, sector, metricValue, metricLabel }], stats: [{ value, label }] |
| ctaData | CtaSectionData | res.data.cta | ctaBadge, ctaTitle, ctaCopy |
| testimonialsData | TestimonialsSectionData | res.data.testimonials | items: [{ quote, role, company }] |

## Connect Prop Names Added (for Plan 04 reference)

```typescript
interface ConnectProps {
  variant?: "dark" | "light";
  isHomepage?: boolean;
  badge?: string;   // maps to ctaData.ctaBadge from service_content API
  title?: string;   // maps to ctaData.ctaTitle from service_content API
  copy?: string;    // maps to ctaData.ctaCopy from service_content API
}
```

## Decisions Made

- 6 separate useState objects (one per section) rather than one merged state object — each section updates independently, isolated re-renders per API section
- Empty object `{}` initial state for all section states — API fields are all optional, ?? staticData.field fallback handles undefined without null checks
- Icons stay from staticData.features[i].icon (D-14 locked) — only title/description come from API for feature cards
- ctaSecondary field not rendered (D-20 locked) — single primary CTA button only
- Comparison section stays hardcoded from staticData (D-13 locked) — service-specific gap analysis not in admin scope for this phase

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. All 6 section states wire to real API data from service_content.php (seeded in Plan 03-02 with 66 rows). When API fetch fails, SERVICES[slug] static fallback renders — this is intentional behavior, not a stub.

## Next Phase Readiness

- Plan 03-04 (admin services editor) can now reference the 6 section state field names and Connect prop names documented above
- service_content.php GET endpoint (Plan 03-02) is the data source — admin page POSTs to the same endpoint using update_service action
- All 11 service page slugs pre-render at build time via generateStaticParams — static export compatibility maintained

---
*Phase: 03-service-pages*
*Completed: 2026-05-15*

## Self-Check: PASSED

- FOUND: frontend/src/components/blocks/connect-cta.tsx
- FOUND: frontend/src/app/services/[slug]/page.tsx
- FOUND: .planning/phases/03-service-pages/03-03-SUMMARY.md
- FOUND commit: 5f99f6e (feat(03-03): extend Connect component with optional badge, title, copy props)
- FOUND commit: 9e7d058 (feat(03-03): convert service page to hybrid client component with API fetch)
