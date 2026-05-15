# Phase 4: Content Pages — Blog, Case Studies & Guides - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15 (updated 2026-05-15)
**Phase:** 04-content-pages-blog-case-studies-guides
**Areas discussed:** Guide lead capture, Popular sort definition, Blog scheduling, Guide listing completeness, Sort across all three types, Newsletter block spec, Related items scope

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

---

## Session 2 — Update (2026-05-15)

## Guide Listing Completeness

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — add category filter chips | Matches blog/case studies pattern. Consistent UX. | ✓ |
| No — keep search-only | Guides are few in number, filtering adds little value now. | |

**User's choice:** Add category filter chips.

| Option | Description | Selected |
|--------|-------------|----------|
| Detail page /guides/{id} | Consistent with blog/case studies navigation. | ✓ |
| cta_link (external) | Treat guides as downloadable assets. | |
| Both — body to detail, CTA button uses cta_link | User reads on-site, CTA links out. | |

**User's choice:** Guide cards link to `/guides/{id}` detail page.

---

## Sort Across All Three Types

| Option | Description | Selected |
|--------|-------------|----------|
| Same sort on all three | Popular + Recent on blog, case studies, and guides. | ✓ |
| Case studies only — no sort on guides | Guides have few entries, less useful. | |
| No sort on case studies or guides | Sort is blog-specific. | |

**User's choice:** Same Popular/Recent sort on all three content types.

| Option | Description | Selected |
|--------|-------------|----------|
| "Industry" (reflects DB field) | Honest and clear. | |
| "Category" (consistent label) | Same label everywhere for consistency. | ✓ |

**User's choice:** Filter label = "Category" across all three types.

---

## Newsletter Block Spec

| Option | Description | Selected |
|--------|-------------|----------|
| Distinct section — larger, more prominent | Full-width band with heading, subtext, input. | ✓ |
| Minimal inline card — similar to footer | Compact, same visual weight as footer newsletter. | |
| Claude's discretion | Leave styling to planner/executor. | |

**User's choice:** Distinct, prominent full-width section.

| Option | Description | Selected |
|--------|-------------|----------|
| Same /backend/api/newsletter.php | Reuses existing endpoint. No new backend work. | ✓ |
| Different endpoint — tag by source | Track whether signup came from blog or guide. | |

**User's choice:** Same endpoint for simplicity.

---

## Related Items Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — related case studies on detail page | Same-industry, capped at 2-3. Client-side. | ✓ |
| No — case studies standalone | Each is unique, related section adds clutter. | |

**User's choice:** Case study detail pages get related case studies.

---

## Session 2 Deferred Ideas

- Newsletter source tracking (blog vs guide signup origin)
- Comment system on blog posts
- Tag-based filtering
- Hard/soft gating for guides
