---
phase: 02-homepage-site-content-admin
plan: "01"
subsystem: backend-api
tags: [php, api, database, site-content, settings, newsletter]
dependency_graph:
  requires: []
  provides:
    - backend/api/site_content.php
    - backend/api/settings.php
    - backend/api/newsletter.php
    - DB tables: site_content, settings, newsletter_subscribers
  affects:
    - Phase 02 Plans 02-04 (all homepage block connections depend on these endpoints)
    - WhatsAppButton component (reads settings.php?key=whatsapp_number)
    - Newsletter footer widget (posts to newsletter.php)
tech_stack:
  added: []
  patterns:
    - PHP action-based POST routing (logos.php pattern)
    - PDO INSERT ON DUPLICATE KEY UPDATE for upserts
    - PDOException error code 23000 for duplicate email detection
key_files:
  created:
    - backend/api/site_content.php
    - backend/api/settings.php
    - backend/api/newsletter.php
  modified:
    - backend/init_db.php
decisions:
  - "site_content table uses section VARCHAR(50) as PK — enables O(1) lookup by section name"
  - "newsletter.php uses plain INSERT (not INSERT IGNORE) to distinguish duplicates from real errors via PDOException code 23000"
  - "settings.php GET with no key returns full map for bulk reads; GET with key returns {key, value} object for WhatsAppButton compatibility"
metrics:
  duration: "~2 min"
  completed_date: "2026-05-14"
  tasks_completed: 3
  files_changed: 4
---

# Phase 02 Plan 01: Backend API Foundation Summary

**One-liner:** Three PHP REST endpoints (site_content, settings, newsletter) plus three new DB tables added to init_db.php for the Phase 2 homepage CMS foundation.

## What Was Built

This plan created the backend data layer that all subsequent Phase 2 plans depend on:

1. **`backend/init_db.php`** — Extended with three new `CREATE TABLE IF NOT EXISTS` blocks inside the existing `$sql` string, plus a seeded `whatsapp_number` setting with `WHERE NOT EXISTS` guard.

2. **`backend/api/site_content.php`** — GET `?section=X` returns the decoded JSON content object for a named section; POST `action=save_section` upserts the content blob via `ON DUPLICATE KEY UPDATE`.

3. **`backend/api/settings.php`** — GET `?key=X` returns `{ key, value }` row (or default empty); GET with no key returns full key-value map; POST `action=save_setting` upserts.

4. **`backend/api/newsletter.php`** — POST `action=subscribe` validates email, inserts into `newsletter_subscribers`, and returns `"Already subscribed with this email"` on duplicate via `PDOException` code 23000.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend init_db.php with 3 new tables and seed | 35519af | backend/init_db.php |
| 2 | Create site_content.php | e50f523 | backend/api/site_content.php |
| 3 | Create settings.php and newsletter.php | 8f042f0 | backend/api/settings.php, backend/api/newsletter.php |

## Decisions Made

- Used `section VARCHAR(50) PRIMARY KEY` for site_content — section name is the natural key, no surrogate needed.
- `newsletter.php` uses plain `INSERT` (not `INSERT IGNORE`) so duplicate constraint violations raise `PDOException` and can be caught and converted to a user-friendly error. Using `INSERT IGNORE` would silently succeed and not distinguish from real errors.
- `settings.php` returns `['key' => $key, 'value' => '']` when key is not found — graceful fallback for WhatsAppButton without a 404 error.

## Deviations from Plan

None — plan executed exactly as written.

PHP `-l` syntax validation was not possible in this environment (no PHP binary in shell PATH). All files were verified by:
- Manual inspection of required strings (grep)
- Confirming all acceptance criteria patterns are present in the created files

## Known Stubs

None. All endpoints are fully wired to the DB. No hardcoded placeholder values exist.

## Self-Check: PASSED

Files created/modified:
- FOUND: backend/init_db.php (modified, contains all 3 new CREATE TABLE blocks + seed)
- FOUND: backend/api/site_content.php (created)
- FOUND: backend/api/settings.php (created)
- FOUND: backend/api/newsletter.php (created)

Commits:
- FOUND: 35519af — feat(02-01): extend init_db.php with site_content, settings, newsletter_subscribers tables
- FOUND: e50f523 — feat(02-01): create site_content.php API endpoint
- FOUND: 8f042f0 — feat(02-01): create settings.php and newsletter.php API endpoints
