---
phase: 07-seo-static-pages-launch-readiness
plan: 02
subsystem: seo-backend
tags: [seo, php, sitemap, robots, next-sitemap, backend, database]
dependency_graph:
  requires: []
  provides: [seo_meta-php-endpoint, seo_meta-db-table, next-sitemap-config, calendly_url-seed]
  affects: [frontend-build, admin-seo-panel]
tech_stack:
  added: [next-sitemap@4.2.3]
  patterns: [ON DUPLICATE KEY UPDATE upsert, INSERT SELECT WHERE NOT EXISTS seed, postbuild npm script]
key_files:
  created:
    - backend/api/seo_meta.php
    - frontend/next-sitemap.config.js
  modified:
    - backend/init_db.php
    - frontend/package.json
    - frontend/package-lock.json
decisions:
  - seo_meta table uses page_key VARCHAR(100) PRIMARY KEY — O(1) lookup by page key, no surrogate needed; matches site_content pattern
  - outDir ./out required in next-sitemap config — static export writes to out/ not public/; sitemap/robots.txt must land in out/ for SFTP deployment
  - next-sitemap added to dependencies (not devDependencies) — postbuild runs in CI where only dependencies are typically available
  - calendly_url seeded empty in settings — admin sets their Calendly URL via Settings panel, no hardcoded default needed
metrics:
  duration: 2min
  completed_date: "2026-05-16"
  tasks_completed: 2
  files_modified: 5
---

# Phase 07 Plan 02: SEO Backend Infrastructure Summary

**One-liner:** seo_meta DB table + PHP CRUD endpoint with upsert, calendly_url settings seed, and next-sitemap postbuild config generating sitemap.xml and robots.txt in out/ directory.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add seo_meta table, calendly_url seed, seo_meta.php endpoint | bef27d8 | backend/init_db.php, backend/api/seo_meta.php |
| 2 | Install next-sitemap, postbuild script, sitemap config | 767e9ab | frontend/package.json, frontend/package-lock.json, frontend/next-sitemap.config.js |

## What Was Built

### Task 1: Backend SEO Infrastructure

**backend/init_db.php** — Added `CREATE TABLE IF NOT EXISTS seo_meta` block with:
- `page_key VARCHAR(100) PRIMARY KEY` — O(1) lookup by page identifier
- `seo_title VARCHAR(255)`, `meta_description TEXT`, `og_image TEXT`
- `updated_at TIMESTAMP` with ON UPDATE CURRENT_TIMESTAMP

Also added `calendly_url` empty seed in settings table (for Calendly/booking CTA wiring in later plans).

**backend/api/seo_meta.php** — New endpoint:
- `GET ?page={key}` — Returns `{ status, data: { seo_title, meta_description, og_image } }` or null if not set
- `POST action=save_seo_meta` — Upserts by page_key using ON DUPLICATE KEY UPDATE pattern (consistent with settings.php)
- Full try/catch with json_resp() error handling; `require_once '../common.php'` pattern followed

### Task 2: Sitemap + Robots.txt Postbuild

**frontend/next-sitemap.config.js** — Created at frontend root with:
- `siteUrl: 'https://digipexel.cluxn.com'`
- `generateRobotsTxt: true`
- `outDir: './out'` — critical: static export puts HTML in out/, not public/
- robots.txt policies: allow `/`, disallow `/admin/`
- Excludes `/admin`, `/admin/*`, `/thank-you` from sitemap

**frontend/package.json** — Added `"postbuild": "next-sitemap"` to scripts block; `next-sitemap@^4.2.3` added to dependencies.

## Verification Results

All acceptance criteria passed:
- `backend/api/seo_meta.php` exists with `require_once '../common.php'`, `save_seo_meta`, `ON DUPLICATE KEY UPDATE`
- `backend/init_db.php` contains `CREATE TABLE IF NOT EXISTS seo_meta` with `page_key VARCHAR(100) PRIMARY KEY`
- `backend/init_db.php` contains `calendly_url` INSERT WHERE NOT EXISTS seed
- `frontend/next-sitemap.config.js` exists with `siteUrl`, `generateRobotsTxt: true`, `outDir: './out'`, `disallow: '/admin/'`
- `frontend/package.json` contains `"postbuild": "next-sitemap"` and `"next-sitemap": "^4.2.3"` in dependencies
- `node -e "require('./next-sitemap.config.js')"` exits 0 — config OK

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all wired functionality. The seo_meta endpoint returns null for pages with no saved SEO meta, which is the correct behavior (frontend pages use their built-in default metadata until admin configures per-page SEO).

## Self-Check: PASSED

- `backend/api/seo_meta.php` — FOUND (created in Task 1)
- `frontend/next-sitemap.config.js` — FOUND (created in Task 2)
- Commit `bef27d8` — FOUND (Task 1)
- Commit `767e9ab` — FOUND (Task 2)
