# Requirements — Digi Pexel Agency Website

## v1 Requirements

### Bugs & Technical Fixes (BUG)

- [x] **BUG-01**: Fix `next/image` incompatibility with static export — add `images: { unoptimized: true }` to next.config.ts
- [x] **BUG-02**: Fix admin dashboard double menu — remove horizontal pill tabs from dashboard page
- [x] **BUG-03**: Fix admin sidebar broken links — Popups, Banners, Settings, Newsletter, Users all pointing to `#`
- [x] **BUG-04**: Add scrollbar to admin sidebar so all menu items are accessible
- [x] **BUG-05**: Remove Approval Queue and Waitlist from sidebar and codebase completely
- [x] **BUG-06**: Rename admin sidebar menu items to simple vocabulary (no jargon)
- [x] **BUG-07**: Add HTTPS redirect to backend `.htaccess`
- [x] **BUG-08**: Fix all `#` placeholder links across public site (navbar, footer, buttons)

### Homepage (HOME)

- [x] **HOME-01**: Hero section content (heading, subheading, paragraph, CTA) editable from admin
- [x] **HOME-02**: Floating icons replaced with real tech brand icons, manageable from admin
- [x] **HOME-03**: Navbar links and CTA button editable from admin (add/edit/remove)
- [ ] **HOME-04**: Logo marquee updated with real partner logos (Meta, Google Ads, Anthropic, etc.)
- [ ] **HOME-05**: All section eyebrow labels rewritten to be clear and user-friendly
- [ ] **HOME-06**: Services section cards linked to their respective service pages
- [ ] **HOME-07**: Problem section paragraph trimmed to 2 lines for consistency
- [x] **HOME-08**: Homepage testimonials block fetches from admin panel (not hardcoded)
- [x] **HOME-09**: Footer menu links all connected, newsletter signup input in footer
- [x] **HOME-10**: WhatsApp floating button on every public page (bottom-right), pulls number from Settings

### Service Pages (SVC)

- [x] **SVC-01**: All 12 service pages (11 existing + AI SEO Automation) use consistent section format (eyebrow → heading → 2-line para)
- [x] **SVC-02**: All service page buttons linked to respective destinations
- [x] **SVC-03**: All service page content editable per service from admin (hero, features, roadmap steps, market impact, CTA, testimonials)
- [x] **SVC-04**: 6-step delivery roadmap customized per service with 2-line description per step
- [x] **SVC-05**: Market impact section editable from admin with genuine numbers per service
- [x] **SVC-06**: CTA section copy customized per service
- [x] **SVC-07**: Service page testimonials look genuine and editable from admin
- [x] **SVC-08**: Design aligned to benai.co/custom-solutions reference

### Blog (BLOG)

- [x] **BLOG-01**: 2 sample SEO-focused blog posts added with proper format
- [x] **BLOG-02**: Pagination — 10 posts per page with numbered navigation
- [x] **BLOG-03**: Filter by category on blog listing page
- [x] **BLOG-04**: Sort by popular/editorial on blog listing page
- [x] **BLOG-05**: Search functionality on blog listing page
- [x] **BLOG-06**: Related posts section on blog detail page
- [x] **BLOG-07**: Blog scheduling from admin (publish now, schedule date/time, save as draft)
- [x] **BLOG-08**: Categories manageable from admin (add/edit/delete)
- [x] **BLOG-09**: Newsletter signup at end of each blog post
- [x] **BLOG-10**: All CTAs and links working on blog pages
- [x] **BLOG-11**: Design aligned to radixweb.com reference

### Case Studies (CS)

- [x] **CS-01**: 2-3 sample case studies added (problem → approach → results format)
- [x] **CS-02**: Pagination, filter, sort, search — same as blog
- [x] **CS-03**: All case study content editable from admin
- [x] **CS-04**: Design aligned to radixweb.com/case-studies reference

### Guides (GUIDE)

- [x] **GUIDE-01**: Guides work as lead magnets — capture lead before or during guide access
- [x] **GUIDE-02**: Pagination, filter, sort, search — same as blog
- [x] **GUIDE-03**: Newsletter signup at end of each guide
- [x] **GUIDE-04**: All guide content editable from admin
- [x] **GUIDE-05**: Design aligned to radixweb.com/guides reference

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

- [x] **CONT-01**: Admin section to manage hero content (heading, subheading, para, icons, CTA)
- [x] **CONT-02**: Admin section to manage navbar links (add/edit/remove/reorder)
- [x] **CONT-03**: Admin section to manage footer links and content
- [x] **CONT-04**: Admin section to manage agency stats (labels, values, descriptions)

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
| BUG-01 | Phase 1 — Bugs & Foundation | Complete |
| BUG-02 | Phase 1 — Bugs & Foundation | Complete |
| BUG-03 | Phase 1 — Bugs & Foundation | Complete |
| BUG-04 | Phase 1 — Bugs & Foundation | Complete |
| BUG-05 | Phase 1 — Bugs & Foundation | Complete |
| BUG-06 | Phase 1 — Bugs & Foundation | Complete |
| BUG-07 | Phase 1 — Bugs & Foundation | Complete |
| BUG-08 | Phase 1 — Bugs & Foundation | Complete |
| HOME-01 | Phase 2 — Homepage & Site Content Admin | Complete |
| HOME-02 | Phase 2 — Homepage & Site Content Admin | Complete |
| HOME-03 | Phase 2 — Homepage & Site Content Admin | Complete |
| HOME-04 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-05 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-06 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-07 | Phase 2 — Homepage & Site Content Admin | Pending |
| HOME-08 | Phase 2 — Homepage & Site Content Admin | Complete |
| HOME-09 | Phase 2 — Homepage & Site Content Admin | Complete |
| HOME-10 | Phase 2 — Homepage & Site Content Admin | Complete |
| CONT-01 | Phase 2 — Homepage & Site Content Admin | Complete |
| CONT-02 | Phase 2 — Homepage & Site Content Admin | Complete |
| CONT-03 | Phase 2 — Homepage & Site Content Admin | Complete |
| CONT-04 | Phase 2 — Homepage & Site Content Admin | Complete |
| SVC-01 | Phase 3 — Service Pages | Complete |
| SVC-02 | Phase 3 — Service Pages | Complete |
| SVC-03 | Phase 3 — Service Pages | Complete |
| SVC-04 | Phase 3 — Service Pages | Complete |
| SVC-05 | Phase 3 — Service Pages | Complete |
| SVC-06 | Phase 3 — Service Pages | Complete |
| SVC-07 | Phase 3 — Service Pages | Complete |
| SVC-08 | Phase 3 — Service Pages | Complete |
| BLOG-01 | Phase 4 — Content Pages | Complete |
| BLOG-02 | Phase 4 — Content Pages | Complete |
| BLOG-03 | Phase 4 — Content Pages | Complete |
| BLOG-04 | Phase 4 — Content Pages | Complete |
| BLOG-05 | Phase 4 — Content Pages | Complete |
| BLOG-06 | Phase 4 — Content Pages | Complete |
| BLOG-07 | Phase 4 — Content Pages | Complete |
| BLOG-08 | Phase 4 — Content Pages | Complete |
| BLOG-09 | Phase 4 — Content Pages | Complete |
| BLOG-10 | Phase 4 — Content Pages | Complete |
| BLOG-11 | Phase 4 — Content Pages | Complete |
| CS-01 | Phase 4 — Content Pages | Complete |
| CS-02 | Phase 4 — Content Pages | Complete |
| CS-03 | Phase 4 — Content Pages | Complete |
| CS-04 | Phase 4 — Content Pages | Complete |
| GUIDE-01 | Phase 4 — Content Pages | Complete |
| GUIDE-02 | Phase 4 — Content Pages | Complete |
| GUIDE-03 | Phase 4 — Content Pages | Complete |
| GUIDE-04 | Phase 4 — Content Pages | Complete |
| GUIDE-05 | Phase 4 — Content Pages | Complete |
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
