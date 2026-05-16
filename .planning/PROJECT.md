# Digi Pexel — Agency Website

## What This Is

Digi Pexel is a digital marketing automation agency website targeting B2B decision makers (COOs, Founders, VPs, Directors) seeking AI automation and digital marketing services. The site serves as the primary lead generation platform, combining a public-facing marketing site with a full admin CMS that lets the agency manage all content, leads, and site configuration without writing code.

## Core Value

A launch-ready agency website where every section is editable from the admin panel and every lead is captured — no hardcoded content, no broken links, no fake data.

## Requirements

### Validated

- ✓ Blog system — CRUD in admin, public listing + detail pages
- ✓ Case Studies system — CRUD in admin, public listing + detail pages
- ✓ Guides system — CRUD in admin, public listing + detail pages
- ✓ Testimonials system — CRUD in admin, public listing + detail pages
- ✓ Leads capture — contact form posts to DB, viewable in admin
- ✓ Logo marquee — dynamic, admin controlled
- ✓ Admin authentication — login-protected admin panel
- ✓ Static export Next.js frontend + PHP REST API backend
- ✓ Deployed to Hostinger via GitHub Actions
- ✓ All section eyebrow labels rewritten — Validated in Phase 02.1: post-phase-2-gap-fixes-inserted
- ✓ Problem section stat cards editable from admin (Problem tab + API fetch) — Validated in Phase 02.1
- ✓ Hero section eyebrow label editable from admin — Validated in Phase 02.1
- ✓ Footer restructured to 4-column equal grid (brand | nav1 | nav2 | newsletter) — Validated in Phase 02.1
- ✓ Admin Hero tab shows SVG icon previews beside each slot dropdown — Validated in Phase 02.1
- ✓ Dashboard stats show live counts from DB — Validated in Phase 06: admin-panel-completion
- ✓ Newsletter subscriber list view and CSV export — Validated in Phase 06
- ✓ Banners admin page — announcement bar + content page banners, live on site — Validated in Phase 06
- ✓ Analytics admin page — paste GA4, Search Console, custom scripts, injected into head — Validated in Phase 06
- ✓ Users admin page — create/edit/delete admin users, DB-backed passcode change — Validated in Phase 06
- ✓ Settings admin page — social links, contact info, site name/tagline, WhatsApp toggle + number, default CTA link — Validated in Phase 06
- ✓ WhatsApp floating button on every public page, pulls number and enabled flag from settings — Validated in Phase 06
- ✓ Footer social icons dynamic from settings API — Validated in Phase 06
- ✓ Connect CTA default link from settings API — Validated in Phase 06
- ✓ Nudges/Popups wired to banners.php (DB-backed, no localStorage) — Validated in Phase 06
- ✓ Admin sidebar: Analytics and Users links added — Validated in Phase 06
- ✓ Admin login passcode changeable from Users page without editing code (USR-02) — Validated in Phase 06
- ✓ Custom 404 page ("Lost in the automation void?" — branded, server component, inherits root layout) — Validated in Phase 07: seo-static-pages-launch-readiness
- ✓ Thank-you page redesigned with secondary nav links (Explore Services, Read Our Blog) — Validated in Phase 07
- ✓ Privacy Policy and Terms & Conditions expanded with agency-grade legal content (GDPR, AI data, IP, SLAs) — Validated in Phase 07
- ✓ generateMetadata on all 12 public pages (build-time SEO titles/descriptions from seo_meta DB) — Validated in Phase 07
- ✓ Organization JSON-LD in layout.tsx, Service JSON-LD per service page, AggregateRating JSON-LD on testimonials — Validated in Phase 07
- ✓ seo_meta PHP endpoint + DB table — admin can set per-page title/description/og_image — Validated in Phase 07
- ✓ sitemap.xml + robots.txt generated at build time via next-sitemap postbuild (/admin disallowed) — Validated in Phase 07
- ✓ CalendlyButton integration — Navbar and Connect CTA conditionally open Calendly popup when calendly_url is set in settings — Validated in Phase 07
- ✓ Admin /admin/seo page — per-page SEO meta editor with rebuild notice — Validated in Phase 07

### Active

**Homepage**
- ✓ Fix image optimization error — `unoptimized: true` in next.config.ts — Validated in Phase 01: bugs-foundation
- ✓ Hero section fully editable from admin (heading, subheading, eyebrow, paragraph, floating icons, CTA) — Validated in Phase 02 + 02.1
- ✓ Floating icons manageable from admin (ICON_REGISTRY + slot dropdowns in admin Hero tab) — Validated in Phase 02
- ✓ Navbar CTA button text/href editable from admin (Navbar tab in admin site-content) — Validated in Phase 02
- ✓ All section eyebrow labels rewritten — Validated in Phase 02.1
- ✓ Services section cards linked to `/services/*` routes (all 11 hrefs verified) — Validated in Phase 02
- ✓ Problem section paragraph trimmed to 2 lines (16 words) — Validated in Phase 02
- ✓ Agency stats (42%, 28%, 12k+, 4-6 wks) editable from admin (Stats tab + API fetch) — Validated in Phase 02
- ✓ All homepage buttons and CTA links connected (service cards → /services/*, CTAs → /contact-us or settings CTA link) — Validated in Phase 02/03/06
- ✓ Homepage testimonials block connected to admin panel, filtered to 'homepage' context — Validated in Phase 05
- ✓ Footer menu links connected, newsletter signup in footer, WhatsApp floating button — Validated in Phase 02 + 06
- [ ] Logo marquee updated with real partner logos (Meta, Google Ads, Anthropic, etc.) — **Content task: admin data entry needed** (go to /admin/logos, see 02-02-SUMMARY.md for exact entries)

**Service Pages (12 total including AI SEO Automation)**
- ✓ Consistent section format across all service pages — Validated in Phase 03
- ✓ All section buttons linked to respective destinations (/contact-us) — Validated in Phase 03
- ✓ All service page content editable per service from admin — Validated in Phase 03
- ✓ 6-step delivery roadmap customized per service with 2-line descriptions per step — Validated in Phase 03
- ✓ Market impact section editable from admin with genuine numbers per service — Validated in Phase 03
- ✓ CTA section customized per service — Validated in Phase 03
- ✓ Testimonials look genuine, editable from admin — Validated in Phase 03

**Blog**
- ✓ 2 sample SEO-focused blog posts seeded in DB — Validated in Phase 04
- ✓ Client-side pagination, filter by category, sort by popular/recent — Validated in Phase 04
- ✓ Related posts on blog detail page (same-category capped at 3) — Validated in Phase 04
- ✓ Blog scheduling from admin (publish now / schedule date-time / draft) — Validated in Phase 04
- ✓ Newsletter signup at end of each blog post — Validated in Phase 04/06
- [ ] Search functionality (free-text search box) — **not built**
- [ ] Dedicated categories admin page — **not built** (category autocomplete exists when creating posts)

**Case Studies**
- ✓ 2 sample case studies seeded in DB (finflows, growthloop) — Validated in Phase 04
- ✓ Client-side pagination, filter, sort — Validated in Phase 04
- ✓ All content editable from admin — Validated in Phase 04

**Guides**
- ✓ Guide listing + detail pages with newsletter block — Validated in Phase 04
- ✓ Client-side pagination, filter, sort — Validated in Phase 04
- ✓ Newsletter signup at end of each guide — Validated in Phase 04/06
- ✓ All content editable from admin — Validated in Phase 04
- [ ] Search functionality (free-text search box) — **not built**

**Testimonials Page**
- ✓ Page redesigned (card grid with star ratings, logos, category badges) — Validated in Phase 05
- ✓ Testimonials look genuine (6 professional B2B names/roles/companies seeded) — Validated in Phase 05
- ✓ Admin can upload testimonials in multiple formats — Validated in Phase 05
- ✓ Different display formats per page (display_context filter) — Validated in Phase 05
- ✓ Navbar "Work" dropdown links to Case Studies + Testimonials — Validated in Phase 05

**Static / Legal Pages**
- ✓ Thank You page redesigned ("Transmission Success" + secondary nav links) — Validated in Phase 07
- ✓ Custom 404 page ("404 — Signal Lost", branded server component) — Validated in Phase 07
- ✓ Error page redesigned ("Try Again" + "Return Home") — Validated in Phase 07
- ✓ Privacy Policy expanded (GDPR, AI data processing, Calendly, Google Analytics sections) — Validated in Phase 07
- ✓ Terms & Conditions expanded (IP ownership, SLAs, liability, termination) — Validated in Phase 07

**SEO & Technical**
- ✓ SEO meta management — editable title/description/OG image per page from admin (/admin/seo) — Validated in Phase 07
- ✓ Sitemap.xml auto-generated at build time via next-sitemap postbuild — Validated in Phase 07
- ✓ robots.txt properly configured (disallows /admin/) — Validated in Phase 07
- ✓ Schema markup — Organization (layout.tsx), Service (service pages), AggregateRating (testimonials) — Validated in Phase 07
- ✓ HTTPS redirect in backend/.htaccess (301 RewriteCond) — Validated in Phase 01
- ✓ Calendly/booking integration — CalendlyButton wired to Navbar and Connect CTA — Validated in Phase 07
- ✓ Page speed audit before launch — human sign-off received in Phase 07 checkpoint
- [ ] Post-deploy PageSpeed Insights score documented — **run after next deploy**

**Admin Panel**
- ✓ Sidebar scrollbar added (overflow-y-auto) — Validated in Phase 01
- ✓ Approval Queue removed from sidebar and codebase — Validated in Phase 01
- ✓ Waitlist removed from sidebar and codebase — Validated in Phase 01
- ✓ Dashboard stats show live counts from DB — Validated in Phase 06
- ✓ Dashboard "Captured Leads" shows real recent leads — Validated in Phase 06
- ✓ Double menu bug fixed (horizontal pill tabs removed from dashboard) — Validated in Phase 01
- ✓ All sidebar broken links replaced with real routes — Validated in Phase 01 + 06
- ✓ Sidebar menu items renamed to simple vocabulary — Validated in Phase 01
- ✓ Site Content section — manage hero, navbar, stats, footer, problem section — Validated in Phase 02 + 02.1
- ✓ Services section — manage all content per service page — Validated in Phase 03
- ✓ Blog scheduling (publish now, schedule date/time, draft) — Validated in Phase 04
- ✓ Nudges/Popups — exit intent only, DB-driven — Validated in Phase 06
- ✓ Banners — announcement bar + content page banners, live on site — Validated in Phase 06
- ✓ Newsletter — subscriber list view and CSV export — Validated in Phase 06
- ✓ Analytics section — GA4, Search Console, custom scripts injected into head — Validated in Phase 06
- ✓ Users section — create/edit/delete admin users, DB-backed passcode change — Validated in Phase 06
- ✓ Settings — social links, contact info, site name/tagline, WhatsApp toggle + number, default CTA link — Validated in Phase 06
- ✓ WhatsApp floating button on every public page — Validated in Phase 06
- ✓ SEO meta editor (/admin/seo) with per-page fields and rebuild notice — Validated in Phase 07

### Out of Scope

- About Us page — user explicitly does not want it
- Waitlist — removed, adds no value for an agency (contact form serves this)
- Pricing page — not adding
- FAQ page — not adding
- ROI Calculator — too complex, not priority
- Chat widget — not confirmed, not adding
- Approval Queue — removed by user request
- Blocking init_db.php — server migration still needed, must stay accessible

## Context

**Existing stack:** Next.js 16 (static export) + PHP REST API (no framework) + MySQL on Hostinger shared hosting. Frontend deployed as static HTML/CSS/JS. Backend at `https://digi.cluxn.com/backend/api/`.

**Current state:** Phase 06 complete (2026-05-16) — Admin panel is now fully functional: all 5 sidebar "Coming Soon" stubs replaced (Newsletter, Settings, Banners, Analytics, Users), dashboard shows live DB stats, WhatsApp button and footer social links are DB-driven, analytics codes injected into head, content page banners live. Next: Phase 7 — SEO, static pages & launch readiness.

**Design references:**
- Blog, Case Studies, Guides → radixweb.com
- Service pages → benai.co/custom-solutions
- Testimonials page → radixweb.com/testimonials

**Target audience:** B2B decision makers — COOs, Founders, VPs, Directors evaluating an AI automation agency. Non-aggressive marketing approach (no timed popups, no aggressive ads).

## Constraints

- **Tech Stack**: Next.js static export — no server-side rendering at runtime. All dynamic content must be fetched client-side via API calls.
- **Hosting**: Shared Hostinger hosting — no Node.js server, no connection pooling, limited vertical scaling.
- **Backend**: PHP with no framework — follow existing action-based POST routing pattern.
- **Deployment**: GitHub Actions → SFTP to Hostinger. No staging environment.
- **Images**: Must use `images: { unoptimized: true }` in next.config.ts for static export compatibility.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static export Next.js | Hostinger shared hosting doesn't support Node.js server | — Pending |
| PHP REST API (no framework) | Existing pattern, matches hosting constraints | — Pending |
| B2B-appropriate marketing (no aggressive popups) | Target audience of senior decision makers responds poorly to aggressive tactics | — Pending |
| Exit-intent only for nudges | B2B buyers close timed popups immediately | — Pending |
| Newsletter in footer + end of content pages only | Highest intent placement for B2B audience | — Pending |
| No About Us page | User decision | — Pending |
| radixweb.com as content page reference | Professional B2B agency format appropriate for target audience | — Pending |
| benai.co/custom-solutions as service page reference | Clean, conversion-focused service page format | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-16 — Phase 06 complete: admin panel fully functional*
