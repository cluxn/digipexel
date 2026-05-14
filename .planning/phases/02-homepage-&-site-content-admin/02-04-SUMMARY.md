---
phase: 02-homepage-site-content-admin
plan: 04
subsystem: frontend-api-integration
tags: [react, next.js, safeFetch, api-integration, testimonials, footer, whatsapp, hero, stats, newsletter]

# Dependency graph
requires:
  - phase: 02-01
    provides: site_content.php, testimonials.php, newsletter.php, settings.php API endpoints
provides:
  - Hero section fetches heading/subtitle/CTA/iconSlots from site_content API with ICON_REGISTRY
  - Navbar CTA button text/href fetches from site_content?section=nav
  - AgencyStats section fetches 4 stats from site_content?section=stats
  - Testimonials block fetches first 9 from testimonials API, maps content->text and image_url->image
  - Footer newsletter signup form POSTs to newsletter.php, shows success/duplicate/error states
  - WhatsAppButton fixed bottom-right component, hidden when number empty, opens wa.me link
  - Jest test infrastructure (jest.config.js + jest.setup.ts) with @testing-library/jest-dom
affects: [homepage, public pages, admin-settings, phase-06-admin-panel]

# Tech tracking
tech-stack:
  added: [jest.config.js (next/jest), jest.setup.ts (@testing-library/jest-dom)]
  patterns: [safeFetch-in-useEffect-with-FALLBACK_DATA pattern applied to all homepage blocks]

key-files:
  created:
    - frontend/src/components/ui/whatsapp-button.tsx
    - frontend/src/components/ui/__tests__/whatsapp-button.test.tsx
    - frontend/src/components/ui/__tests__/footer-section.test.tsx
    - frontend/src/components/blocks/__tests__/testimonials.test.tsx
    - frontend/src/components/blocks/__tests__/floating-icons-hero-demo.test.tsx
    - frontend/jest.config.js
    - frontend/jest.setup.ts
  modified:
    - frontend/src/components/blocks/floating-icons-hero-demo.tsx
    - frontend/src/components/blocks/agency-stats.tsx
    - frontend/src/components/blocks/testimonials.tsx
    - frontend/src/components/ui/footer-section.tsx
    - frontend/src/app/layout.tsx

key-decisions:
  - "ICON_REGISTRY maps string keys (openai, n8n, etc.) to SVG components — admin picks key, not SVG URL"
  - "SLOT_CLASSES positions are hardcoded per slot number — only icon identity is dynamic from API"
  - "testimonials.tsx uses motion/react (not framer-motion) — unchanged per RESEARCH.md anti-pattern rule"
  - "agency-stats.tsx uses framer-motion — unchanged per RESEARCH.md anti-pattern rule"
  - "app/layout.tsx stays a Server Component — WhatsAppButton is a client component imported into it"
  - "Jest config uses next/jest createJestConfig with setupFilesAfterEnv for @testing-library/jest-dom"

patterns-established:
  - "FALLBACK_DATA pattern: const FALLBACK_X = [...]; const [x, setX] = useState(FALLBACK_X); useEffect fetches, updates on success only"
  - "Field mapping on fetch: DB content->text, image_url->image for TestimonialsColumn compatibility"
  - "WhatsApp number sanitization: replace(/\\D/g, '') before constructing wa.me URL"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-08, HOME-09, HOME-10]

# Metrics
duration: 11min
completed: 2026-05-14
---

# Phase 02 Plan 04: Homepage API Integration Summary

**All 5 homepage dynamic sections wired to PHP APIs — hero, stats, testimonials, footer newsletter, and WhatsApp button — with graceful hardcoded fallbacks on API failure.**

## Tasks Completed

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Wave 0 test scaffolds for 4 components | 67dbcf3 | DONE |
| 2 | Hero + AgencyStats wired to site_content API | a262792 | DONE |
| 3 | Testimonials block wired to testimonials API | 21c1629 | DONE |
| 4 | Footer newsletter form + WhatsApp button | 24a9715 | DONE |

## What Was Built

### Hero Section (floating-icons-hero-demo.tsx)
- Fetches `site_content.php?section=hero` on mount
- `ICON_REGISTRY` maps 21 icon keys to SVG components
- `SLOT_CLASSES` provides fixed positioning for 6 slots
- Falls back to `FALLBACK_HERO_TEXT` and `FALLBACK_ICON_SLOTS` on failure
- Navbar CTA fetches `site_content.php?section=nav` for dynamic button text/href

### Agency Stats (agency-stats.tsx)
- `FALLBACK_STATS` constant with all 4 current stats
- `useEffect` fetches `site_content.php?section=stats`
- Renders `json.data.stats` array when available, fallback otherwise

### Testimonials (testimonials.tsx)
- Added `"use client"` as line 1
- `FALLBACK_TESTIMONIALS` with all 9 existing entries
- Maps DB fields: `content → text`, `image_url → image` for `TestimonialsColumn` compatibility
- Slices first 9 from API, combines role + company fields

### Footer Newsletter (footer-section.tsx)
- Email input with `Subscribe` button in brand column
- POSTs `{ action: "subscribe", email }` to `/api/newsletter.php`
- Three states: success ("You're in!"), duplicate ("Already subscribed"), error

### WhatsApp Button (whatsapp-button.tsx)
- New component at `components/ui/whatsapp-button.tsx`
- Fixed bottom-right, z-50, 52×52px green circle
- Fetches `settings.php?key=whatsapp_number` on mount
- Strips non-digits with `replace(/\D/g, "")`, requires ≥7 digits
- Returns `null` when number is empty or API fails (fully hidden)
- Mounted in `app/layout.tsx` (Server Component — no "use client" added)

### Jest Infrastructure (deviation — Rule 3: blocking issue)
- Created `jest.config.js` using `next/jest` createJestConfig
- Created `jest.setup.ts` importing `@testing-library/jest-dom`
- Fixed `setupFilesAfterEnv` configuration
- Required for all tests to run at all — no jest config existed before

## Test Results

- `npx jest --passWithNoTests`: 12/12 tests PASS across 4 suites
- `npx tsc --noEmit`: exits 0 (zero TypeScript errors)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created jest infrastructure (jest.config.js + jest.setup.ts)**
- **Found during:** Task 1 (test scaffold creation)
- **Issue:** No jest.config existed at all — `npx jest` would fail with "ts-node required" when using jest.config.ts
- **Fix:** Created jest.config.js using next/jest createJestConfig pattern; jest.setup.ts for @testing-library/jest-dom
- **Files created:** frontend/jest.config.js, frontend/jest.setup.ts
- **Commit:** a262792

**2. [Rule 1 - Bug] Fixed hero test mocking for complex sub-components**
- **Found during:** Task 2 (hero tests)
- **Issue:** FloatingIconsHeroDemo renders Navbar with MenuItem referencing lucide icons from framer-motion — caused "Element type is invalid" error in tests
- **Fix:** Added jest.mock for @/components/ui/floating-icons-hero-section, @/components/ui/navbar-menu, next/link in test file
- **Files modified:** frontend/src/components/blocks/__tests__/floating-icons-hero-demo.test.tsx
- **Commit:** a262792

**3. [Rule 1 - Bug] Fixed testimonials test using getByText instead of getAllByText**
- **Found during:** Task 3 (testimonials test)
- **Issue:** Multiple fallback testimonial names matched regex — getByText throws when multiple elements found
- **Fix:** Changed to getAllByText with length assertion
- **Files modified:** frontend/src/components/blocks/__tests__/testimonials.test.tsx
- **Commit:** 21c1629

**4. [Rule 1 - Bug] Fixed ComponentType vs FC type mismatch in hero ICON_REGISTRY**
- **Found during:** Task 2 (TypeScript check)
- **Issue:** ICON_REGISTRY typed as Record<string, ComponentType<...>> but IconProps.icon expects FC<...>
- **Fix:** Cast ICON_REGISTRY lookup result as React.FC<React.SVGProps<SVGSVGElement>>
- **Files modified:** frontend/src/components/blocks/floating-icons-hero-demo.tsx
- **Commit:** a262792

## Known Stubs

None — all API connections are live with functional fallbacks.

## Self-Check: PASSED
