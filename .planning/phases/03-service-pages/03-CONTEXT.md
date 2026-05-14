# Phase 3: Service Pages - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Make all 11 service pages admin-editable with a consistent visual format, fully linked buttons, and per-service content covering: hero, features (3 cards), 6-step delivery roadmap, market impact numbers, CTA copy, and testimonials. Build the `/admin/services` admin page and the `service_content` DB backend to power it.

No new public routes — work is within `frontend/src/app/services/[slug]/page.tsx` and the new admin page. The comparison/gap section stays hardcoded per service in code (not in requirements scope). Service page design target: benai.co/custom-solutions.

</domain>

<decisions>
## Implementation Decisions

### DB Architecture (SVC-03)
- **D-01:** New `service_content` table: `slug VARCHAR(50)`, `section VARCHAR(50)`, `content JSON NOT NULL`, `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`, `PRIMARY KEY (slug, section)`. One row per service+section pair. Add to `init_db.php` with `CREATE TABLE IF NOT EXISTS`.
- **D-02:** Seed `service_content` from the existing `SERVICES` hardcoded object and `DEFAULT_SECTIONS` at init_db time so all 11 services have content immediately on first deploy (no empty-state admin experience).

### PHP Endpoint
- **D-03:** New `backend/api/service_content.php`. GET with `?slug=ai-seo` returns all sections for that service as `{ status: "success", data: { hero: {...}, features: {...}, ... } }`. GET with `?slug=ai-seo&section=hero` returns single section. POST with `action=save_section` + `slug` + `section` + `content` JSON saves one section. Follow existing action-based POST pattern from `site_content.php`.

### Admin Page (SVC-03)
- **D-04:** New page at `frontend/src/app/admin/services/page.tsx`. Add "SERVICES" to admin sidebar `admin-layout.tsx` (position: between "SITE CONTENT" and "PARTNER LOGOS", icon: `Layers` or `Globe`).
- **D-05:** Admin page UI: service selector dropdown at top (lists all 11 service names/slugs), then 6 section tabs: **Hero | Features | Roadmap | Market Impact | CTA | Testimonials**. On service change: fetch all sections for that slug from service_content.php. Follow the site-content page tab pattern (`/admin/site-content`).
- **D-06:** Each tab has a form + "Save [Section]" button. On save: POST to service_content.php with action=save_section. Show saving/saved/error status per tab (same as site-content pattern).

### Editable Content Per Section
- **D-07 Hero tab fields:** badge (eyebrow), heroLine1, heroLine2, heroCopy, ctaPrimary (button label), pills (3 text inputs), snapshotTitle, snapshotRows (4 text inputs), statLabel1, statValue1, statLabel2, statValue2.
- **D-08 Features tab fields:** 3 feature cards, each: title (text input) + description (textarea). Icon not editable — stays hardcoded per card from a small preset (Zap, Target, Layers, ShieldCheck, TrendingUp etc.). No icon picker needed.
- **D-09 Roadmap tab fields:** 6 steps, each: title (text input) + desc (textarea, 2-line cap guideline). Section heading text (roadmapTitle, roadmapCopy) also editable.
- **D-10 Market Impact tab fields:** outcomesTitle, outcomesCopy, 2 outcome cards (each: quote, company, sector, metric value, metric label), 4 stats (each: value + label).
- **D-11 CTA tab fields:** ctaBadge, ctaTitle, ctaCopy. (Maps to the `Connect` or final CTA section at the bottom.)
- **D-12 Testimonials tab fields:** 2–3 testimonials, each: quote (textarea) + role (text) + company (text). Stored as array in service_content (slug=X, section="testimonials").

### Sections NOT Admin-Editable in Phase 3
- **D-13:** Comparison/gap section (`gapHeading`, `gapLeftTitle/Items`, `gapRightTitle/Items`) — stays hardcoded in `SERVICES` constant. Not in requirements scope.
- **D-14:** Feature card icons — hardcoded per card. No icon picker.

### Service Page Data Fetch (SVC-03)
- **D-15:** `frontend/src/app/services/[slug]/page.tsx` becomes a hybrid: fetches from `api/service_content.php?slug={slug}` on client mount. Falls back to the existing `SERVICES[slug]` hardcoded object if API fails or returns empty sections. Exact same `safeFetch()` + fallback pattern used in Phase 2.
- **D-16:** Service page is a `"use client"` component (already the case due to Next.js static export). On mount: one fetch call gets all 6 sections for the slug.

### Section Format Consistency (SVC-01, SVC-08)
- **D-17:** All sections must follow eyebrow badge → heading → max 2-sentence description. Audit all section headings in the page for: missing eyebrows, heading splits (line1/accent on line2), and descriptions exceeding 2 sentences. Fix any violations.
- **D-18:** Design reference is benai.co/custom-solutions. Current sections (hero, comparison, features/platform, roadmap, outcomes, testimonials, CTA) already match that structure in layout — fixes are copy and minor structural alignment only.

### Button Destinations (SVC-02)
- **D-19:** Hero primary button → `/contact-us` (already correct for most services — verify all 11).
- **D-20:** Hero secondary button text (`ctaSecondary`) exists in data but is NOT rendered in the current JSX — it's dead data. Do NOT add a second hero button in Phase 3. Remove the `ctaSecondary` field from the SERVICES type or keep it unused — Claude decides.
- **D-21:** Feature card "Get Started" links → `/contact-us` (already correct, verify).
- **D-22:** CTA section buttons → `/contact-us` (already correct via `Connect` component).
- **D-23:** No `#` placeholder links should remain on any service page after Phase 3.

### Claude's Discretion
- Exact JSON field names inside each section's content blob (must be consistent between admin form, API payload, and page render)
- Whether to seed service_content in `init_db.php` via INSERT IGNORE or a separate seed call
- Loading skeleton or spinner while fetching service content on page load
- Admin form layout within each tab (label placement, input ordering)
- Whether `roadmapTitle`/`roadmapCopy` in the Roadmap tab are per-service or shared across all services — Claude decides based on whether DEFAULT_SECTIONS values are already distinct per service (they aren't — use per-service for roadmapTitle minimum)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Service Page
- `frontend/src/app/services/[slug]/page.tsx` — Full current implementation: SERVICES record (11 slugs), DEFAULT_SECTIONS object, all section JSX. Executor must read the full file before modifying.

### Phase 2 Patterns (follow exactly)
- `frontend/src/app/admin/site-content/page.tsx` — Admin tab pattern, saveSection() helper, TabId union, state shape. Service admin page MUST follow this exact pattern.
- `backend/api/site_content.php` — GET/POST pattern, JSON response shape, `send_json_headers()` + `json_resp()` helpers. New service_content.php MUST follow this.
- `backend/init_db.php` — Table creation pattern. Add service_content table here.
- `frontend/src/components/blocks/context-problem.tsx` — safeFetch() + useState fallback pattern used for API fetching in page components.

### Admin Layout
- `frontend/src/components/admin/admin-layout.tsx` — Sidebar nav items array. Add "SERVICES" entry here.

### Project Config
- `./CLAUDE.md` — Tech stack, conventions, API design table, error handling rules. Follow all project-specific guidelines.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `safeFetch()` from `frontend/src/lib/utils.ts` — use for all API calls in service page
- `api.get()` / `api.post()` from `frontend/src/lib/api.ts` — use in admin service page
- `AdminLayout` from `frontend/src/components/admin/admin-layout.tsx` — wrap admin services page
- `Badge`, `Button` from `frontend/src/components/ui/` — already used on service pages
- Existing `SERVICES` object and `DEFAULT_SECTIONS` — initial seed data for service_content table

### Established Patterns
- All admin pages use `"use client"` + `useState` + `useEffect` for data fetching
- `saveSection(section, content, setStatus)` helper pattern from site-content page — replicate for service_content
- DB table creation via `CREATE TABLE IF NOT EXISTS` in `init_db.php` (see existing tables)
- API responses: `{ status: "success", data: {...} }` for GET, `{ status: "success" }` for POST

### Integration Points
- `admin-layout.tsx` nav array — add "SERVICES" item
- `frontend/src/app/services/[slug]/page.tsx` — convert from static SERVICES lookup to hybrid (API first + static fallback)
- `backend/init_db.php` — add service_content table + seed INSERT IGNORE statements
- No new public routes needed

</code_context>

<specifics>
## Specific Ideas

- Design reference: benai.co/custom-solutions (service page visual structure — existing page already matches this layout, work is content/consistency cleanup)
- Service slugs (all 11): ai-seo, custom-ai-solutions, youtube-automation, instagram-automation, linkedin-automation, automation-flows, ai-workflows, workflow-creation, accounting-bookkeeping, hiring-recruitment, sales-automation
- Requirements note "12 service pages (11 existing + AI SEO Automation)" — ai-seo is already in SERVICES. Either 11 is the correct total (requirements were written before ai-seo was added) or there's a missing 12th slug. Researcher should verify.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-service-pages*
*Context gathered: 2026-05-14*
