---
phase: 04-content-pages-blog-case-studies-guides
plan: 01
subsystem: backend
tags: [backend, php, database, blog, case-studies, guides, scheduling, seed-data]
dependency_graph:
  requires: []
  provides:
    - blogs.php scheduling support (scheduled_at column + filter)
    - 2 published blog posts in DB with sections JSON
    - 2 published case studies in DB with hero_stats + sections JSON
    - 2 guides in DB with full HTML content
  affects:
    - All blog listing/detail frontend pages (04-02, 04-03)
    - All case studies listing/detail frontend pages (04-04, 04-05)
    - All guides listing/detail frontend pages (04-06, 04-07)
tech_stack:
  added: []
  patterns:
    - INSERT IGNORE for idempotent seeding (re-run safe)
    - Three-state blog scheduling (published/scheduled/draft) with NOW() filter
    - Auto-migrate column pattern in blogs.php
key_files:
  created: []
  modified:
    - backend/api/blogs.php
    - backend/init_db.php
decisions:
  - blogs.php uses three-state status (published/scheduled/draft) — scheduled posts become visible when scheduled_at <= NOW()
  - INSERT IGNORE pattern used for all seeds — idempotent, never overwrites admin edits
  - Case studies include distinct published_date values so Recent sort on listing page has real data to order by
  - Old WHERE NOT EXISTS seeds removed entirely — replaced with INSERT IGNORE per D-16/D-17/D-18
metrics:
  duration: 6 min
  completed_date: "2026-05-15"
  tasks_completed: 2
  files_modified: 2
---

# Phase 04 Plan 01: Blog Scheduling + Content Seeds Summary

**One-liner:** Added three-state blog scheduling (scheduled_at <= NOW()) to blogs.php and seeded 2 blog posts, 2 case studies, and 2 guides with genuine B2B AI automation content using INSERT IGNORE.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add scheduled_at column and scheduling filter to blogs.php | 19094c7 | backend/api/blogs.php |
| 2 | Seed 2 blog posts, 2 case studies, 2 guides in init_db.php | 6cd3417 | backend/init_db.php |

## What Was Built

### Task 1: Blog Scheduling Support

Modified `backend/api/blogs.php` to support three-state blog scheduling:

1. Added `"scheduled_at DATETIME NULL DEFAULT NULL"` to the auto-migrate block — column added on first API call if missing.
2. Updated the public list GET query WHERE clause from `status = 'published'` to `(status = 'published') OR (status = 'scheduled' AND scheduled_at <= NOW())`.
3. Updated the public single-slug GET query with the same scheduling filter.
4. Added `'scheduled_at'` to the `save_post` `$d` array so scheduled_at is persisted when saving.
5. Updated status validation to accept `'scheduled'` as a valid value alongside `'published'` and `'draft'`.

### Task 2: Content Seeds

Replaced the old minimal `WHERE NOT EXISTS` seeds with rich `INSERT IGNORE` seeds in `backend/init_db.php`:

**Blog posts (2):**
- "How AI Automation Eliminates 14 Hours of Manual Work Per Week" — AI Strategy category, 5-section structure including overview, challenge, solution, metrics, and mid-CTA. Published 2025-03-14.
- "SEO in the Age of AI: How to Win When LLMs Answer Instead of Google" — SEO category, 4-section structure including zero-click overview, why traditional SEO fails, GEO methodology, and mid-CTA. Published 2025-04-02.

**Case studies (2):**
- "How FinFlows Automated 90% of Their Back-Office Operations" — Fintech industry, 4 hero stats (60% ops cost reduction, 40+ processes, 320h/week saved, 4.2x ROI), 3 sections (challenge/solution/metrics). Published date 2025-03-14.
- "How GrowthLoop Scaled LinkedIn Outreach 10x Without Hiring" — B2B SaaS industry, 4 hero stats (3x pipeline, 120/wk saved, 34% response rate, 3 weeks deployment), 3 sections (challenge/solution/metrics). Published date 2025-04-10.

**Guides (2):**
- "The AI Automation Roadmap: A 12-Month Playbook for B2B Teams" — Strategy category, full 4-phase HTML content.
- "GEO vs SEO: The Complete Guide to Getting Your Brand Cited by AI" — SEO category, full 4-section HTML content.

## Verification Results

All plan verification checks passed:

1. `grep -n "scheduled_at" backend/api/blogs.php` — appears at lines 22 (auto-migrate), 47 (slug query), 57 (list query), 97 ($d array). 4 occurrences.
2. `grep -c "INSERT IGNORE INTO blogs" backend/init_db.php` — returns 2.
3. `grep -c "INSERT IGNORE INTO case_studies" backend/init_db.php` — returns 2.
4. `grep -c "INSERT IGNORE INTO guides" backend/init_db.php` — returns 2.
5. `grep "WHERE NOT EXISTS (SELECT 1 FROM blogs)" backend/init_db.php` — returns 0 (removed).
6. `grep "published_date" backend/init_db.php` — appears in both case study INSERT statements.

## Deviations from Plan

**1. [Rule 3 - Blocking] Removed orphaned $sql_testimonials_dummy block**
- **Found during:** Task 2 cleanup
- **Issue:** Initial edit accidentally introduced a dead `$sql_testimonials_dummy = "";` variable and a duplicate `$pdo->exec($sql_testimonials)` call after the testimonials block was already executed.
- **Fix:** Removed the orphaned dummy block entirely — the actual `$pdo->exec($sql_testimonials)` at line 168 was already correct.
- **Files modified:** backend/init_db.php
- **Commit:** 6cd3417 (included in same task commit)

**2. [Rule 3 - Blocking] Removed old $sql_guides WHERE NOT EXISTS block**
- **Found during:** Task 2 — was still present after initial edit
- **Issue:** The old `$sql_guides` block with `WHERE NOT EXISTS (SELECT 1 FROM guides)` pattern was still present alongside the new INSERT IGNORE seeds.
- **Fix:** Removed the entire old `$sql_guides` variable and its exec call — replaced by the two new INSERT IGNORE guide seeds.
- **Files modified:** backend/init_db.php
- **Commit:** 6cd3417 (included in same task commit)

## Known Stubs

None — all seeded content is genuine B2B-appropriate material with real structure (sections JSON, hero_stats JSON, HTML content). No placeholder text used.

## Self-Check: PASSED

- `backend/api/blogs.php` — file exists and was committed at 19094c7.
- `backend/init_db.php` — file exists and was committed at 6cd3417.
- Both commits confirmed in git log.
