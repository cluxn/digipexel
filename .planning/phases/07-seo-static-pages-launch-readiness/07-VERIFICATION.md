---
phase: 07-seo-static-pages-launch-readiness
verified: 2026-05-16T07:00:00Z
status: passed
score: 11/11 must-haves verified
---

# Phase 7: SEO, Static Pages & Launch Readiness — Verification Report

**Phase Goal:** Every public page has build-time SEO metadata; static/legal pages are redesigned and on-brand; sitemap.xml and robots.txt are generated at build time; Calendly CTA integration is wired; admin has an SEO meta editor; the site is launch-ready.
**Verified:** 2026-05-16
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                      | Status     | Evidence                                                                                 |
|----|--------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------------------|
| 1  | Thank you page shows "Transmission Success" with secondary nav links for Services and Blog | VERIFIED   | `thank-you/page.tsx` contains "Transmission Success", "Explore Services", "Read Our Blog" |
| 2  | Visiting an unknown URL shows a branded 404 page with "404 — Signal Lost" badge            | VERIFIED   | `not-found.tsx` exists, contains "404 — Signal Lost" and "automation void"               |
| 3  | The error page has a "Try Again" retry button and a "Return Home" secondary link            | VERIFIED   | `error.tsx` line 40: "Try Again"; line 43: "Return Home"                                 |
| 4  | Privacy Policy contains sections on AI data processing, GDPR, Calendly, Google Analytics  | VERIFIED   | `privacy-client.tsx` contains all four terms confirmed by grep                           |
| 5  | Terms & Conditions contains IP ownership, liability limits, termination sections           | VERIFIED   | `terms-client.tsx` contains "Intellectual Property", "liability", "Termination"          |
| 6  | Every public page has a generateMetadata export fetching from seo_meta.php at build time   | VERIFIED   | 12 page files confirmed to contain "generateMetadata" (all public routes covered)        |
| 7  | layout.tsx has Organization JSON-LD schema; services page has Service schema; testimonials has AggregateRating | VERIFIED | All three schemas confirmed present in respective server components |
| 8  | seo_meta DB table exists in init_db.php; seo_meta.php endpoint handles GET + POST          | VERIFIED   | `init_db.php` line 150-151: CREATE TABLE + PRIMARY KEY; `seo_meta.php` full CRUD confirmed |
| 9  | sitemap.xml and robots.txt generated at build time; robots.txt disallows /admin/           | VERIFIED   | `frontend/out/sitemap.xml`, `robots.txt` both exist; robots.txt line 7: "Disallow: /admin/" |
| 10 | Calendly integration wired in connect-cta and navbar with ssr:false dynamic import        | VERIFIED   | Both files confirmed: dynamic import, ssr:false, calendlyUrl state, conditional render   |
| 11 | Admin /admin/seo page exists with page selector, meta fields, amber rebuild notice, save posting to save_seo_meta | VERIFIED | `admin/seo/page.tsx` confirmed with all required elements |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact                                               | Expected                                     | Status    | Details                                                      |
|--------------------------------------------------------|----------------------------------------------|-----------|--------------------------------------------------------------|
| `frontend/src/app/not-found.tsx`                       | Custom 404 page — server component, no Navbar/Footer import | VERIFIED | File exists, no Navbar/Footer import, contains "automation void" and "404 — Signal Lost" |
| `frontend/src/app/thank-you/page.tsx`                  | Thank you page with secondary nav links      | VERIFIED  | Contains "Explore Services" and "Read Our Blog"              |
| `frontend/src/app/error.tsx`                           | GlobalError page with Try Again + Return Home | VERIFIED | Contains "Try Again" and "Return Home"; reset() prop preserved |
| `frontend/src/app/privacy-policy/page.tsx`             | Server wrapper with generateMetadata         | VERIFIED  | Server wrapper confirmed; delegates to privacy-client.tsx    |
| `frontend/src/app/privacy-policy/privacy-client.tsx`   | Expanded legal privacy policy content        | VERIFIED  | Contains AI Data Processing, GDPR, Calendly, Google Analytics |
| `frontend/src/app/terms-and-conditions/page.tsx`       | Server wrapper with generateMetadata         | VERIFIED  | Server wrapper confirmed; delegates to terms-client.tsx      |
| `frontend/src/app/terms-and-conditions/terms-client.tsx` | Expanded legal T&C content                 | VERIFIED  | Contains Intellectual Property, liability, Termination       |
| `backend/api/seo_meta.php`                             | SEO meta CRUD endpoint                       | VERIFIED  | Handles GET ?page=key and POST save_seo_meta with ON DUPLICATE KEY UPDATE |
| `backend/init_db.php`                                  | seo_meta table + calendly_url seed           | VERIFIED  | CREATE TABLE seo_meta with page_key VARCHAR(100) PRIMARY KEY; calendly_url seeded |
| `frontend/next-sitemap.config.js`                      | next-sitemap postbuild config                | VERIFIED  | siteUrl, generateRobotsTxt:true, outDir:./out, disallow:/admin/ |
| `frontend/src/app/layout.tsx`                          | Organization JSON-LD schema                  | VERIFIED  | application/ld+json script tag with Organization schema and .replace XSS guard |
| `frontend/src/app/page.tsx`                            | Server wrapper with generateMetadata (no "use client") | VERIFIED | No "use client"; exports generateMetadata; delegates to HomeClient |
| `frontend/src/app/home-client.tsx`                     | Client component extracted from page.tsx     | VERIFIED  | Exists; "use client" on line 1                               |
| `frontend/src/app/testimonials/page.tsx`               | Server wrapper with generateMetadata + AggregateRating JSON-LD | VERIFIED | No "use client"; exports generateMetadata; AggregateRating schema inline |
| `frontend/src/app/services/[slug]/page.tsx`            | generateMetadata + Service JSON-LD           | VERIFIED  | generateMetadata with await params; Service schema in default export |
| `frontend/src/components/ui/calendly-button.tsx`       | CalendlyButton client wrapper                | VERIFIED  | "use client"; PopupWidget; rootElement via useEffect; color "#7C3AED" |
| `frontend/src/components/blocks/connect-cta.tsx`       | Calendly conditional render + ssr:false      | VERIFIED  | dynamic import (ssr:false), calendlyUrl state, calendly_url fetch, CalendlyButton conditional |
| `frontend/src/components/blocks/floating-icons-hero-demo.tsx` | Navbar with conditional CalendlyButton | VERIFIED | dynamic import (ssr:false), calendlyUrl state, calendly_url fetch, CalendlyButton conditional |
| `frontend/src/app/admin/seo/page.tsx`                  | Admin SEO meta editor                        | VERIFIED  | Page selector, meta fields (seo_title, meta_description, og_image), amber rebuild notice, save_seo_meta POST |
| `frontend/src/components/admin/admin-layout.tsx`       | Admin sidebar with SEO entry                 | VERIFIED  | "SEO" entry with Search icon at href "/admin/seo"            |
| `frontend/out/sitemap.xml`                             | Generated sitemap after npm run build        | VERIFIED  | Exists in out/ directory                                     |
| `frontend/out/robots.txt`                              | Generated robots.txt                         | VERIFIED  | Exists; "Disallow: /admin/" confirmed                        |
| `frontend/out/404.html`                                | Custom 404 page compiled from not-found.tsx  | VERIFIED  | Exists in out/ directory                                     |
| `frontend/out/index.html`                              | Homepage with Organization JSON-LD in source | VERIFIED  | Confirmed to contain application/ld+json and Organization    |

---

### Key Link Verification

| From                                        | To                              | Via                                    | Status    | Details                                                             |
|---------------------------------------------|---------------------------------|----------------------------------------|-----------|---------------------------------------------------------------------|
| `frontend/package.json`                     | `frontend/next-sitemap.config.js` | "postbuild": "next-sitemap"          | WIRED     | Line 8 of package.json; next-sitemap in dependencies (^4.2.3)      |
| `backend/api/seo_meta.php`                  | `backend/common.php`            | require_once '../common.php'           | WIRED     | Line 3 of seo_meta.php                                              |
| `generateMetadata functions`                | `backend/api/seo_meta.php`      | fetch at build time (NEXT_PUBLIC_API_URL) | WIRED  | All 12 pages confirmed to call `seo_meta.php?page=...`              |
| `layout.tsx Organization schema`            | page source HTML                | Server Component — renders in initial HTML | WIRED | confirmed in out/index.html via build verification                  |
| `connect-cta.tsx`                           | `settings.php`                  | safeFetch reads calendly_url           | WIRED     | Line 143-144: json.data.calendly_url read + setCalendlyUrl          |
| `connect-cta.tsx`                           | `calendly-button.tsx`           | dynamic import with ssr:false          | WIRED     | Lines 15-17: dynamic(() => ..., { ssr: false })                     |
| `floating-icons-hero-demo.tsx Navbar`       | `settings.php`                  | useEffect + safeFetch reads calendly_url | WIRED   | Lines 296-297: calendly_url read from settings response             |
| `admin/seo/page.tsx`                        | `backend/api/seo_meta.php`      | api.get('seo_meta') + api.post('seo_meta') | WIRED | Line 68: action "save_seo_meta"; line 421: api.get("seo_meta")      |
| `app/page.tsx`                              | `home-client.tsx`               | Server wrapper imports HomeClient      | WIRED     | page.tsx line 2: import HomeClient; no "use client" in page.tsx     |
| `testimonials/page.tsx`                     | `AggregateRating schema`        | Server Component renders JSON-LD inline | WIRED    | aggregateRatingSchema defined and rendered in JSX with ld+json type |
| `services/[slug]/page.tsx`                  | `Service schema`                | Server Component renders JSON-LD inline | WIRED    | serviceSchema defined and rendered in JSX with ld+json type         |

---

### Data-Flow Trace (Level 4)

Dynamic rendering artifacts are either: (a) server components injecting JSON-LD statically at build time (no runtime data needed), or (b) client components fetching their own data at runtime. The data-flow concern for this phase is the generateMetadata fetch — which fails gracefully via `.catch(() => null)` and falls back to hardcoded defaults. This is intentional design for a static export: if the API is unreachable at build time, the page still builds with sensible defaults.

| Artifact                        | Data Variable        | Source               | Produces Real Data | Status   |
|---------------------------------|---------------------|----------------------|--------------------|----------|
| `app/page.tsx generateMetadata` | `meta.seo_title`    | seo_meta.php GET     | Yes (with DB fallback) | FLOWING (graceful fallback on fetch failure) |
| `layout.tsx Organization`       | Static JSON-LD      | Hardcoded            | Yes (static)       | FLOWING  |
| `testimonials/page.tsx`         | AggregateRating     | Static fallback values | Yes (static)     | FLOWING (documented design choice) |
| `services/[slug]/page.tsx`      | Service schema      | Dynamic slug param   | Yes                | FLOWING  |
| `connect-cta.tsx CalendlyButton` | `calendlyUrl`      | settings.php API     | Yes (empty string default when unset) | FLOWING (conditional render handles empty) |

---

### Behavioral Spot-Checks

| Behavior                                   | Command / Check                                  | Result                                      | Status  |
|--------------------------------------------|--------------------------------------------------|---------------------------------------------|---------|
| sitemap.xml exists in out/                 | `ls frontend/out/sitemap.xml`                    | EXISTS                                      | PASS    |
| robots.txt disallows /admin/               | grep robots.txt                                  | "Disallow: /admin/" confirmed               | PASS    |
| 404.html exists in out/                    | `ls frontend/out/404.html`                       | EXISTS                                      | PASS    |
| index.html has Organization JSON-LD        | grep out/index.html                              | application/ld+json + Organization present  | PASS    |
| not-found.tsx has no Navbar/Footer import  | grep not-found.tsx                               | No matches for Navbar or Footer             | PASS    |
| admin-layout.tsx has SEO sidebar entry     | grep admin-layout.tsx                            | "/admin/seo" with Search icon confirmed     | PASS    |
| 12 public pages have generateMetadata      | grep -r generateMetadata frontend/src/app        | 12 files matched                            | PASS    |
| seo_meta.php save action                   | Code inspection                                  | ON DUPLICATE KEY UPDATE confirmed           | PASS    |
| Build exit 0 with 52 pages                 | 07-05-BUILD-VERIFICATION.md                      | "Build PASS" — documented 2026-05-16        | PASS    |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                              | Status    | Evidence                                                              |
|-------------|-------------|--------------------------------------------------------------------------|-----------|-----------------------------------------------------------------------|
| STATIC-01   | 07-01       | Thank You page redesigned to match site design system                    | SATISFIED | "Transmission Success" + design system classes confirmed              |
| STATIC-02   | 07-01       | Custom 404 page — branded with navigation links                          | SATISFIED | not-found.tsx exists; 404.html in out/; "automation void" text present |
| STATIC-03   | 07-01       | Error page redesigned to match site design system                        | SATISFIED | error.tsx has "Try Again" + "Return Home" + GlobalError interface     |
| STATIC-04   | 07-01       | Privacy Policy appropriate for digital marketing automation agency       | SATISFIED | GDPR, AI Data Processing, Calendly, Google Analytics sections confirmed |
| STATIC-05   | 07-01       | Terms & Conditions appropriate for digital marketing automation agency   | SATISFIED | Intellectual Property, liability, Termination sections confirmed      |
| SEO-01      | 07-03, 07-04 | SEO meta management — editable per page from admin                      | SATISFIED | admin/seo/page.tsx fully wired to seo_meta.php; page selector + 3 fields |
| SEO-02      | 07-02       | Sitemap.xml auto-generated for all public pages                          | SATISFIED | next-sitemap postbuild; sitemap.xml confirmed in out/                 |
| SEO-03      | 07-02       | robots.txt properly configured                                           | SATISFIED | robots.txt in out/; Disallow: /admin/ confirmed                       |
| SEO-04      | 07-03       | Schema markup (Organization, Service, Review schemas)                    | SATISFIED | Organization in layout.tsx; Service in services/[slug]/page.tsx; AggregateRating in testimonials/page.tsx |
| SEO-05      | 07-04       | Calendly/booking integration connected to CTAs                           | SATISFIED | CalendlyButton component; connect-cta + navbar both wired with conditional render + fallback |
| SEO-06      | 07-05       | Page speed audit and optimisation before launch                          | NEEDS HUMAN | Build verified clean; page speed audit requires live site + Lighthouse (human task documented in 07-05-PLAN.md; human checkpoint "approved" per 07-05-SUMMARY.md) |

**Note on SEO-06:** The 07-05-SUMMARY.md records "Human reviewer approved all Phase 7 deliverables" but does not document an actual PageSpeed score. The human gate was marked approved. Page speed audit against the live site (`https://digipexel.cluxn.com`) with Google PageSpeed Insights is the remaining unverifiable item from this session.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None found | — | — | — | — |

No placeholder returns, empty handlers, or TODO stubs were found in the phase-modified files. The `calendlyUrl` state initializes as an empty string and the conditional render (`calendlyUrl ? <CalendlyButton> : <Link>`) means the fallback is fully functional — this is intentional design, not a stub.

---

### Human Verification Required

#### 1. Page Speed Audit (SEO-06)

**Test:** After deployment to `https://digipexel.cluxn.com`, run Google PageSpeed Insights (`https://pagespeed.web.dev/`) on the homepage and at least one service page.
**Expected:** Performance score above 50 mobile / 70 desktop with no critical CLS or blocking resource issues.
**Why human:** Requires live deployment + external tool (Lighthouse/PageSpeed Insights). Cannot be run from local file access.

#### 2. Calendly Popup Functional Test (SEO-05)

**Test:** In admin Settings, add a valid Calendly URL to the `calendly_url` field. Reload the homepage and a service page. Click "Book a Call" in the navbar and "Start Building Now" in the CTA section.
**Expected:** Calendly popup opens. When URL is empty, CTAs fall back to regular links with no visual regression.
**Why human:** Requires a real Calendly account URL and browser-interactive popup behavior that cannot be verified through file inspection.

#### 3. Admin SEO Editor End-to-End Save (SEO-01)

**Test:** Visit `/admin/seo`, select "Blog Listing", enter a custom title, click Save, then run `npm run build` and check that the blog listing page renders the custom title in its `<title>` tag.
**Expected:** Meta saved to DB; next build picks it up via `generateMetadata` fetch.
**Why human:** Requires a live DB + running build cycle with API accessible during build.

---

### Gaps Summary

No automated gaps found. All 11 observable truths verified against actual codebase files. All 24 required artifacts exist and are substantive. All 11 key links confirmed wired.

One item requires human action: SEO-06 page speed audit must be run against the live deployed site. The human gate in Plan 05 was marked "approved" in the SUMMARY but without a documented score. This is acceptable for launch if the deployer runs the audit post-deploy and the score meets the threshold (50+ mobile, 70+ desktop).

---

_Verified: 2026-05-16T07:00:00Z_
_Verifier: Claude (gsd-verifier)_
