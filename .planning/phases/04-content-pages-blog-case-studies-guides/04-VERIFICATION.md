---
phase: 04-content-pages-blog-case-studies-guides
verified: 2026-05-15T00:20:00Z
status: human_needed
score: 20/20 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 17/20
  gaps_closed:
    - "blog/[slug]/page.tsx generateStaticParams now contains ai-automation-eliminates-manual-work and seo-age-of-ai-llm-answers"
    - "case-studies/[slug]/page.tsx generateStaticParams now contains finflows-back-office-automation and growthloop-linkedin-scale"
    - "case-study-client.tsx imports API_BASE_URL from @/lib/constants and uses it for both case_studies.php fetch calls — no hardcoded /backend/api paths remain"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Blog listing page shows seeded posts and category filter/sort work"
    expected: "Visiting /blog shows 'How AI Automation Eliminates 14 Hours...' and 'SEO in the Age of AI...' with working Popular/Recent sort and category filter chips"
    why_human: "Requires live site or running dev server with populated DB to verify API data renders correctly"
  - test: "Blog detail page for seeded posts renders correctly"
    expected: "Visiting /blog/ai-automation-eliminates-manual-work shows full blog post with sections, author info, related articles (capped at 3), and dark newsletter block"
    why_human: "Requires browser and live DB; generateStaticParams fix is now in place"
  - test: "Case study detail page renders hero stats and structured sections from DB"
    expected: "Visiting /case-studies/finflows-back-office-automation shows dark hero with 4 stat cards and challenge/solution/metrics sections rendered"
    why_human: "Requires browser and live DB; generateStaticParams fix is now in place"
  - test: "Admin blog scheduling UI shows three radio options and datetime picker"
    expected: "Selecting 'Schedule' in admin blog Settings tab reveals a datetime-local input; status badge shows blue 'Scheduled · Jan 15' format"
    why_human: "Interactive UI behavior requires browser"
  - test: "Admin case studies sections editor"
    expected: "Each section type renders its specific fields; save returns {status: 'success'}"
    why_human: "Requires browser and live DB interaction"
---

# Phase 4: Content Pages — Blog, Case Studies, Guides — Verification Report

**Phase Goal:** Build and wire all content pages (blog, case studies, guides) with real API data, pagination, sorting, filtering, and full admin CRUD editors — eliminating all hardcoded/demo content and mock data from the public site.
**Verified:** 2026-05-15
**Status:** human_needed
**Re-verification:** Yes — after gap closure by plan 04-08 (was 17/20, now 20/20)

---

## Re-Verification: Gap Closure Confirmation

All three previously-failed items were verified directly against the current codebase:

**Gap 1 — blog/[slug]/page.tsx generateStaticParams: CLOSED**

`frontend/src/app/blog/[slug]/page.tsx` lines 4-7 now contain exactly:
- `{ slug: "ai-automation-eliminates-manual-work" }`
- `{ slug: "seo-age-of-ai-llm-answers" }`

The old demo slugs (ai-automation-eliminating-manual-work, lead-qualification-bot) are gone. These match the seeded slugs in `backend/init_db.php`.

**Gap 2 — case-studies/[slug]/page.tsx generateStaticParams: CLOSED**

`frontend/src/app/case-studies/[slug]/page.tsx` lines 4-7 now contain exactly:
- `{ slug: "finflows-back-office-automation" }`
- `{ slug: "growthloop-linkedin-scale" }`

The old demo slugs (finflows-automation, retailbot-ai-support, proptrack-lead-automation, medsync-clinic-automation) are gone.

**Gap 3 — case-study-client.tsx API_BASE_URL: CLOSED**

`frontend/src/components/page-clients/case-study-client.tsx`:
- Line 11: `import { API_BASE_URL } from "@/lib/constants";`
- Line 172: `fetch(\`${API_BASE_URL}/case_studies.php?slug=${slug}\`)`
- Line 178: `fetch(\`${API_BASE_URL}/case_studies.php\`)`

Zero occurrences of the hardcoded string `/backend/api` remain in the file.

**Regression check on passing items:** No changes were detected to any of the 17 previously-verified artifacts. The re-verification scope is limited to the three modified files per the 04-08-SUMMARY.md key-files list.

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Blog posts can have status 'published', 'scheduled', or 'draft' — backend filters scheduled posts by scheduled_at <= NOW() | VERIFIED | blogs.php line 22 (auto-migrate), line 47 (slug query), line 57 (list query), line 97 ($d array) — all present |
| 2  | At least 2 seeded blog posts exist in init_db.php with status='published' | VERIFIED | 2 INSERT IGNORE INTO blogs; both have 'published' status |
| 3  | At least 2 seeded case studies exist with problem→approach→results sections | VERIFIED | 2 INSERT IGNORE INTO case_studies with hero_stats, sections JSON, published_date '2025-03-14' and '2025-04-10' |
| 4  | At least 2 seeded guides exist with relevant content | VERIFIED | 2 INSERT IGNORE INTO guides with full HTML content |
| 5  | Blog listing shows 10 posts per page with numbered pagination | VERIFIED | blog/page.tsx: PAGE_SIZE=10, paginatedPosts.slice, totalPages, numbered buttons rendered |
| 6  | User can filter by category chip and sort by Popular/Recent without page reload | VERIFIED | blog/page.tsx: selectedCategory state, sortBy state, filteredPosts→sortedPosts→paginatedPosts pipeline |
| 7  | Blog detail shows related posts (same category, capped at 3) before newsletter block | VERIFIED | blog-details-client.tsx sameCategory algorithm, 3-post cap, "Related Articles" heading before bg-slate-900 block |
| 8  | Newsletter signup block appears on blog detail pages using API_BASE_URL/newsletter.php | VERIFIED | blog-details-client.tsx: imports API_BASE_URL, uses `${API_BASE_URL}/newsletter.php`; no hardcoded path |
| 9  | Case studies listing shows paginated results with Popular/Recent sort and search | VERIFIED | case-studies/page.tsx: PAGE_SIZE=10, paginatedCases, sortBy, currentPage — all present |
| 10 | Case study detail renders hero stats + structured sections + related case studies | VERIFIED | case-study-client.tsx: CaseSectionBlock, cs.hero_stats, cs.sections.map, sameIndustry algorithm, "Related Case Studies" heading |
| 11 | Guides listing shows 10/page with category filter chips and Popular/Recent sort | VERIFIED | guides/page.tsx: PAGE_SIZE=10, selectedCategory, sortBy, paginatedGuides — all present |
| 12 | Guide cards navigate to /guides/{id} (not cta_link) | VERIFIED | guides/page.tsx: `<Link href={`/guides/${guide.id}`}` as absolute overlay; cta_link not used for navigation |
| 13 | Guide detail renders full content HTML and newsletter block using API_BASE_URL | VERIFIED | guide-client.tsx: dangerouslySetInnerHTML, `${API_BASE_URL}/newsletter.php`, bg-slate-900 newsletter section |
| 14 | Admin blog editor has three-state scheduling (Publish Now / Schedule / Save as Draft) | VERIFIED | admin/blog/page.tsx: datetime-local input, "Publish Now"/"Schedule"/"Save as Draft" labels, bg-blue-50 badge, datalist category autocomplete |
| 15 | Admin case studies has full CRUD editor with hero stats, sections, save_case action | VERIFIED | admin/case-studies/page.tsx: save_case, payload key `case:`, hero_stats editor, CaseSection interface, Add Section button, AdminLayout |
| 16 | Admin guides has per-guide CRUD editor with save_guide/delete_guide backend actions | VERIFIED | guides.php lines 18/50: save_guide and delete_guide actions present; admin/guides/page.tsx: safeFetch, AdminLayout, no localStorage |
| 17 | Backend guides.php preserves update_guides for backward compatibility | VERIFIED | guides.php: update_guides still present |
| 18 | Seeded blog posts are reachable via their detail page URL (generateStaticParams matches) | VERIFIED | blog/[slug]/page.tsx generateStaticParams: { slug: "ai-automation-eliminates-manual-work" }, { slug: "seo-age-of-ai-llm-answers" } — exact match with init_db.php seeds |
| 19 | Seeded case studies are reachable via their detail page URL (generateStaticParams matches) | VERIFIED | case-studies/[slug]/page.tsx generateStaticParams: { slug: "finflows-back-office-automation" }, { slug: "growthloop-linkedin-scale" } — exact match with init_db.php seeds |
| 20 | case-study-client uses API_BASE_URL consistently (not hardcoded /backend/api path) | VERIFIED | Line 11: imports API_BASE_URL from @/lib/constants; lines 172 and 178: both fetch calls use `${API_BASE_URL}/case_studies.php`; zero hardcoded /backend/api occurrences |

**Score:** 20/20 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `backend/api/blogs.php` | Blog CRUD with scheduled_at scheduling filter | VERIFIED | scheduled_at in auto-migrate, WHERE clause, $d array |
| `backend/init_db.php` | 2 blog + 2 case study + 2 guide seeds | VERIFIED | 2+2+2 INSERT IGNORE statements |
| `frontend/src/app/blog/page.tsx` | Blog listing with pagination + sort + filter + search | VERIFIED | PAGE_SIZE, currentPage, sortBy, paginatedPosts all present |
| `frontend/src/components/page-clients/blog-details-client.tsx` | Related posts + newsletter block | VERIFIED | sameCategory algorithm, API_BASE_URL/newsletter.php, bg-slate-900 section |
| `frontend/src/app/case-studies/page.tsx` | Case studies listing with pagination + sort + filter + search | VERIFIED | PAGE_SIZE, paginatedCases, sortBy — all present |
| `frontend/src/components/page-clients/case-study-client.tsx` | Full case study detail with sections, related, and API_BASE_URL | VERIFIED | CaseSectionBlock, sameIndustry, hero_stats, Related Case Studies heading, API_BASE_URL import |
| `frontend/src/app/guides/page.tsx` | Guides listing with pagination + sort + category filter | VERIFIED | PAGE_SIZE, selectedCategory, sortBy, paginatedGuides — all present |
| `frontend/src/components/page-clients/guide-client.tsx` | Guide detail with content rendering and newsletter | VERIFIED | dangerouslySetInnerHTML, API_BASE_URL/newsletter.php, bg-slate-900 |
| `frontend/src/app/admin/blog/page.tsx` | Admin blog with three-state scheduling + category autocomplete | VERIFIED | scheduled_at, datetime-local, Publish Now/Schedule/Save as Draft, datalist |
| `frontend/src/app/admin/case-studies/page.tsx` | Full case study admin CRUD | VERIFIED | save_case, hero_stats, CaseSection, AdminLayout, Add Section |
| `backend/api/guides.php` | save_guide + delete_guide individual actions | VERIFIED | save_guide line 18, delete_guide line 50, update_guides preserved |
| `frontend/src/app/admin/guides/page.tsx` | Full guides admin CRUD | VERIFIED | save_guide, delete_guide, AdminLayout, safeFetch, no localStorage |
| `frontend/src/app/blog/[slug]/page.tsx` | generateStaticParams matches seeded blog slugs | VERIFIED | ai-automation-eliminates-manual-work and seo-age-of-ai-llm-answers present; old demo slugs removed |
| `frontend/src/app/case-studies/[slug]/page.tsx` | generateStaticParams matches seeded case study slugs | VERIFIED | finflows-back-office-automation and growthloop-linkedin-scale present; old demo slugs removed |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| blogs.php GET handler | blogs table WHERE clause | scheduled_at <= NOW() | VERIFIED | `(status = 'published') OR (status = 'scheduled' AND scheduled_at <= NOW())` |
| blog/page.tsx filteredPosts | paginatedPosts slice | filteredPosts.slice((currentPage-1)*PAGE_SIZE) | VERIFIED | sortedPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) |
| blog-details-client.tsx | newsletter.php via API_BASE_URL | fetch using API_BASE_URL from @/lib/constants | VERIFIED | `fetch(\`${API_BASE_URL}/newsletter.php\`)` |
| case-studies/page.tsx | paginatedCases slice | filteredCases.slice((currentPage-1)*PAGE_SIZE) | VERIFIED | sortedCases.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) |
| case-study-client.tsx | sections array rendering | cs.sections.map(section => CaseSectionBlock) | VERIFIED | `{cs.sections.map((section, i) => (<CaseSectionBlock .../>))}` |
| case-study-client.tsx | case_studies.php | fetch via API_BASE_URL | VERIFIED | Both fetch calls use `${API_BASE_URL}/case_studies.php` — no hardcoded paths |
| admin/blog/page.tsx savePost() | blogs.php save_post action | scheduled_at in POST payload | VERIFIED | BlogPost interface includes scheduled_at; full `p` object sent as payload |
| admin/case-studies/page.tsx saveCase() | case_studies.php | POST { action: 'save_case', case: c } | VERIFIED | `JSON.stringify({ action: "save_case", case: c })` |
| admin/guides/page.tsx saveGuide() | guides.php save_guide action | POST { action: 'save_guide', guide: g } | VERIFIED | `JSON.stringify({ action: "save_guide", guide: g })` |
| guides/page.tsx GuideCard | /guides/{guide.id} | Link href using guide.id | VERIFIED | `href={\`/guides/${guide.id}\`}` — cta_link not used for navigation |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| blog/page.tsx | posts[] | api.get(endpoints.blogs) → blogs.php → SELECT FROM blogs WHERE published/scheduled | Yes — DB query with scheduling filter | FLOWING |
| blog-details-client.tsx | post, related[] | fetch(`${API_BASE_URL}/blogs.php?slug=`) + API_BASE_URL/blogs.php | Yes — DB queries via API_BASE_URL | FLOWING |
| case-studies/page.tsx | cases[] | api.get(endpoints.caseStudies) → case_studies.php → SELECT * | Yes — DB query | FLOWING |
| case-study-client.tsx | cs, related[] | fetch(`${API_BASE_URL}/case_studies.php`) — consistent with all other page-clients | Yes — DB query via API_BASE_URL | FLOWING |
| guides/page.tsx | guides[] | api.get(endpoints.guides) → guides.php → SELECT * FROM guides | Yes — DB query | FLOWING |
| guide-client.tsx | guide | safeFetch(`${API_BASE_URL}/guides.php`) then client-side find | Yes — DB query; falls back to FALLBACK_GUIDES on error | FLOWING (with error fallback) |

**Note on fallback data:** blog/page.tsx has a hardcoded catch block that injects 2 dummy posts on API error. guide-client.tsx uses FALLBACK_GUIDES (6 old-content guides) on API failure. These are error fallbacks, not primary paths.

**Note on GUIDE-01 interpretation:** CONTEXT.md (D-07, D-08) explicitly confirms "No gate — guides are fully readable without any email submission. GUIDE-01 'captures lead' = newsletter signup block at end." The newsletter block satisfies GUIDE-01 per design decision.

---

## Behavioral Spot-Checks

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| blog/page.tsx has real API fetch | grep api.get in blog/page.tsx | `api.get(endpoints.blogs)` found | PASS |
| Newsletter uses API_BASE_URL not hardcoded | grep hardcoded path in blog-details-client | No match | PASS |
| guides.php save_guide action exists | grep save_guide in guides.php | Found at line 18 | PASS |
| admin case studies uses correct action name | grep save_case_study in admin/case-studies | Count = 0 | PASS |
| generateStaticParams for blog matches seeded slugs | Check ai-automation-eliminates-manual-work and seo-age-of-ai-llm-answers in blog/[slug]/page.tsx | Both present at lines 5-6 | PASS |
| generateStaticParams for case studies matches seeded slugs | Check finflows-back-office-automation and growthloop-linkedin-scale in case-studies/[slug]/page.tsx | Both present at lines 5-6 | PASS |
| case-study-client uses API_BASE_URL | grep API_BASE_URL import and usage in case-study-client.tsx | Import at line 11; used at lines 172, 178; zero hardcoded /backend/api occurrences | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| BLOG-01 | 04-01 | 2 sample SEO-focused blog posts | SATISFIED | 2 INSERT IGNORE INTO blogs with published status and rich sections JSON |
| BLOG-02 | 04-02 | Pagination — 10 posts per page | SATISFIED | blog/page.tsx: PAGE_SIZE=10, paginatedPosts |
| BLOG-03 | 04-02 | Filter by category | SATISFIED | selectedCategory state, category chips, filteredPosts |
| BLOG-04 | 04-02 | Sort by popular/editorial | SATISFIED | sortBy state, sortedPosts (position ASC / published_at DESC) |
| BLOG-05 | 04-02 | Search functionality | SATISFIED | searchQuery state, title+excerpt filter in filteredPosts |
| BLOG-06 | 04-02 | Related posts section on blog detail | SATISFIED | sameCategory algorithm, 3-post cap, RelatedArticles section in JSX |
| BLOG-07 | 04-01, 04-05 | Blog scheduling from admin | SATISFIED | scheduled_at in blogs.php; admin has datetime-local picker with three-state radio |
| BLOG-08 | 04-05 | Categories manageable from admin | SATISFIED | datalist element with existingCategories derived from posts; free-text input |
| BLOG-09 | 04-02 | Newsletter signup at end of each blog post | SATISFIED | API_BASE_URL/newsletter.php newsletter block with email input |
| BLOG-10 | 04-01, 04-02, 04-08 | All CTAs and links working | SATISFIED | generateStaticParams now contains correct seeded slugs; static HTML will be generated for all seeded detail pages |
| BLOG-11 | 04-02 | Design aligned to radixweb.com reference | NEEDS HUMAN | Visual alignment requires browser review |
| CS-01 | 04-01, 04-08 | 2-3 sample case studies (problem→approach→results) | SATISFIED | 2 INSERT IGNORE with hero_stats + sections JSON; generateStaticParams corrected |
| CS-02 | 04-03, 04-08 | Pagination, filter, sort, search | SATISFIED | case-studies/page.tsx: PAGE_SIZE=10, paginatedCases, sortBy, selectedIndustry; detail pages reachable |
| CS-03 | 04-03, 04-06 | All case study content editable from admin | SATISFIED | admin/case-studies/page.tsx: full CRUD with hero stats, sections editor, save_case/delete_case |
| CS-04 | 04-03 | Design aligned to radixweb.com reference | NEEDS HUMAN | Visual alignment requires browser review |
| GUIDE-01 | 04-01, 04-04 | Guides work as lead magnets | SATISFIED | Per D-07/D-08: no gate by design; newsletter signup at end = lead capture |
| GUIDE-02 | 04-04 | Pagination, filter, sort, search | SATISFIED | guides/page.tsx: PAGE_SIZE=10, selectedCategory, sortBy, paginatedGuides |
| GUIDE-03 | 04-04 | Newsletter signup at end of each guide | SATISFIED | guide-client.tsx: API_BASE_URL/newsletter.php newsletter block |
| GUIDE-04 | 04-07 | All guide content editable from admin | SATISFIED | admin/guides/page.tsx: per-guide CRUD with save_guide/delete_guide; guides.php patched |
| GUIDE-05 | 04-04 | Design aligned to radixweb.com reference | NEEDS HUMAN | Visual alignment requires browser review |

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `frontend/src/components/page-clients/blog-details-client.tsx` | DEMO_POST and DEMO_RELATED used as error fallback | Info | Old demo content appears if API call fails; not primary path |
| `frontend/src/app/blog/page.tsx` | Hardcoded dummy posts in catch block | Info | Old demo content appears on API failure |
| `frontend/src/components/page-clients/guide-client.tsx` | FALLBACK_GUIDES with old content (6 old-format guides) used on API failure | Info | Old content appears on API failure; not primary path |

No blockers remain. The three previously-blocker items (wrong generateStaticParams slugs, hardcoded API paths) are fully resolved.

---

## Human Verification Required

### 1. Blog listing rendering with real data

**Test:** Visit /blog on a deployed instance with the DB seeded
**Expected:** Two seeded posts appear with correct titles, categories, and images; Popular/Recent sort changes order; category filter chips filter correctly
**Why human:** Requires live DB with seeded content and a running instance

### 2. Blog detail page for seeded posts

**Test:** Visit /blog/ai-automation-eliminates-manual-work on a deployed instance
**Expected:** Full blog post renders with sections (overview, challenge, solution, metrics), author info, related articles section (capped at 3), dark newsletter block
**Why human:** Requires browser and live DB; generateStaticParams fix is now in place and this test is unblocked

### 3. Case study detail page rendering

**Test:** Visit /case-studies/finflows-back-office-automation on a deployed instance
**Expected:** Dark hero section with 4 stat cards (60%, 40+, 320h, 4.2x), challenge/approach/results sections, related case studies section, Connect CTA
**Why human:** Requires browser and live DB; generateStaticParams fix is now in place and this test is unblocked

### 4. Admin blog scheduling flow

**Test:** Open admin blog, click Settings tab on a post, select "Schedule" radio, verify datetime picker appears; set a future date, save — verify status badge shows blue "Scheduled · [date]"
**Expected:** Datetime picker appears only when Schedule is selected; badge shows blue format
**Why human:** Interactive UI behavior requires browser

### 5. Admin case studies sections editor

**Test:** Open admin case studies, create new case study, add sections of different types (challenge, solution, metrics), save — verify saved successfully via API response
**Expected:** Each section type renders its specific fields; save returns {status: "success"}
**Why human:** Requires browser and live DB interaction

---

## Summary

All 20 must-haves are now verified. The three previously-failed items (gaps 1, 2, 3) were fixed by plan 04-08 and confirmed by direct file inspection:

- `blog/[slug]/page.tsx` generateStaticParams contains the exact seeded slugs from `init_db.php`
- `case-studies/[slug]/page.tsx` generateStaticParams contains the exact seeded slugs from `init_db.php`
- `case-study-client.tsx` imports and uses `API_BASE_URL` from `@/lib/constants` for all `case_studies.php` fetch calls — consistent with every other page-client component

No regressions were found in the 17 previously-passing items. The remaining 5 open items require human testing in a browser with a live DB (visual design alignment and interactive UI flows).

---

_Verified: 2026-05-15 (re-verification after 04-08 gap closure)_
_Verifier: Claude (gsd-verifier)_
