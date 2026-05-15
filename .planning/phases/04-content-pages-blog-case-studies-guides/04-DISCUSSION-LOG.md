# Phase 4: Content Pages — Blog, Case Studies & Guides - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 04-content-pages-blog-case-studies-guides
**Areas discussed:** Guide lead capture, Popular sort definition, Blog scheduling

---

## Guide Lead Capture

| Option | Description | Selected |
|--------|-------------|----------|
| No gate — newsletter signup at bottom | Guide fully readable; newsletter/contact appears at end | ✓ |
| Soft gate — first ~40% free, email wall mid-article | Higher capture rate, lower trust | |
| Hard gate — email required before reading | Maximum capture, minimum trust/SEO | |

**User's choice:** No gate — newsletter signup at bottom
**Notes:** B2B decision-makers close gated content; trust-building via full access is more appropriate for COO/Founder/VP audience.

---

## Sort by "Popular"

| Option | Description | Selected |
|--------|-------------|----------|
| Editorial order (position field — already exists) | Admin manually orders; "Popular" label maps to position | ✓ |
| Add view tracking | Views counter in DB; popular = most views | |

**User's choice:** Editorial order (position field)
**Notes:** Simpler, zero backend work, no tracking infrastructure needed.

---

## Blog Scheduling

| Option | Description | Selected |
|--------|-------------|----------|
| Three-state: Publish Now / Schedule / Draft | Radio group + datetime-local picker on Schedule | ✓ |
| Just a publish date field | Set published_at; requires cron or manual trigger | |

**User's choice:** Three-state: Publish Now / Schedule / Draft
**Notes:** Adds `scheduled_at DATETIME NULL` + `scheduled` status to blogs table. Backend filters scheduled posts past their scheduled_at datetime.

---

## Claude's Discretion

- Pagination architecture: client-side JS (load all, paginate with state) — driven by static export constraint
- Related posts: same-category, most recent, capped at 3
- Newsletter block: inline component reusing newsletter.php endpoint
- Categories: derived from post.category values, no separate entity
- Sample content: 2 blog posts, 2-3 case studies, 1-2 guides via INSERT IGNORE

## Deferred Ideas

- View count tracking / true popularity analytics — future phase
- Comment system on blog posts — future phase
- Tag-based filtering (tags field exists in DB) — future phase
- Hard/soft gating for guides — deferred, user chose no-gate
