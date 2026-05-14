# Requirements — Digi Pexel Agency Website

## v1 Requirements

### Bugs & Technical Fixes (BUG)

- [ ] **BUG-01**: Fix `next/image` incompatibility with static export — add `images: { unoptimized: true }` to next.config.ts
- [ ] **BUG-02**: Fix admin dashboard double menu — remove horizontal pill tabs from dashboard page
- [ ] **BUG-03**: Fix admin sidebar broken links — Popups, Banners, Settings, Newsletter, Users all pointing to `#`
- [ ] **BUG-04**: Add scrollbar to admin sidebar so all menu items are accessible
- [ ] **BUG-05**: Remove Approval Queue and Waitlist from sidebar and codebase completely
- [ ] **BUG-06**: Rename admin sidebar menu items to simple vocabulary (no jargon)
- [ ] **BUG-07**: Add HTTPS redirect to backend `.htaccess`
- [ ] **BUG-08**: Fix all `#` placeholder links across public site (navbar, footer, buttons)

### Homepage (HOME)

- [ ] **HOME-01**: Hero section content (heading, subheading, paragraph, CTA) editable from admin
- [ ] **HOME-02**: Floating icons replaced with real tech brand icons, manageable from admin
- [ ] **HOME-03**: Navbar links and CTA button editable from admin (add/edit/remove)
- [ ] **HOME-04**: Logo marquee updated with real partner logos (Meta, Google Ads, Anthropic, etc.)
- [ ] **HOME-05**: All section eyebrow labels rewritten to be clear and user-friendly
- [ ] **HOME-06**: Services section cards linked to their respective service pages
- [ ] **HOME-07**: Problem section paragraph trimmed to 2 lines for consistency
- [ ] **HOME-08**: Homepage testimonials block fetches from admin panel (not hardcoded)
- [ ] **HOME-09**: Footer menu links all connected, newsletter signup input in footer
- [ ] **HOME-10**: WhatsApp floating button on every public page (bottom-right), pulls number from Settings

### Service Pages (SVC)

- [ ] **SVC-01**: All 12 service pages (11 existing + AI SEO Automation) use consistent section format (eyebrow → heading → 2-line para)
- [ ] **SVC-02**: All service page buttons linked to respective destinations
- [ ] **SVC-03**: All service page content editable per service from admin (hero, features, roadmap steps, market impact, CTA, testimonials)
- [ ] **SVC-04**: 6-step delivery roadmap customized per service with 2-line description per step
- [ ] **SVC-05**: Market impact section editable from admin with genuine numbers per service
- [ ] **SVC-06**: CTA section copy customized per service
- [ ] **SVC-07**: Service page testimonials look genuine and editable from admin
- [ ] **SVC-08**: Design aligned to benai.co/custom-solutions reference

### Blog (BLOG)

- [ ] **BLOG-01**: 2 sample SEO-focused blog posts added with proper format
- [ ] **BLOG-02**: Pagination — 10 posts per page with numbered navigation
- [ ] **BLOG-03**: Filter by category on blog listing page
- [ ] **BLOG-04**: Sort by popular/editorial on blog listing page
- [ ] **BLOG-05**: Search functionality on blog listing page
- [ ] **BLOG-06**: Related posts section on blog detail page
- [ ] **BLOG-07**: Blog scheduling from admin (publish now, schedule date/time, save as draft)
- [ ] **BLOG-08**: Categories manageable from admin (add/edit/delete)
- [ ] **BLOG-09**: Newsletter signup at end of each blog post
- [ ] **BLOG-10**: All CTAs and links working on blog pages
- [ ] **BLOG-11**: Design aligned to radixweb.com reference

### Case Studies (CS)

- [ ] **CS-01**: 2-3 sample case studies added (problem → approach → results format)
- [ ] **CS-02**: Pagination, filter, sort, search — same as blog
- [ ] **CS-03**: All case study content editable from admin
- [ ] **CS-04**: Design aligned to radixweb.com/case-studies reference

### Guides (GUIDE)

- [ ] **GUIDE-01**: Guides work as lead magnets — capture lead before or during guide access
- [ ] **GUIDE-02**: Pagination, filter, sort, search — same as blog
- [ ] **GUIDE-03**: Newsletter signup at end of each guide
- [ ] **GUIDE-04**: All guide content editable from admin
- [ ] **GUIDE-05**: Design aligned to radixweb.com/guides reference

### Testimonials (TEST)

- [ ] **TEST-01**: Testimonials page redesigned to match radixweb.com/testimonials format
- [ ] **TEST-02**: Testimonials look genuine (real-feeling names, roles, companies)
- [ ] **TEST-03**: Admin can upload testimonials in multiple formats: video, image, text-only, star rating, company logo — any combination
- [ ] **TEST-04**: Different display formats per page — homepage format, service page format, testimonials page format — same DB, different rendering
- [ ] **TEST-05**: Navbar "Work" dropdown links to Case Studies and Testimonials (both working)

### Static & Legal Pages (STATIC)

- [ ] **STATIC-01**: Thank You page redesigned to match site design system
- [ ] **STATIC-02**: Custom 404 page — branded with navigation links
- [ ] **STATIC-03**: Error page redesigned to match site design system
- [ ] **STATIC-04**: Privacy Policy content reviewed and appropriate for digital marketing automation agency
- [ ] **STATIC-05**: Terms & Conditions content reviewed and appropriate for digital marketing automation agency

### SEO & Technical (SEO)

- [ ] **SEO-01**: SEO meta management — editable title, description, OG image per page from admin
- [ ] **SEO-02**: Sitemap.xml auto-generated for all public pages
- [ ] **SEO-03**: robots.txt properly configured
- [ ] **SEO-04**: Schema markup (Organization, Service, Review schemas)
- [ ] **SEO-05**: Calendly/booking integration connected to all "Book a call" / "Book a free audit" CTAs
- [ ] **SEO-06**: Page speed audit and optimisation before launch

### Admin Panel — Dashboard (ADM)

- [ ] **ADM-01**: Dashboard stats show live counts from DB (leads, blogs, case studies, etc.)
- [ ] **ADM-02**: Dashboard "Captured Leads" section shows real recent leads from DB

### Admin Panel — Site Content (CONT)

- [ ] **CONT-01**: Admin section to manage hero content (heading, subheading, para, icons, CTA)
- [ ] **CONT-02**: Admin section to manage navbar links (add/edit/remove/reorder)
- [ ] **CONT-03**: Admin section to manage footer links and content
- [ ] **CONT-04**: Admin section to manage agency stats (labels, values, descriptions)

### Admin Panel — Testimonials Management (TADM)

- [ ] **TADM-01**: Admin can add testimonials with format options (video/image/text, stars, company logo)
- [ ] **TADM-02**: Admin can assign testimonials to display on specific pages

### Admin Panel — Newsletter (NEWS)

- [ ] **NEWS-01**: Newsletter subscriber list viewable and exportable in admin
- [ ] **NEWS-02**: Newsletter signup form in footer on all public pages
- [ ] **NEWS-03**: Newsletter signup at end of blog posts and guide pages

### Admin Panel — Popups & Banners (POP)

- [ ] **POP-01**: Exit-intent popup — editable message, CTA text, link — actually shows on live site
- [ ] **POP-02**: Announcement bar — toggle on/off, edit text, link, background color — shows on all public pages
- [ ] **POP-03**: Content page banners — 1 per blog post, 1 per guide — editable from admin, actually shows on live site

### Admin Panel — Analytics (ANA)

- [ ] **ANA-01**: Admin section to paste and save Google Analytics, Search Console, and other embed codes
- [ ] **ANA-02**: Pasted codes automatically injected into site `<head>` on all public pages

### Admin Panel — Users (USR)

- [ ] **USR-01**: Admin can create users with name, designation, login ID, and password (stored in DB)
- [ ] **USR-02**: Admin login passcode manageable from Users panel (changeable without code)
- [ ] **USR-03**: Activity tracking — record which user made changes in admin panel

### Admin Panel — Settings (SET)

- [ ] **SET-01**: Social links editable (Facebook, Instagram, YouTube, LinkedIn URLs)
- [ ] **SET-02**: Contact info editable (phone number, email address)
- [ ] **SET-03**: Site name and tagline editable
- [ ] **SET-04**: WhatsApp button toggle on/off + phone number editable
- [ ] **SET-05**: Default CTA button link editable (used across all pages for "Book a call" etc.)

---

## v2 Requirements (Deferred)

- Multi-language support
- Blog author pages
- Advanced analytics dashboard (beyond embed codes)
- Email sending from newsletter (only subscriber list in v1)
- Advanced user role permissions (read-only, editor, admin)

---

## Out of Scope

- About Us page — user explicitly does not want it
- Waitlist — removed, contact form serves this purpose
- Pricing page — not adding in v1
- FAQ page — not adding in v1
- ROI Calculator — too complex, not priority
- Chat widget — not confirmed, not adding
- Blocking init_db.php — server migration still in progress
- Approval Queue — removed by user request

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 — Bugs & Foundation | Pending |
| BUG-02 | Phase 1 — Bugs & Foundation | Pending |
| BUG-03 | Phase 1 — Bugs & Foundation | Pending |
| BUG-04 | Phase 1 — Bugs & Foundation | Pending |
| BUG-05 | Phase 1 — Bugs & Foundation | Pending |
| BUG-06 | Phase 1 — Bugs & Foundation | Pending |
| BUG-07 | Phase 1 — Bugs & Foundation | Pending |
| BUG-08 | Phase 1 — Bugs & Foundation | Pending |
| HOME-01 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-02 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-03 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-04 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-05 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-06 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-07 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-08 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-09 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-10 | Phase 2 — Homepage & Site Content Admin | Pending |
| CONT-01 | Phase 2 — Homepage & Site Content Admin | Pending |
| CONT-02 | Phase 2 — Homepage & Site Content Admin | Pending |
| CONT-03 | Phase 2 — Homepage & Site Content Admin | Pending |
| CONT-04 | Phase 2 — Homepage & Site Content Admin | Pending |
| SVC-01 | Phase 3 — Service Pages | Pending |
| SVC-02 | Phase 3 — Service Pages | Pending |
| SVC-03 | Phase 3 — Service Pages | Pending |
| SVC-04 | Phase 3 — Service Pages | Pending |
| SVC-05 | Phase 3 — Service Pages | Pending |
| SVC-06 | Phase 3 — Service Pages | Pending |
| SVC-07 | Phase 3 — Service Pages | Pending |
| SVC-08 | Phase 3 — Service Pages | Pending |
| BLOG-01 | Phase 4 — Content Pages | Pending |
| BLOG-02 | Phase 4 — Content Pages | Pending |
| BLOG-03 | Phase 4 — Content Pages | Pending |
| BLOG-04 | Phase 4 — Content Pages | Pending |
| BLOG-05 | Phase 4 — Content Pages | Pending |
| BLOG-06 | Phase 4 — Content Pages | Pending |
| BLOG-07 | Phase 4 — Content Pages | Pending |
| BLOG-08 | Phase 4 — Content Pages | Pending |
| BLOG-09 | Phase 4 — Content Pages | Pending |
| BLOG-10 | Phase 4 — Content Pages | Pending |
| BLOG-11 | Phase 4 — Content Pages | Pending |
| CS-01 | Phase 4 — Content Pages | Pending |
| CS-02 | Phase 4 — Content Pages | Pending |
| CS-03 | Phase 4 — Content Pages | Pending |
| CS-04 | Phase 4 — Content Pages | Pending |
| GUIDE-01 | Phase 4 — Content Pages | Pending |
| GUIDE-02 | Phase 4 — Content Pages | Pending |
| GUIDE-03 | Phase 4 — Content Pages | Pending |
| GUIDE-04 | Phase 4 — Content Pages | Pending |
| GUIDE-05 | Phase 4 — Content Pages | Pending |
| TEST-01 | Phase 5 — Testimonials System Upgrade | Pending |
| TEST-02 | Phase 5 — Testimonials System Upgrade | Pending |
| TEST-03 | Phase 5 — Testimonials System Upgrade | Pending |
| TEST-04 | Phase 5 — Testimonials System Upgrade | Pending |
| TEST-05 | Phase 5 — Testimonials System Upgrade | Pending |
| TADM-01 | Phase 5 — Testimonials System Upgrade | Pending |
| TADM-02 | Phase 5 — Testimonials System Upgrade | Pending |
| ADM-01 | Phase 6 — Admin Panel Completion | Pending |
| ADM-02 | Phase 6 — Admin Panel Completion | Pending |
| NEWS-01 | Phase 6 — Admin Panel Completion | Pending |
| NEWS-02 | Phase 6 — Admin Panel Completion | Pending |
| NEWS-03 | Phase 6 — Admin Panel Completion | Pending |
| POP-01 | Phase 6 — Admin Panel Completion | Pending |
| POP-02 | Phase 6 — Admin Panel Completion | Pending |
| POP-03 | Phase 6 — Admin Panel Completion | Pending |
| ANA-01 | Phase 6 — Admin Panel Completion | Pending |
| ANA-02 | Phase 6 — Admin Panel Completion | Pending |
| USR-01 | Phase 6 — Admin Panel Completion | Pending |
| USR-02 | Phase 6 — Admin Panel Completion | Pending |
| USR-03 | Phase 6 — Admin Panel Completion | Pending |
| SET-01 | Phase 6 — Admin Panel Completion | Pending |
| SET-02 | Phase 6 — Admin Panel Completion | Pending |
| SET-03 | Phase 6 — Admin Panel Completion | Pending |
| SET-04 | Phase 6 — Admin Panel Completion | Pending |
| SET-05 | Phase 6 — Admin Panel Completion | Pending |
| STATIC-01 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| STATIC-02 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| STATIC-03 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| STATIC-04 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| STATIC-05 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-01 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-02 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-03 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-04 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-05 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
| SEO-06 | Phase 7 — SEO, Static Pages & Launch Readiness | Pending |
