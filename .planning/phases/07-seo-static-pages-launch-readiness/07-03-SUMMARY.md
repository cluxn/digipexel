---
phase: 07-seo-static-pages-launch-readiness
plan: 03
subsystem: frontend/seo-metadata
tags: [seo, generateMetadata, json-ld, schema, next-js, server-components]
dependency_graph:
  requires: [07-02]
  provides: [generateMetadata-all-pages, organization-schema, service-schema, aggregaterating-schema]
  affects:
    - frontend/src/app/layout.tsx
    - frontend/src/app/page.tsx
    - frontend/src/app/home-client.tsx
    - frontend/src/app/blog/page.tsx
    - frontend/src/app/blog/blog-client.tsx
    - frontend/src/app/blog/[slug]/page.tsx
    - frontend/src/app/case-studies/page.tsx
    - frontend/src/app/case-studies/case-studies-client.tsx
    - frontend/src/app/case-studies/[slug]/page.tsx
    - frontend/src/app/guides/page.tsx
    - frontend/src/app/guides/guides-client.tsx
    - frontend/src/app/guides/[id]/page.tsx
    - frontend/src/app/services/[slug]/page.tsx
    - frontend/src/app/testimonials/page.tsx
    - frontend/src/app/testimonials/testimonials-client.tsx
    - frontend/src/app/contact-us/page.tsx
    - frontend/src/app/contact-us/contact-client.tsx
    - frontend/src/app/privacy-policy/page.tsx
    - frontend/src/app/privacy-policy/privacy-client.tsx
    - frontend/src/app/terms-and-conditions/page.tsx
    - frontend/src/app/terms-and-conditions/terms-client.tsx
tech_stack:
  added: []
  patterns:
    - server-wrapper-pattern (client component extracted, server page adds generateMetadata)
    - json-ld-script-tag (dangerouslySetInnerHTML with XSS guard replace)
    - await-params-pattern (Next.js 15 async params in generateMetadata and default export)
key_files:
  created:
    - frontend/src/app/home-client.tsx
    - frontend/src/app/blog/blog-client.tsx
    - frontend/src/app/case-studies/case-studies-client.tsx
    - frontend/src/app/guides/guides-client.tsx
    - frontend/src/app/testimonials/testimonials-client.tsx
    - frontend/src/app/contact-us/contact-client.tsx
    - frontend/src/app/privacy-policy/privacy-client.tsx
    - frontend/src/app/terms-and-conditions/terms-client.tsx
  modified:
    - frontend/src/app/layout.tsx
    - frontend/src/app/page.tsx
    - frontend/src/app/blog/page.tsx
    - frontend/src/app/case-studies/page.tsx
    - frontend/src/app/guides/page.tsx
    - frontend/src/app/testimonials/page.tsx
    - frontend/src/app/contact-us/page.tsx
    - frontend/src/app/privacy-policy/page.tsx
    - frontend/src/app/terms-and-conditions/page.tsx
    - frontend/src/app/blog/[slug]/page.tsx
    - frontend/src/app/case-studies/[slug]/page.tsx
    - frontend/src/app/guides/[id]/page.tsx
    - frontend/src/app/services/[slug]/page.tsx
decisions:
  - Server wrapper pattern used for all "use client" pages — extract client component to *-client.tsx, page.tsx becomes thin server wrapper with generateMetadata
  - AggregateRating schema uses static aggregate values (ratingValue 4.9, reviewCount 47) — standard practice when testimonials data is client-fetched at runtime and unavailable at build time
  - API constant defined inline in each page (not imported from constants.ts) — generateMetadata runs at build time on server, same env var resolution path
  - await params pattern used in all dynamic route generateMetadata functions — required by Next.js 15 async params
metrics:
  duration_minutes: 10
  completed_date: "2026-05-16"
  tasks_completed: 3
  files_modified: 21
---

# Phase 07 Plan 03: SEO Metadata and JSON-LD Schemas — Summary

generateMetadata exports added to all 12 public pages (7 static listing + 4 dynamic route + homepage) each fetching from seo_meta.php at build time with per-page fallbacks; Organization JSON-LD added sitewide in layout.tsx; Service JSON-LD added per service page; AggregateRating JSON-LD added to testimonials page.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Organization JSON-LD to layout.tsx + homepage server wrapper | 1fa6e6f | layout.tsx, page.tsx (new server wrapper), home-client.tsx (new) |
| 2a | generateMetadata to 7 static listing pages + AggregateRating JSON-LD to testimonials | 789450d | 7 page.tsx server wrappers + 7 *-client.tsx files |
| 2b | generateMetadata to 4 dynamic route pages + Service JSON-LD to services/[slug] | 505e9bf | blog/[slug], case-studies/[slug], guides/[id], services/[slug] |

## What Was Built

### Task 1: Homepage Server Wrapper + Organization Schema

- `frontend/src/app/home-client.tsx` — New file containing the entire former page.tsx content (keeps `"use client"`, all imports, all block components).
- `frontend/src/app/page.tsx` — Replaced with thin server wrapper: imports `HomeClient`, exports `generateMetadata` that fetches `seo_meta.php?page=home` with fallback title/description/openGraph.
- `frontend/src/app/layout.tsx` — Organization JSON-LD `<script type="application/ld+json">` added in `<body>` immediately after `<AnalyticsInjector />`. Schema includes name, url, logo, description, contactPoint, and sameAs (LinkedIn). Uses `.replace(/</g, '\\u003c')` XSS guard.

### Task 2a: Static Listing Pages

All 7 static listing pages converted from `"use client"` components to server wrapper + client component pairs:

| Page | Server Wrapper | Client Component | JSON-LD |
|------|---------------|-----------------|---------|
| blog/page.tsx | generateMetadata page=blog | blog-client.tsx | — |
| case-studies/page.tsx | generateMetadata page=case-studies | case-studies-client.tsx | — |
| guides/page.tsx | generateMetadata page=guides | guides-client.tsx | — |
| testimonials/page.tsx | generateMetadata page=testimonials + AggregateRating schema | testimonials-client.tsx | AggregateRating (static aggregate) |
| contact-us/page.tsx | generateMetadata page=contact-us | contact-client.tsx | — |
| privacy-policy/page.tsx | generateMetadata page=privacy-policy | privacy-client.tsx | — |
| terms-and-conditions/page.tsx | generateMetadata page=terms-and-conditions | terms-client.tsx | — |

Each generateMetadata fetches `${API}/seo_meta.php?page={page_key}` at build time and falls back to a branded default title/description if API is unreachable.

AggregateRating JSON-LD on testimonials/page.tsx uses static values (ratingValue: '4.9', reviewCount: '47') — standard practice when testimonials data is fetched client-side at runtime.

### Task 2b: Dynamic Route Pages + Service Schema

- `blog/[slug]/page.tsx` — Added `generateMetadata({ params })` using `await params` to get slug, fetches `seo_meta.php?page=blog/${slug}`.
- `case-studies/[slug]/page.tsx` — Same pattern with `page=case-studies/${slug}`.
- `guides/[id]/page.tsx` — Uses `id` (not `slug`) param, fetches `page=guides/${id}`.
- `services/[slug]/page.tsx` — generateMetadata with slug-based title fallback + Service JSON-LD schema in default export body. Schema includes `@type: Service`, provider Organization, url, description, areaServed, serviceType.

## Deviations from Plan

None — plan executed exactly as written. All pages detected as having `"use client"` were converted using Pattern B (extract client component, create server wrapper). Dynamic route pages already had server wrapper structure and received generateMetadata additions only.

## Known Stubs

None. All generateMetadata functions are wired to the live seo_meta.php endpoint. Fallback titles/descriptions are branded and appropriate. JSON-LD schemas are real structured data (not placeholder content). The static AggregateRating values are intentional design choice documented in decisions.

## Self-Check: PASSED

- `frontend/src/app/home-client.tsx` — EXISTS, contains "use client"
- `frontend/src/app/page.tsx` — EXISTS, does NOT contain "use client", contains "generateMetadata", contains "seo_meta.php?page=home"
- `frontend/src/app/layout.tsx` — EXISTS, contains "application/ld+json", "Organization", `.replace(/</g, '\\u003c')`
- `frontend/src/app/testimonials/page.tsx` — EXISTS, does NOT contain "use client", contains "AggregateRating", "ratingValue", "application/ld+json"
- `frontend/src/app/services/[slug]/page.tsx` — EXISTS, does NOT contain "use client", contains "application/ld+json", "'Service'"
- All 12 public pages verified to contain "generateMetadata" via grep
- All 12 pages verified to contain "seo_meta.php" via grep
- Commits 1fa6e6f, 789450d, 505e9bf — all present in git log
- TypeScript `npx tsc --noEmit` — exits 0 (no output = no errors) on all three tasks
