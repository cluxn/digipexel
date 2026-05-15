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

### Active

**Homepage**
- [ ] Fix image optimization error (`next/image` incompatible with static export)
- [ ] Hero section fully editable from admin (heading, subheading, paragraph, floating icons, CTA)
- [ ] Floating icons replaced with real tech icons, manageable from admin
- [ ] Navbar links + CTA button editable from admin (add/edit/remove without code)
- [ ] Logo marquee updated with real partner logos (Meta, Google Ads, Anthropic, etc.)
- [ ] All section eyebrow labels rewritten to be clear and user-friendly
- [ ] Services section cards linked to their respective service pages
- [ ] Problem section paragraph trimmed to 2 lines (consistency with other sections)
- [ ] Agency stats (42%, 28%, 12k+, 4-6 wks) editable from admin
- [ ] Homepage testimonials block connected to admin panel (not hardcoded)
- [ ] All buttons and links on homepage connected to their respective destinations
- [ ] Footer menu links all connected, newsletter signup in footer, WhatsApp floating button

**Service Pages (12 total including AI SEO Automation)**
- ✓ Consistent section format across all service pages (eyebrow → heading → 2-line para) — Validated in Phase 03: service-pages
- ✓ All section buttons linked to respective destinations (/contact-us) — Validated in Phase 03
- ✓ All service page content editable per service from admin (hero, features, roadmap, market impact, CTA, testimonials) — Validated in Phase 03
- ✓ 6-step delivery roadmap customized per service with 2-line descriptions per step — Validated in Phase 03
- ✓ Market impact section editable from admin with genuine numbers per service — Validated in Phase 03
- ✓ CTA section customized per service (Connect badge/title/copy props) — Validated in Phase 03
- ✓ Testimonials look genuine, editable from admin — Validated in Phase 03
- [ ] Design reference: benai.co/custom-solutions [human verification pending]

**Blog**
- [ ] 2 sample SEO-focused blog posts added
- [ ] Pagination (10 posts per page, numbered navigation)
- [ ] Filter by category, sort by popular/editorial
- [ ] Search functionality
- [ ] Related posts on blog detail page
- [ ] Blog scheduling from admin (publish now, schedule, draft)
- [ ] Categories manageable from admin
- [ ] Newsletter signup at end of each blog post
- [ ] All CTAs and links working
- [ ] Design reference: radixweb.com

**Case Studies**
- [ ] 2-3 sample case studies added (radixweb.com format — problem, approach, results)
- [ ] Same features as blog (pagination, filter, sort, search, categories)
- [ ] All content editable from admin
- [ ] Design reference: radixweb.com/case-studies

**Guides**
- [ ] Guide listing + detail pages (lead magnet format — captures leads)
- [ ] Same features as blog (pagination, filter, sort, search, categories)
- [ ] Newsletter signup at end of each guide
- [ ] All content editable from admin
- [ ] Design reference: radixweb.com/guides

**Testimonials Page**
- [ ] Page redesigned to match radixweb.com/testimonials format
- [ ] Testimonials look genuine (real-feeling names, roles, companies)
- [ ] Admin can upload testimonials in multiple formats (video, image, text-only, with/without star rating, with/without company logo)
- [ ] Different display formats per page (homepage format, service page format, testimonials page format) — same DB
- [ ] Navbar "Work" dropdown links to Case Studies + Testimonials (both working)

**Static / Legal Pages**
- [ ] Thank You page redesigned to match site design system
- [ ] Custom 404 page — branded, with navigation
- [ ] Error page redesigned to match site design system
- [ ] Privacy Policy content reviewed for digital marketing automation agency
- [ ] Terms & Conditions content reviewed for digital marketing automation agency

**SEO & Technical**
- [ ] SEO meta management — editable title, description, OG image per page from admin
- [ ] Sitemap.xml auto-generated for all public pages
- [ ] robots.txt properly configured
- [ ] Schema markup (Organization, Service, Review schemas)
- [ ] HTTPS redirect in .htaccess
- [ ] Calendly/booking integration connected to all "Book a call" CTAs
- [ ] Page speed audit before launch

**Admin Panel**
- [ ] Sidebar scrollbar added
- [ ] Approval Queue removed from sidebar and codebase
- [ ] Waitlist removed from sidebar and codebase
- [ ] Dashboard stats show live counts from DB
- [ ] Dashboard "Captured Leads" shows real recent leads
- [ ] Double menu bug fixed (horizontal pill tabs removed from dashboard)
- [ ] All sidebar broken links (`#`) replaced with real routes
- [ ] Sidebar menu items renamed to simple vocabulary
- [ ] Site Content section — manage hero, navbar, footer, agency stats
- [ ] Services section — manage all content per service page
- [ ] Blog scheduling (publish now, schedule date/time, draft)
- [ ] Nudges/Popups — exit intent only, actually shows on live site
- [ ] Banners — announcement bar (toggle, text, link, color) + content page banners — live on site
- [ ] Newsletter — subscriber list view and export
- [ ] Analytics section — paste Google Analytics, Search Console, other embed codes
- [ ] Users section — create admin users with name, designation, login ID, password (DB-backed), tracks who made changes
- [ ] Settings — social links (4 platforms), contact info, site name/tagline, WhatsApp button toggle + number, default CTA link
- [ ] WhatsApp floating button on every public page (bottom-right), pulls number from Settings

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

**Current state:** Phase 02.1 complete (2026-05-14) — Homepage admin CMS now covers Hero (eyebrow, heading, icons with previews), Navbar, Stats, Footer, and Problem stat cards, all editable without code. All 6 homepage section eyebrow labels updated. Footer in 4-column equal grid with newsletter. Next: Phase 3 — service pages.

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
*Last updated: 2026-05-14 after project initialization discussion*
