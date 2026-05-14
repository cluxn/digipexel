# Roadmap: Digi Pexel Agency Website

## Overview

The project takes a partially built, partially hardcoded agency website and makes it fully launch-ready: every public section connected to the admin CMS, all bugs eliminated, content pages built to reference-quality standard, admin panel completed, and SEO/technical foundations locked in before going live. Seven phases deliver this in a logical dependency order — fixes first, then homepage, then service pages, then content pages, then testimonials, then admin completion, then launch readiness.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Bugs & Foundation** - Eliminate all blocking bugs and broken admin navigation so every subsequent phase can build on a clean base (completed 2026-05-14)
- [ ] **Phase 2: Homepage & Site Content Admin** - Connect every homepage section to the admin CMS and give the admin panel full control over hero, navbar, footer, and agency stats
- [ ] **Phase 3: Service Pages** - Build all 12 service pages to a consistent, admin-editable format aligned to the benai.co reference
- [ ] **Phase 4: Content Pages — Blog, Case Studies & Guides** - Deliver fully functional blog, case studies, and guides with pagination, filtering, search, scheduling, and lead capture
- [ ] **Phase 5: Testimonials System Upgrade** - Redesign the testimonials page, make testimonials multi-format, and wire different display contexts to the same DB
- [ ] **Phase 6: Admin Panel Completion** - Complete every unfinished admin section: dashboard, newsletter, popups, banners, analytics, users, and settings — all live on the public site
- [ ] **Phase 7: SEO, Static Pages & Launch Readiness** - Add all static/legal pages, implement SEO management, generate sitemap, configure schemas, connect Calendly, and pass a page speed audit

## Phase Details

### Phase 1: Bugs & Foundation
**Goal**: The site and admin panel are free of blocking bugs — images render, admin navigation works, broken links are gone, HTTPS is enforced, and junk sidebar items have been removed
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, BUG-03, BUG-04, BUG-05, BUG-06, BUG-07, BUG-08
**Success Criteria** (what must be TRUE):
  1. Images display correctly on all public pages with no console errors related to next/image
  2. Admin dashboard shows exactly one navigation (no duplicate pill tabs)
  3. Every admin sidebar link (Popups, Banners, Settings, Newsletter, Users) navigates to a real page, not a `#` placeholder
  4. Admin sidebar is scrollable and all menu items are reachable without a scroll cutoff
  5. Approval Queue and Waitlist are gone from sidebar and codebase; all public `#` placeholder links are replaced with real destinations; backend serves over HTTPS only
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Config + .htaccess + admin layout overhaul + dashboard cleanup + social link fix

### Phase 2: Homepage & Site Content Admin
**Goal**: Every section of the homepage fetches content from the admin CMS — nothing is hardcoded — and the admin panel has dedicated controls for hero, navbar, footer, and agency stats
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09, HOME-10, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. An admin can edit the hero heading, subheading, paragraph, floating icons, and CTA from the admin panel and see the change reflected on the homepage without a code deploy
  2. Admin can add, edit, reorder, and remove navbar links and the CTA button from the admin panel
  3. Logo marquee displays real partner logos (Meta, Google Ads, Anthropic, etc.) pulled from admin; agency stats (42%, 28%, 12k+, 4-6 wks) are editable from admin
  4. Homepage testimonials block shows testimonials from the admin panel, not hardcoded text
  5. Footer newsletter signup, all footer links, services section card links, and WhatsApp floating button are all connected and functional
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Backend: 3 new DB tables (site_content, settings, newsletter_subscribers) + 3 PHP endpoints
- [ ] 02-02-PLAN.md — Quick fixes: logo data seed via admin UI, eyebrow labels, services href verify, problem section trim
- [ ] 02-03-PLAN.md — Admin site-content page with Hero, Navbar, Stats, Footer tabs
- [ ] 02-04-PLAN.md — Homepage block connections: hero, testimonials, AgencyStats, newsletter footer, WhatsApp button

### Phase 3: Service Pages
**Goal**: All 12 service pages follow a consistent, polished section format, every button links to the correct destination, and all per-service content (hero, features, roadmap, market impact, CTA, testimonials) is editable from the admin panel
**Depends on**: Phase 2
**Requirements**: SVC-01, SVC-02, SVC-03, SVC-04, SVC-05, SVC-06, SVC-07, SVC-08
**Success Criteria** (what must be TRUE):
  1. Visiting any of the 12 service pages shows the same consistent section structure: eyebrow label → heading → 2-line paragraph, matching the benai.co/custom-solutions visual reference
  2. Every button on every service page navigates to its correct destination (no dead links or `#` placeholders)
  3. An admin can edit the hero, features list, 6-step delivery roadmap (with 2-line descriptions per step), market impact numbers, CTA copy, and testimonials for each service individually from the admin panel
  4. Market impact numbers look genuine and are distinct per service; testimonials on service pages look real and are pulled from admin
**Plans**: TBD
**UI hint**: yes

### Phase 4: Content Pages — Blog, Case Studies & Guides
**Goal**: Blog, case studies, and guides are fully functional content hubs with pagination, filtering, search, and scheduling — all editable from admin — and guides capture leads
**Depends on**: Phase 2
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, BLOG-08, BLOG-09, BLOG-10, BLOG-11, CS-01, CS-02, CS-03, CS-04, GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-04, GUIDE-05
**Success Criteria** (what must be TRUE):
  1. Blog listing page shows paginated results (10 per page with numbered navigation), filterable by category, sortable by popular/editorial, with a working search input — design matches radixweb.com reference
  2. Blog detail page shows related posts and a newsletter signup block at the end; all CTAs link to real destinations
  3. Admin can create blog posts with scheduling options (publish now, schedule date/time, save as draft) and manage categories without touching code
  4. Case studies listing and detail pages work the same as blog (pagination, filter, sort, search) with problem→approach→results format; 2-3 sample case studies are present
  5. Guides listing page works like blog; each guide acts as a lead magnet (captures lead before or during access); newsletter signup appears at end of guide; 2 sample blog posts and sample guides are present
**Plans**: TBD
**UI hint**: yes

### Phase 5: Testimonials System Upgrade
**Goal**: The testimonials page is redesigned to look professional and genuine, the admin can upload any testimonial format, and the same testimonials DB renders correctly in three different display contexts (homepage, service pages, testimonials page)
**Depends on**: Phase 2
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, TADM-01, TADM-02
**Success Criteria** (what must be TRUE):
  1. Testimonials page design matches the radixweb.com/testimonials reference and testimonials display with real-feeling names, roles, and company names
  2. Admin can add a testimonial in any combination of formats: video, image, text-only, with or without star rating, with or without company logo — from a single admin upload form
  3. The same testimonials DB entry renders in the homepage block format, the service page sidebar format, and the full testimonials page format depending on context
  4. Navbar "Work" dropdown successfully links to Case Studies and to the Testimonials page (both navigable, no broken links)
**Plans**: TBD
**UI hint**: yes

### Phase 6: Admin Panel Completion
**Goal**: Every admin panel section that was a stub or missing is now fully functional and its output is live on the public site — newsletter collects and lists subscribers, popups and banners actually appear, analytics codes are injected, users are DB-backed, and settings control live site behavior
**Depends on**: Phase 1
**Requirements**: ADM-01, ADM-02, NEWS-01, NEWS-02, NEWS-03, POP-01, POP-02, POP-03, ANA-01, ANA-02, USR-01, USR-02, USR-03, SET-01, SET-02, SET-03, SET-04, SET-05
**Success Criteria** (what must be TRUE):
  1. Admin dashboard shows live counts from DB (leads, blog posts, case studies, etc.) and the "Captured Leads" section displays real recent leads
  2. Newsletter subscriber list is viewable and exportable in admin; newsletter signup form appears in footer and at the end of blog posts and guide pages
  3. Exit-intent popup appears on the live public site when a user moves to close the tab; announcement bar appears across all public pages when toggled on; content page banners show on their respective blog/guide pages
  4. Admin can paste Google Analytics and Search Console embed codes and they are automatically injected into the site `<head>` on all public pages
  5. Admin can create and manage users (name, designation, login ID, password) from the Users panel; settings changes (social links, contact info, site name, WhatsApp number) are reflected on the live public site immediately
**Plans**: TBD
**UI hint**: yes

### Phase 7: SEO, Static Pages & Launch Readiness
**Goal**: The site has branded static/legal pages, every public page has editable SEO metadata, a sitemap is auto-generated, schema markup is in place, Calendly is connected to all CTAs, and the site passes a page speed audit
**Depends on**: Phase 4, Phase 5, Phase 6
**Requirements**: STATIC-01, STATIC-02, STATIC-03, STATIC-04, STATIC-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. Thank You page, 404 page, and Error page are all redesigned to match the site design system; Privacy Policy and Terms & Conditions read correctly for a digital marketing automation agency
  2. Admin can edit the SEO title, meta description, and OG image for any public page from the admin panel and changes appear in the page source
  3. sitemap.xml lists all public pages and is accessible at the site root; robots.txt is correctly configured; Organization, Service, and Review schema markup is present in page source
  4. Every "Book a call" / "Book a free audit" CTA across the site opens a Calendly booking interface
  5. Page speed audit completes with no critical issues blocking launch
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bugs & Foundation | 1/1 | Complete    | 2026-05-14 |
| 2. Homepage & Site Content Admin | 0/4 | Not started | - |
| 3. Service Pages | 0/0 | Not started | - |
| 4. Content Pages — Blog, Case Studies & Guides | 0/0 | Not started | - |
| 5. Testimonials System Upgrade | 0/0 | Not started | - |
| 6. Admin Panel Completion | 0/0 | Not started | - |
| 7. SEO, Static Pages & Launch Readiness | 0/0 | Not started | - |
