---
phase: 06-admin-panel-completion
plan: 01
subsystem: backend
tags: [php, database, api, admin, newsletter, settings, users, analytics, banners]
dependency_graph:
  requires: []
  provides:
    - backend/api/users.php
    - backend/api/analytics.php
    - backend/api/banners.php
    - users DB table
    - analytics_codes DB table
    - banners DB table
    - admin_passcode settings seed
  affects:
    - backend/api/newsletter.php (extended GET + unsubscribe/delete actions)
    - backend/api/settings.php (extended with save_all_settings)
    - backend/init_db.php (3 new tables + seed rows)
tech_stack:
  added: []
  patterns:
    - action-based POST routing (same as leads.php)
    - INSERT ... ON DUPLICATE KEY UPDATE upsert pattern
    - password_hash(PASSWORD_DEFAULT) for secure user credential storage
    - CSV streaming via php://output for export
key_files:
  created:
    - backend/api/users.php
    - backend/api/analytics.php
    - backend/api/banners.php
  modified:
    - backend/init_db.php
    - backend/api/newsletter.php
    - backend/api/settings.php
decisions:
  - "users table excludes password_hash from GET responses for security (only id, name, designation, login_id, created_at returned)"
  - "admin_passcode seeded as plain string '12345' in settings table — login page reads from DB (USR-02)"
  - "banners and analytics_codes seeded with disabled/empty defaults so admin panel loads without errors on first run"
  - "newsletter GET list accepts optional ?status= filter to allow admin filtering by active/unsubscribed"
  - "CSV export overrides Content-Type header to text/csv and uses php://output stream — exits without calling json_resp()"
metrics:
  duration_minutes: 3
  completed_date: "2026-05-15"
  tasks_completed: 3
  files_modified: 6
---

# Phase 06 Plan 01: Backend APIs for Admin Panel Completion Summary

**One-liner:** Five PHP files created or extended to back all Wave 2 admin UI sections — users with password_hash CRUD, analytics codes key-value store, banners JSON config store, newsletter subscriber listing with CSV export, and bulk settings upsert.

## What Was Built

Four new admin API endpoints and tables, plus extensions to two existing endpoints:

### New Tables (init_db.php)

1. **users** — Admin user management with `id, name, designation, login_id UNIQUE, password_hash, created_at`
2. **analytics_codes** — Key-value store for embed codes with `id, code_key UNIQUE, code_value LONGTEXT, updated_at`
3. **banners** — Banner/popup configuration store with `id, config_key UNIQUE, config_value LONGTEXT, updated_at`

### New Seed Rows (init_db.php)

- `analytics_codes`: `google_analytics`, `search_console`, `custom_head_scripts` (all seeded as empty strings)
- `banners`: `banner`, `popup`, `exit_popup` (all seeded with `enabled: false` defaults)
- `settings.admin_passcode`: seeded as `'12345'` (USR-02 — login page can now read from DB)

### New Endpoints

| File | GET | POST Actions |
|------|-----|--------------|
| `backend/api/users.php` | Lists users (no password_hash) | `save_user` (INSERT/UPDATE with password_hash), `delete_user` |
| `backend/api/analytics.php` | Returns `{ code_key: code_value }` map | `save_codes` (upserts each key) |
| `backend/api/banners.php` | Returns `{ config_key: decoded_JSON }` map | `save_banners` (upserts each key as JSON) |

### Extended Endpoints

| File | Change |
|------|--------|
| `backend/api/newsletter.php` | GET now returns subscriber list (`?action=list`) or CSV export (`?action=export_csv`); POST adds `unsubscribe` and `delete_subscriber` actions |
| `backend/api/settings.php` | POST adds `save_all_settings` action accepting a key-value object for bulk upsert |

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: init_db.php tables + seeds | 2f967cd | backend/init_db.php |
| Task 2: users.php, analytics.php, banners.php | 1a7fc62 | backend/api/users.php, analytics.php, banners.php |
| Task 3: newsletter.php + settings.php | 18fcd78 | backend/api/newsletter.php, backend/api/settings.php |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all endpoints are fully wired to the database. GET responses return live DB data. POST actions persist to DB.

## Self-Check: PASSED

- `backend/api/users.php` — FOUND
- `backend/api/analytics.php` — FOUND
- `backend/api/banners.php` — FOUND
- Commit `2f967cd` (init_db.php) — FOUND
- Commit `1a7fc62` (3 new endpoints) — FOUND
- Commit `18fcd78` (newsletter + settings) — FOUND
- All 7 overall verification checks — PASSED
