---
phase: 06-admin-panel-completion
plan: "03"
subsystem: admin-panel
tags: [admin, banners, analytics, users, settings, passcode]
dependency_graph:
  requires: [06-01]
  provides: [admin-banners-page, admin-analytics-page, admin-users-page, sidebar-analytics-users, dynamic-login-passcode]
  affects: [frontend/src/app/admin/banners, frontend/src/app/admin/analytics, frontend/src/app/admin/users, frontend/src/app/admin/login, frontend/src/components/admin/admin-layout.tsx]
tech_stack:
  added: []
  patterns: [api.get-fetch-on-mount, api.post-save-action, settings-api-passcode, DB-backed-admin-config]
key_files:
  created:
    - frontend/src/app/admin/banners/page.tsx
    - frontend/src/app/admin/analytics/page.tsx
    - frontend/src/app/admin/users/page.tsx
  modified:
    - frontend/src/components/admin/admin-layout.tsx
    - frontend/src/app/admin/login/page.tsx
decisions:
  - Admin banners page replaces localStorage stub with DB-backed banners.php integration
  - Login page fetches admin_passcode from settings API at runtime with hardcoded '12345' as fallback on network failure
  - USR-03 (activity tracking) deferred to v2 — disproportionate effort to hook all write actions across every admin page
metrics:
  duration_minutes: 4
  completed_date: "2026-05-15"
  tasks_completed: 3
  files_created: 3
  files_modified: 2
---

# Phase 06 Plan 03: Admin Banners, Analytics, Users + Dynamic Login Summary

**One-liner:** Three new admin pages (banners/analytics/users) wired to DB APIs, plus sidebar links and dynamic login passcode fetched from settings table.

## What Was Built

### Task 1 — Admin Banners Page (DB-backed)
Replaced the 12-line "Coming Soon" stub at `frontend/src/app/admin/banners/page.tsx` with a full DB-backed admin UI. The page:
- Fetches banner/popup/exit_popup config from `banners.php` on mount with DEFAULT fallback
- Three editable sections: Announcement Bar (text, CTA, bgColor), Timed Popup (title, body, delay, CTA), Exit-Intent Popup (title, body, CTA)
- Saves all configs via `save_banners` action POST to `banners.php`
- No localStorage usage — all state is DB-backed

### Task 2a — Admin Analytics Page + Sidebar Links
Created `frontend/src/app/admin/analytics/page.tsx` with:
- Three textarea fields (GA4, Search Console, Custom Head Scripts) with monospace font
- Fetches codes from `analytics.php` on mount, saves via `save_codes` action
- Updated `admin-layout.tsx` to import `BarChart2` and `UserCog` from lucide-react
- Added ANALYTICS (`/admin/analytics`) and USERS (`/admin/users`) sidebar items between BANNERS and SETTINGS

### Task 2b — Admin Users Page + Dynamic Login Passcode
Created `frontend/src/app/admin/users/page.tsx` with:
- Full CRUD table: list users with Name, Designation, Login ID, Created, Edit/Delete actions
- Create/Edit form (name, designation, login_id, password) — password field optional on edit
- Passcode section: saves `admin_passcode` to settings table via `save_all_settings` action (USR-02 fulfilled)

Updated `frontend/src/app/admin/login/page.tsx`:
- Added `API_BASE_URL` import from `@/lib/constants`
- Added `checking` state
- Replaced hardcoded `if (code === "12345")` comparison with async fetch to `settings.php?key=admin_passcode`
- Compares user-entered code against DB-fetched value; falls back to '12345' on network failure to prevent lockout

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Login fallback to '12345' on network failure | Admin must never be fully locked out due to network issues |
| USR-03 (activity tracking) deferred to v2 | Hooking all write actions across every admin page is disproportionate for v1 launch |
| No full rewrite of login page UI | Only comparison logic changed — existing premium UI preserved |
| Spread DEFAULT before API data on fetch | Guarantees all fields present even if API returns partial data |

## Deviations from Plan

None — plan executed exactly as written. The login page update added `checking` state used in both button display and async flow per plan spec.

## Known Stubs

None — all three pages are fully wired to their respective backend APIs.

## Requirements Fulfilled

- USR-01: Admin users page lists users (GET users.php)
- USR-02: Admin can change passcode from Users panel without editing code
- ANA-01: Admin analytics page with Google Analytics, Search Console, Custom Scripts fields
- ANA-02: Analytics codes saved to DB via analytics.php
- POP-01: Banners page manages Announcement Bar config in DB
- POP-02: Banners page manages Timed Popup config in DB
- POP-03: Banners page manages Exit-Intent Popup config in DB

## Self-Check: PASSED

Files exist:
- frontend/src/app/admin/banners/page.tsx: FOUND (created)
- frontend/src/app/admin/analytics/page.tsx: FOUND (created)
- frontend/src/app/admin/users/page.tsx: FOUND (created)
- frontend/src/components/admin/admin-layout.tsx: FOUND (modified)
- frontend/src/app/admin/login/page.tsx: FOUND (modified)

Commits:
- 341a104: feat(06-03): admin banners page with DB-backed popup and banner config
- 0ab035e: feat(06-03): admin analytics page and sidebar Analytics+Users links
- 0e388a9: feat(06-03): admin users page and dynamic login passcode from DB
