---
phase: 03-service-pages
plan: 02
subsystem: backend
tags: [php, mysql, api, service-content, seed-data]
dependency_graph:
  requires: [03-01]
  provides: [service_content-table, service_content-api]
  affects: [03-03, 03-04]
tech_stack:
  added: []
  patterns: [action-based-post-routing, insert-ignore-seed, on-duplicate-key-upsert]
key_files:
  created:
    - backend/api/service_content.php
  modified:
    - backend/init_db.php
decisions:
  - "service_content uses (slug, section) composite PRIMARY KEY — O(1) lookup by either slug alone or slug+section"
  - "INSERT IGNORE in seed rows — re-running init_db.php after admin edits does not overwrite custom content"
  - "ON DUPLICATE KEY UPDATE in API endpoint only — admin saves overwrite, seed rows do not"
  - "roadmap and market_impact sections share DEFAULT_SECTIONS values across all 11 services — admin will customize per service from Plan 04"
metrics:
  duration: 5
  completed_date: "2026-05-15T02:14:43Z"
  tasks_completed: 2
  files_changed: 2
---

# Phase 03 Plan 02: Service Content Backend Summary

**One-liner:** PHP service_content API endpoint (GET/POST) + MySQL table with 66-row INSERT IGNORE seed covering all 11 services x 6 sections.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create backend/api/service_content.php | 6c731df | backend/api/service_content.php (new) |
| 2 | Add service_content table + full seed to init_db.php | 5601f1a | backend/init_db.php (modified) |

## Files Created/Modified

### backend/api/service_content.php (new)
- GET `?slug=ai-seo` — returns all 6 sections as keyed object
- GET `?slug=ai-seo&section=hero` — returns single section data
- POST `action=save_section` with slug, section, content — upserts one row via `ON DUPLICATE KEY UPDATE`
- Follows `site_content.php` pattern exactly; adapted for two-key `(slug, section)` PK
- No INSERT IGNORE (seed-only pattern stays in init_db.php)

### backend/init_db.php (modified, appended only)
- `CREATE TABLE IF NOT EXISTS service_content` added to the `$sql` multi-statement string
- 66 individual `$pdo->exec("INSERT IGNORE INTO service_content ...")` calls added after main exec
- All original tables (logos, leads, guides, testimonials, testimonials_focus, blogs, case_studies, site_content, settings, newsletter_subscribers) unchanged

## Table Schema Confirmed

```sql
CREATE TABLE IF NOT EXISTS service_content (
    slug       VARCHAR(50) NOT NULL,
    section    VARCHAR(50) NOT NULL,
    content    JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (slug, section)
);
```

## Seed Row Count

| Section | Rows |
|---------|------|
| hero | 11 |
| features | 11 |
| roadmap | 11 |
| market_impact | 11 |
| cta | 11 |
| testimonials | 11 |
| **Total** | **66** |

All 11 slugs seeded: ai-seo, custom-ai-solutions, youtube-automation, instagram-automation, linkedin-automation, automation-flows, ai-workflows, workflow-creation, accounting-bookkeeping, hiring-recruitment, sales-automation.

## Seed Strategy Per Section

- **hero**: Per-service values from SERVICES constant (badge, heroLine1/2, heroCopy, ctaPrimary, pills, snapshotTitle, snapshotRows, statLabel/Value 1+2). ctaSecondary excluded (D-20 — not rendered).
- **features**: Per-service 3-card arrays from service.features. No icon field (D-14).
- **roadmap**: Shared DEFAULT_SECTIONS values for all 11 services. Admin customizes later via Plan 04.
- **market_impact**: Shared DEFAULT_SECTIONS values (outcomesTitle/TitleAccent/Copy/Cards/Stats). outcomesCards tuples converted to `{quote, company, sector, metricValue, metricLabel}` objects.
- **cta**: Shared DEFAULT_SECTIONS ctaBadge/ctaTitle/ctaCopy for all 11 services.
- **testimonials**: Per-service quotes/role/company from service.testimonials.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All 66 seed rows contain real content derived from the SERVICES constant and DEFAULT_SECTIONS. The roadmap and market_impact sections use shared defaults as designed (admin will customize per-service from Plan 04).

## Self-Check: PASSED

- `backend/api/service_content.php` exists: FOUND
- `backend/init_db.php` contains CREATE TABLE IF NOT EXISTS service_content: FOUND
- INSERT IGNORE count = 66: CONFIRMED
- Commits 6c731df and 5601f1a: CONFIRMED via git log
