---
phase: 06-admin-panel-completion
plan: "05"
subsystem: admin-dashboard
tags: [admin, dashboard, stats, php, api]
dependency_graph:
  requires: [06-01]
  provides: [stats-endpoint, live-dashboard-counts]
  affects: [frontend/src/app/admin/page.tsx, backend/api/stats.php]
tech_stack:
  added: []
  patterns: [single-request-stats-endpoint, stats-via-count-queries]
key_files:
  created:
    - backend/api/stats.php
  modified:
    - frontend/src/app/admin/page.tsx
decisions:
  - "stats.php uses separate COUNT queries per table rather than a JOIN — simpler, readable, and each count is independently resilient to table schema changes"
  - "Blogs count filtered to published status only — matches public listing behavior, admin gets accurate 'live' count"
  - "Subscribers count filtered to active status only — inactive/unsubscribed excluded from stat card"
  - "totalLeadsCount from stats endpoint used for stat card; leads API still fetched separately for the full table data needed by Captured Leads section"
metrics:
  duration_minutes: 2
  completed_date: "2026-05-15"
  tasks_completed: 2
  files_modified: 2
---

# Phase 06 Plan 05: Admin Dashboard Stats Endpoint Summary

**One-liner:** New stats.php endpoint returns all 6 content counts in one GET request; dashboard stats grid updated to show live DB counts for leads, blogs, case studies, guides, testimonials, and newsletter subscribers.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create backend/api/stats.php | 1c9d04e | backend/api/stats.php (created) |
| 2 | Update admin dashboard to fetch from stats.php | 51b9733 | frontend/src/app/admin/page.tsx |

## What Was Built

### Task 1: backend/api/stats.php

A new read-only GET endpoint that returns integer counts for all major content types in a single request:

- `leads` — total count from leads table
- `blogs` — published count only (status = 'published')
- `case_studies` — total count
- `guides` — total count
- `testimonials` — total count
- `subscribers` — active subscribers count only (status = 'active')

Uses `json_resp()` throughout, with a non-GET method guard returning `Method not allowed`.

### Task 2: frontend/src/app/admin/page.tsx

- Replaced the old `Promise.all` of 4 separate API calls (`api.get("blogs")`, `api.get("case_studies")`, `api.get("guides")`, `api.get("leads")`) with a single `api.get("stats")` for counts plus `api.get("leads")` for the Captured Leads table data
- Added 3 new state variables: `testimonialCount`, `subscriberCount`, `totalLeadsCount`
- Stats grid now shows 7 live DB counts: New Leads, Total Leads, Blog Posts, Case Studies, Guides, Testimonials, Subscribers
- Removed unused `Layers` import, `totalLeads`, and `activeNudges` derived variables (no longer in stats array)
- Captured Leads table and Nudge Campaigns section left untouched

## Deviations from Plan

**[Rule 1 - Bug] Removed unused variables and import**

- **Found during:** Task 2
- **Issue:** After replacing the stats array, `totalLeads` (was `leads.length`), `activeNudges` (was for "Active Nudges" card), and the `Layers` import became unused — would cause TypeScript/ESLint errors in strict mode
- **Fix:** Removed `totalLeads` and `activeNudges` derived variables; removed `Layers` from lucide-react import
- **Files modified:** frontend/src/app/admin/page.tsx
- **Commit:** 51b9733

## Known Stubs

None — all stat card values are wired to live DB counts via the stats endpoint.

## Self-Check: PASSED

- backend/api/stats.php: FOUND
- frontend/src/app/admin/page.tsx: FOUND
- .planning/phases/06-admin-panel-completion/06-05-SUMMARY.md: FOUND
- Commit 1c9d04e: FOUND
- Commit 51b9733: FOUND
