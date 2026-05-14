---
phase: 02-homepage-site-content-admin
plan: 02
subsystem: ui
tags: [nextjs, react, typescript, homepage, services, logos]

# Dependency graph
requires:
  - phase: 01-bugs-foundation
    provides: Working codebase with no blocking TypeScript or build errors
provides:
  - Services section eyebrow updated to "What We Do" with all 11 hrefs verified
  - Problem section subtitle tightened to ~16 words fitting within 2 lines
  - Logo marquee data update spec ready for post-deployment admin UI application
affects: [phase-03, phase-04, phase-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content edits made directly in TSX component files (no CMS required for copy fixes)"
    - "Logo marquee data seeded via admin UI post-deployment (D-17, D-18)"

key-files:
  created: []
  modified:
    - frontend/src/components/blocks/services.tsx
    - frontend/src/components/blocks/context-problem.tsx

key-decisions:
  - "Task 3 (logo marquee data update) deferred to post-deployment admin UI step — no live server access during this session"
  - "Logo URLs identified and documented for admin UI entry: Zapier, Google Ads, Meta via Wikimedia SVG; OpenAI, Anthropic, n8n, Microsoft, Make as text-display entries"

patterns-established:
  - "Data-only tasks (no code change) documented as deferred post-deployment steps when live server is unavailable"

requirements-completed: [HOME-05, HOME-06, HOME-07]

# Metrics
duration: 15min
completed: 2026-05-14
---

# Phase 02 Plan 02: Homepage Content Fixes Summary

**Services eyebrow label corrected to "What We Do", problem subtitle tightened to 16 words, and logo marquee data update documented for post-deployment admin UI entry**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-14T10:10:00Z
- **Completed:** 2026-05-14T10:25:00Z
- **Tasks:** 2 completed, 1 deferred
- **Files modified:** 2

## Accomplishments

- Changed services.tsx eyebrow label from "Our Ecosystem" to "What We Do" (D-19)
- Verified all 11 service card hrefs point to valid `/services/*` routes — none use `#` (D-20)
- Trimmed context-problem.tsx subtitle from 22 words to 16 words, fits within 2 lines at all viewports (D-21)
- Identified and documented all 8 logo entries for the marquee data-seeding step post-deployment (D-17, D-18)

## Task Commits

Each completed task was committed atomically:

1. **Task 1: Update services.tsx eyebrow label and verify all service hrefs** - `1c20b9a` (fix)
2. **Task 2: Trim problem section subtitle to 2 lines** - `6cbf373` (fix)
3. **Task 3: Add partner logos via admin logos UI** - DEFERRED (see below)

## Files Created/Modified

- `frontend/src/components/blocks/services.tsx` — Eyebrow label changed from "Our Ecosystem" to "What We Do"; all 11 service hrefs verified as `/services/*` routes
- `frontend/src/components/blocks/context-problem.tsx` — Subtitle trimmed from "Every manual handoff costs time, context, and revenue. We bridge every gap with AI that connects your entire stack and acts 24/7." to "Every manual handoff costs time and revenue. We bridge every gap with AI that acts 24/7."

## Decisions Made

- Task 3 was deferred rather than executed against the live server, per the session constraint of no live-server changes. Logo data is documented with exact entries ready for admin UI application post-deployment.
- Logo display modes: text entries for OpenAI, Anthropic, n8n, Microsoft, Make (no SVG URL needed); image entries for Zapier, Google Ads, Meta (Wikimedia SVG URLs).

## Deviations from Plan

### Deferred Task

**Task 3: Logo marquee data update — deferred to post-deployment admin UI step**

- **Reason:** No live server access permitted during this session. Task 3 is a data-only task (no code change) requiring browser login to the production admin panel at `https://digipexel.cluxn.com/admin/logos`.
- **Impact on plan:** HOME-04 requirement (logo marquee shows 5+ tech-relevant logos) is NOT yet satisfied on the live site. Code infrastructure is already in place (logos.php API + logo marquee component). Only data entry is pending.
- **What to do post-deployment:**
  1. Visit `https://digipexel.cluxn.com/admin/logos` (passcode: 12345)
  2. Remove all existing placeholder logos (Dish, Deloitte, Pfizer, Adobe, American Airlines, NBCUniversal)
  3. Add 8 new logos in this order:

| # | Name       | Display Mode | SVG URL                                                                                      |
|---|------------|--------------|----------------------------------------------------------------------------------------------|
| 1 | OpenAI     | text         | (leave blank)                                                                                |
| 2 | Anthropic  | text         | (leave blank)                                                                                |
| 3 | n8n        | text         | (leave blank)                                                                                |
| 4 | Zapier     | image        | https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg                         |
| 5 | Google Ads | image        | https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg                     |
| 6 | Meta       | image        | https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg            |
| 7 | Microsoft  | text         | (leave blank)                                                                                |
| 8 | Make       | text         | (leave blank)                                                                                |

  4. Click "Update Section" to save
  5. Visit homepage and confirm marquee scrolls with updated logos

---

**Total deviations:** 1 deferred task (data-seeding step blocked by session constraint — no code change required)
**Impact on plan:** HOME-04 remains open until post-deployment data entry is completed. All code-level tasks (HOME-05, HOME-06, HOME-07) are complete.

## Issues Encountered

None — the two code-edit tasks executed cleanly. TypeScript compilation passed with no errors after both changes.

## User Setup Required

**Logo marquee data seeding required post-deployment.** No environment variables or dashboard configuration needed — only admin UI data entry as described in the Deferred Task section above.

## Known Stubs

None — the modified components (services.tsx, context-problem.tsx) have no stubs. Logo marquee component is wired to the real API; the missing data is a content gap, not a code stub.

## Next Phase Readiness

- Services section and problem section are copy-correct and deployment-ready
- Logo marquee infrastructure is complete; data entry is the only remaining step for HOME-04
- No blockers for Phase 02 Plan 03 — all code artifacts for this plan are committed

---
*Phase: 02-homepage-site-content-admin*
*Completed: 2026-05-14*

## Self-Check: PASSED

- `frontend/src/components/blocks/services.tsx` — modified in Task 1, commit `1c20b9a` confirmed
- `frontend/src/components/blocks/context-problem.tsx` — modified in Task 2, commit `6cbf373` confirmed
- Task 3 documented as deferred with full instructions
- No missing files; no untracked generated output
