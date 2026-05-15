# Phase 4: Content Pages — Blog, Case Studies & Guides - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Blog, case studies, and guides become fully functional content hubs. This means adding pagination (10/page, numbered nav), filter by category, sort by editorial position, and search to all three listing pages. Blog detail gets related posts + newsletter block. Admin gets three-state scheduling for blog posts. Guides use a no-gate lead model (newsletter signup at end). All three content types get 2-3 sample entries seeded. No new capabilities beyond what the roadmap scopes.

</domain>

<decisions>
## Implementation Decisions

### Pagination, Filter & Search
- **D-01:** All filtering, search, and pagination are **client-side JS** — load all posts from the API once, then paginate/filter/sort in React state. Consistent with static export constraint (no SSR). Already partially implemented on blog listing page (search + category filter exist).
- **D-02:** Page size = **10 posts per page** with numbered navigation (1 2 3 … N buttons). Client-side slice of the filtered array.
- **D-03:** Filter by category = derived from `post.category` values across all loaded posts — no separate categories table. "All" + unique category chips/buttons. Already implemented on blog listing.
- **D-04:** **"Sort by popular" = editorial order** — maps to the existing `position` field in the DB (`ORDER BY position ASC`). No view tracking, no counter column. The UI label "Popular" is acceptable marketing language for an editorially curated sort.
- **D-05:** "Sort by editorial" = most recent first (`published_at DESC`). Two sort buttons: Popular (position) and Recent (date). Default: Popular.
- **D-06:** Search = title + excerpt full-text match (client-side `.includes()` — already implemented on blog listing). Apply across all three content types.

### Guide Lead Capture
- **D-07:** **No gate** — guides are fully readable without any email submission. A **newsletter signup block appears at the end** of each guide detail page (same pattern as blog posts, see D-11). B2B decision-makers close gated content tabs; trust-building via full access converts better for this audience.
- **D-08:** Lead capture still happens via the newsletter block at end + the site-wide contact form. Guides do NOT block reading. GUIDE-01 "captures lead" = newsletter signup block at end.

### Blog Scheduling
- **D-09:** Admin blog editor gets a **three-state publish control**: radio group with "Publish Now" / "Schedule" / "Save as Draft". Selecting "Schedule" reveals a date-time picker (`<input type="datetime-local">`).
- **D-10:** Backend adds a `scheduled_at DATETIME NULL` column to the `blogs` table. Status values: `published`, `scheduled`, `draft`. A `scheduled` post becomes publicly visible only after `scheduled_at <= NOW()` — the backend GET endpoint filters: `WHERE status = 'published' OR (status = 'scheduled' AND scheduled_at <= NOW())`.
- **D-11:** Admin blog listing in admin panel shows status badge per post (Published / Scheduled / Draft). Scheduled posts show the scheduled date.

### Related Posts (Blog Detail)
- **D-12:** Related posts = **same category, most recent**, capped at 3. Algorithm: `posts.filter(p => p.category === currentPost.category && p.slug !== currentPost.slug).slice(0, 3)`. Applied client-side from the full posts array (already fetched for listing). If fewer than 3 in same category, pad with most recent posts from any category.
- **D-13:** Related posts section appears after the main article body, before the newsletter block.

### Newsletter Block
- **D-14:** Newsletter signup block at end of **blog posts and guides** = a self-contained inline component reusing the existing newsletter POST endpoint (`/backend/api/newsletter.php`). **Not** the footer newsletter — a dedicated inline variant with heading like "Stay ahead of the curve" + email input + subscribe button. Same success/error state pattern as the footer.
- **D-15:** Newsletter block does NOT appear on case study detail pages (case studies are proof-of-work, not content marketing — different conversion goal).

### Sample Content
- **D-16:** **2 sample blog posts** — SEO-focused, genuine B2B content. Seeded via `init_db.php` INSERT IGNORE.
- **D-17:** **2-3 sample case studies** — radixweb.com/case-studies format: problem → approach → results structure. Seeded via `init_db.php` INSERT IGNORE.
- **D-18:** **1-2 sample guides** — lead magnet format, topic relevant to AI automation agency. Seeded via `init_db.php` INSERT IGNORE.

### Admin Categories
- **D-19:** "Categories manageable from admin" (BLOG-08) = admin can **set category string per post** (free text or dropdown of existing categories). No separate categories table or entity. The category dropdown in the admin post editor auto-populates from all existing `DISTINCT category` values fetched from the API, plus a free-text "Add new" option.

### Claude's Discretion
- Exact visual layout of pagination controls (numbered buttons style)
- Loading skeleton vs spinner on listing pages
- Empty state design when no posts match filter/search
- Exact card layout on listing pages (already largely defined by existing blog listing page)
- Number of related posts shown if same-category has <3 posts

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Frontend — Content Listing Pages
- `frontend/src/app/blog/page.tsx` — Current blog listing with search + category filter (client-side). Pattern to extend with pagination and sort.
- `frontend/src/app/case-studies/page.tsx` — Case studies listing (if exists, extend; otherwise create matching blog pattern)
- `frontend/src/app/guides/page.tsx` — Guides listing (same)

### Existing Frontend — Detail Page Clients
- `frontend/src/components/page-clients/blog-details-client.tsx` — Blog detail rendering. Extend with related posts + newsletter block.
- `frontend/src/components/page-clients/case-study-client.tsx` — Case study detail.
- `frontend/src/components/page-clients/guide-client.tsx` — Guide detail. Extend with newsletter block at end.

### Existing Backend APIs
- `backend/api/blogs.php` — Blog CRUD. Has `status`, `category`, `position`, `published_at`. Needs `scheduled_at` column + scheduling status support.
- `backend/api/case_studies.php` — Case studies CRUD.
- `backend/api/guides.php` — Guides CRUD.
- `backend/api/newsletter.php` — Newsletter subscribe endpoint. Reused for inline newsletter blocks.
- `backend/init_db.php` — DB init + seed. Extend with sample content INSERT IGNORE rows.

### Admin Pattern Reference
- `.planning/phases/03-service-pages/03-CONTEXT.md` — Admin editor pattern (tab UI, save button feedback, autoReset, api.post pattern). Phase 4 admin scheduling UI follows the same conventions.
- `frontend/src/app/admin/blog/page.tsx` — Existing admin blog editor (if exists). Extend with scheduling controls.

### Design References
- radixweb.com — Blog, case studies, guides listing and detail page layout reference
- radixweb.com/case-studies — Case study format (problem → approach → results)
- radixweb.com/guides — Guides listing format

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/app/blog/page.tsx` — Client-side search + category filter already implemented. Reuse/extend for all three content types.
- `backend/api/newsletter.php` — Newsletter subscribe endpoint already exists. Inline newsletter block just needs a UI component on top.
- `frontend/src/components/ui/badge.tsx` — Use for category chips and status badges.
- `frontend/src/components/ui/card.tsx` — Use for post cards on listing pages.
- Position field in blogs table — already exists, already returned by API. Editorial sort is zero backend work.

### Established Patterns
- Client-side data fetching: `useEffect` + `api.get()` + `useState` — consistent with Phase 3 service pages.
- Admin save pattern: `autoReset` feedback cycle (idle → Saving → Saved/Error) — replicate for scheduling controls.
- INSERT IGNORE for seed data — established in Phase 3 init_db.php.

### Integration Points
- Admin blog editor: add scheduling radio + datetime-local input + `scheduled_at` field to POST payload.
- Blog backend GET: update WHERE clause to include scheduled posts past their scheduled_at date.
- Blog detail page: add related posts section + newsletter block after article body.
- Guide detail page: add newsletter block after guide body.

</code_context>

<specifics>
## Specific Ideas

- Design reference: radixweb.com for all content listing and detail pages
- Three-state scheduling: "Publish Now" / "Schedule" (+ datetime-local picker) / "Save as Draft"
- Popular sort = position field (editorially curated) — no view tracking

</specifics>

<deferred>
## Deferred Ideas

- View count tracking / true popularity analytics — out of scope, would need a separate analytics endpoint
- Comment system on blog posts — new capability, future phase
- Blog post tagging UI (tags field exists in DB but no tag-based filter) — future phase
- Hard or soft gating for guides — user chose no-gate approach; revisit if conversion data suggests otherwise
- Categories as a separate DB entity with CRUD — current approach (derived from post.category) sufficient for now

</deferred>

---

*Phase: 04-content-pages-blog-case-studies-guides*
*Context gathered: 2026-05-15*
