# Phase 2: Homepage & Site Content Admin - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect every homepage section to the admin CMS so nothing is hardcoded. Build a new `/admin/site-content` admin page with tabs for Hero, Navbar, Stats, and Footer. Add a WhatsApp floating button and footer newsletter signup form. Fix minor copy issues (eyebrow labels, problem section paragraph). All work is within the homepage and the site-content admin section — no new public routes, no service pages, no content pages.

</domain>

<decisions>
## Implementation Decisions

### Admin Section Architecture (CONT-01 – CONT-04)
- **D-01:** Single admin page at `/admin/site-content` with 4 tabs: **Hero**, **Navbar**, **Stats**, **Footer**. One sidebar item "SITE CONTENT" added to admin sidebar (position: after DASHBOARD, before PARTNER LOGOS).
- **D-02:** Hero tab edits: `heading`, `titleHighlight`, `subtitle`, `ctaText`, `ctaHref`, and the 6 floating icon slot identifiers.
- **D-03:** Navbar tab edits: CTA button `text` and `href` only. Dropdown structure (Services, Work, Insights) remains hardcoded in code — not admin-editable.
- **D-04:** Stats tab edits: 4 rows, each with `label`, `value`, `description` fields (matches current `AgencyStats` data shape).
- **D-05:** Footer tab: not a full footer editor — scope is limited to the newsletter section heading/subtext. Nav links and social links are in the footer code (hardcoded per Phase 1 decision; Settings phase handles social links).

### Data Storage
- **D-06:** New `site_content` DB table: columns `section VARCHAR(50) PRIMARY KEY`, `content JSON NOT NULL`, `updated_at TIMESTAMP`. One row per section: `hero`, `nav`, `stats`, `footer`.
- **D-07:** New `settings` DB table: columns `key VARCHAR(50) PRIMARY KEY`, `value TEXT`. Used for WhatsApp number now; Phase 6 extends to full settings. Initial rows seeded: `whatsapp_number` (value: `''`).
- **D-08:** New `newsletter_subscribers` DB table: columns `id INT AUTO_INCREMENT PRIMARY KEY`, `email VARCHAR(255) UNIQUE`, `subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, `status ENUM('active','unsubscribed') DEFAULT 'active'`.

### New PHP Endpoints
- **D-09:** `backend/api/site_content.php` — GET by `?section=hero|nav|stats|footer` returns content JSON; POST with `action=save_section` saves content blob. Follow existing CRUD pattern.
- **D-10:** `backend/api/settings.php` — GET with `?key=whatsapp_number` returns value; GET with no params returns all key-value pairs; POST with `action=save_setting` saves one key-value. Minimal for Phase 2, extended in Phase 6.
- **D-11:** `backend/api/newsletter.php` — POST with `action=subscribe` accepts `email`, validates, inserts into `newsletter_subscribers`. Phase 6 adds list view and export.

### Hero Section (HOME-01)
- **D-12:** `FloatingIconsHeroDemo` is refactored to fetch hero content from `api/site_content.php?section=hero` on mount. Falls back to current hardcoded values if API fails.
- **D-13:** Admin changes to hero content (heading, subtitle, CTA) are reflected on the homepage on next page load (no cache, client-side fetch).

### Floating Icons (HOME-02)
- **D-14:** Floating icons use a **preset icon registry** — a hardcoded map in code of ~20 supported tool icons (OpenAI, Anthropic, n8n, Make, Zapier, Slack, Notion, Google, Figma, GitHub, Vercel, Stripe, Discord, YouTube, n8n, Linear, etc.). All icon SVGs remain in code.
- **D-15:** Admin sees a dropdown/select per slot (6 slots) — picks an icon name from the preset list. The 6 slot position classes remain hardcoded (Tailwind positioning stays in code). Only the icon identity changes.
- **D-16:** Icon slot data stored in `site_content` table, section=`hero`, as `iconSlots: [{slot: 1, icon: "openai", label: "OpenAI"}, ...]`.

### Logo Marquee (HOME-04)
- **D-17:** No code changes needed — logo marquee already fetches from `api/logos.php`. The task is to **update the logos data** in the database via the existing `/admin/logos` admin page. Add real partner logos: OpenAI, Anthropic, n8n, Zapier, Make.com, Google Ads, Meta, Microsoft. Use SVG URLs from Wikimedia Commons or official CDNs where available.
- **D-18:** The admin logos task is a data update, not a code change — executor runs it by adding logos through the logos admin UI or directly seeding `logos` table via SQL in `init_db.php`.

### Eyebrow Labels (HOME-05)
- **D-19:** Simple copy edits across homepage block components. Not admin-editable in Phase 2. Update these specific strings in code:
  - `floating-icons-hero-demo.tsx` pointers: review and clean up if needed
  - `context-problem.tsx` eyebrow: "The Automation Gap" → keep (already clear)
  - `agency-stats.tsx` eyebrow: "Proven Results" → keep (already clear)
  - `services.tsx` eyebrow: "Our Ecosystem" → "What We Do" (cleaner for B2B buyers)
  - `testimonials.tsx` eyebrow: "Client Outcomes" → keep (already clear)
  - Any other eyebrow label that reads as jargon should be simplified. Claude decides final copy.

### Services Section Cards (HOME-06)
- **D-20:** Services cards in `services.tsx` already have correct `href` values for all existing services. **Verify only** — no code changes expected. If any `href` is `"#"`, fix it to the correct route.

### Problem Section (HOME-07)
- **D-21:** Trim `context-problem.tsx` subtitle to a maximum of 2 lines at normal viewport width. Current text: "Every manual handoff costs time, context, and revenue. We bridge every gap with AI that connects your entire stack and acts 24/7." This is already ~2 lines — verify and trim if needed at medium viewport. Claude decides exact wording.

### Homepage Testimonials (HOME-08)
- **D-22:** `testimonials.tsx` block refactored to fetch from `api/testimonials.php` on mount instead of using the hardcoded static array. Falls back to current hardcoded data if API fails.
- **D-23:** Display the first 9 published testimonials ordered by `id ASC`. No `display_on_homepage` flag needed — use the existing testimonials table as-is. The full-page testimonials redesign is Phase 5.

### Footer Newsletter Signup (HOME-09)
- **D-24:** Add an email newsletter signup form to `footer-section.tsx`. Design: single-line email input + "Subscribe" button, inline, matching the footer's existing visual style (minimal, no heavy UI).
- **D-25:** On submit, POST to `api/newsletter.php` with `action=subscribe`. Show success ("You're in!") or error ("Already subscribed") inline without page reload. Use `useState` for form state.
- **D-26:** Footer nav links are already all connected to real routes (verified in Phase 1 code review) — no changes needed.

### WhatsApp Floating Button (HOME-10)
- **D-27:** Add a fixed-position WhatsApp floating button (bottom-right, above fold, z-50) to the root layout `app/layout.tsx`. Style: green circle with WhatsApp icon, 52×52px, subtle drop shadow.
- **D-28:** Button fetches WhatsApp number from `api/settings.php?key=whatsapp_number` on mount. If number is empty or API fails, button is hidden (not shown). Opens `https://wa.me/{number}` in a new tab on click.
- **D-29:** Create a new `WhatsAppButton` client component at `frontend/src/components/ui/whatsapp-button.tsx`. Mount it in `app/layout.tsx` globally.

### Claude's Discretion
- Exact JSON schema for `site_content` content blobs (Claude decides field names as long as they match what the admin form saves and what the homepage reads)
- Admin UI layout within each tab (form fields, save button placement, loading/error states)
- Newsletter subscribe form visual design within footer (must be minimal and match existing footer aesthetic)
- WhatsApp button hover animation and exact positioning
- Whether to include the DB table creation in `init_db.php` or a separate migration — Claude decides, following the existing pattern in `init_db.php`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing homepage components (all need to be read before touching)
- `frontend/src/app/page.tsx` — homepage composition, imports all block components
- `frontend/src/components/blocks/floating-icons-hero-demo.tsx` — hero section + Navbar component (both in this file)
- `frontend/src/components/blocks/agency-stats.tsx` — stats section (hardcoded, needs API connection)
- `frontend/src/components/blocks/testimonials.tsx` — testimonials block (hardcoded, needs API connection)
- `frontend/src/components/blocks/services.tsx` — services section (verify hrefs, eyebrow label update)
- `frontend/src/components/blocks/context-problem.tsx` — problem section (paragraph trim)
- `frontend/src/components/blocks/logo-marquee.tsx` — already fetches from API, reference pattern

### Existing admin infrastructure (patterns to follow)
- `frontend/src/components/admin/admin-layout.tsx` — sidebar items array (add SITE CONTENT here)
- `frontend/src/lib/utils.ts` — `safeFetch()` — use for all public API calls
- `frontend/src/lib/constants.ts` — `API_BASE_URL` — use for all API URL construction
- `frontend/src/app/layout.tsx` — root layout (mount WhatsAppButton here)

### Existing backend patterns (follow exactly)
- `backend/common.php` — `send_json_headers()`, `json_resp()`, `get_input()` — use in all new PHP files
- `backend/api/logos.php` — reference implementation for a simple CRUD endpoint (GET list + POST save)
- `backend/api/testimonials.php` — reference for GET list endpoint (already correct for HOME-08 use)
- `backend/init_db.php` — add new `CREATE TABLE IF NOT EXISTS` statements for `site_content`, `settings`, `newsletter_subscribers`

### Requirements
- `.planning/REQUIREMENTS.md` — HOME-01 to HOME-10, CONT-01 to CONT-04 — full acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `safeFetch()` in `lib/utils.ts` — wraps fetch with error handling; returns `{status: "error"}` on failure; use for all homepage API calls
- `api.ts` `api.get()` / `api.post()` — admin-side HTTP client; use this for admin page API calls (not safeFetch)
- `LogoMarquee` component — the only existing homepage block that fetches from API; study its `useEffect` / `useState` pattern as the model for connecting other blocks
- Admin tab pattern: look at existing admin pages (e.g., `/admin/logos`) for form structure and save/load patterns

### Established Patterns
- All public homepage blocks: `"use client"` directive, `useState` + `useEffect` for data, `safeFetch()` for API calls, hardcoded fallback data if API fails
- API construction: `safeFetch(\`${API_BASE_URL}/api/site_content.php?section=hero\`)` — note `safeFetch` takes a path relative to origin, not full URL. Check `lib/utils.ts` for exact signature.
- Backend: every new PHP file requires `include '../common.php'` at top; use `json_resp()` for all responses; use `get_input()` for POST body parsing
- Admin forms: controlled inputs with `useState`, POST via `api.post()`, show inline success/error after save

### Integration Points
- `admin-layout.tsx` sidebarItems array — add `{ name: "SITE CONTENT", icon: Globe, href: "/admin/site-content", status: "Active" }` (Globe icon already imported in layout)
- `app/layout.tsx` — mount `<WhatsAppButton />` inside the body, after existing global components (Nudges, BackToTop)
- `backend/init_db.php` — 3 new `CREATE TABLE IF NOT EXISTS` blocks for `site_content`, `settings`, `newsletter_subscribers`

</code_context>

<specifics>
## Specific Ideas

- The navbar CTA "Book a Call" text and href should be the only admin-editable nav element — keep dropdown nav hardcoded. This is intentional scope limitation.
- Floating icons use a preset registry (not image URL input) — keeps the design intentional. Admin picks from ~20 approved tech tool icons.
- WhatsApp button: if number is empty in settings, the button does not appear on the public site — prevents a broken `wa.me/` link.
- Newsletter subscribe: email uniqueness enforced at DB level (UNIQUE constraint) — return a helpful "already subscribed" message rather than a generic error.
- Logo marquee data update: prefer adding logos via the existing `/admin/logos` UI rather than raw SQL where possible.

</specifics>

<deferred>
## Deferred Ideas

- Full footer link admin-editability (nav columns, social link URLs) — Phase 6 Settings
- Full navbar dropdown admin control (Services categories, Work items, Insights items) — not in scope
- Newsletter subscriber list view and export — Phase 6
- Settings admin page (full) — Phase 6
- Announcement bar / banners on public pages — Phase 6

</deferred>

---

*Phase: 02-homepage-&-site-content-admin*
*Context gathered: 2026-05-14*
