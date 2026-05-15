# Phase 7: SEO, Static Pages & Launch Readiness — Research

**Researched:** 2026-05-16
**Domain:** Next.js SEO, Schema Markup, Static Pages, Calendly Integration, Page Speed
**Confidence:** HIGH (core technical constraints verified against official docs)

---

## Summary

Phase 7 is the launch-readiness phase. It has three distinct work streams: (1) static/legal page redesigns, (2) SEO infrastructure (editable meta, sitemap, robots, schema), and (3) external integrations and performance audit. Every decision is shaped by a single overriding constraint: this is a Next.js **static export** (`output: 'export'`) — no server at runtime.

The critical tension in SEO-01 ("admin can edit SEO meta per page, changes appear in page source") is that Next.js static export bakes metadata into HTML **at build time**, not at request time. This means "admin editable + appears in page source" is achievable only through the `generateMetadata` function (server component, called during `next build`), which fetches from the PHP API during the build process. The data is editable in the admin panel, but the site must be **rebuilt and redeployed** for the new meta to appear in the HTML source. This is the correct and honest interpretation of the requirement given the stack — client-side injection via `useEffect` and `document.head` manipulation would NOT satisfy "appears in page source" for SEO crawlers.

For the sitemap, the `next-sitemap` package (postbuild script) is the reliable approach for static exports. The native `sitemap.ts` / `robots.ts` file conventions have a known bug with `output: 'export'` in Next.js 15+ that may or may not be resolved in 16.1.6. The postbuild approach is certain and battle-tested.

Calendly integration uses `react-calendly` 4.4.0 with `dynamic` import + `ssr: false` since the widget requires browser DOM APIs that don't exist during static build. The CTA throughout the site is currently wired to `settings.default_cta_link` — the Calendly approach replaces the link destination with a Calendly popup trigger.

**Primary recommendation:** Use `generateMetadata` in server wrapper pages to fetch SEO data from a new `seo_meta` PHP endpoint (built during `next build`), `next-sitemap` for sitemap/robots, native `<script type="application/ld+json">` for schemas in layout, and `react-calendly` PopupWidget wrapped in `dynamic(() => import(...), { ssr: false })` for Calendly.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STATIC-01 | Thank You page redesigned to match site design system | Existing page at `app/thank-you/page.tsx` — needs redesign to match design system properly; already uses Navbar/Footer/Badge pattern |
| STATIC-02 | Custom 404 page — branded with navigation links | `app/not-found.tsx` compiles to `out/404.html` in static export (confirmed in official docs); file does not currently exist |
| STATIC-03 | Error page redesigned to match site design system | `app/error.tsx` exists — is a GlobalError component; needs design review |
| STATIC-04 | Privacy Policy content reviewed for digital marketing automation agency | Page exists (`app/privacy-policy/page.tsx`) with basic content — needs expanded legal sections (GDPR data handling, third-party tools, AI data processing) |
| STATIC-05 | Terms & Conditions content reviewed for digital marketing automation agency | Page exists (`app/terms-and-conditions/page.tsx`) with basic content — needs expanded sections (IP, SLAs, liability, data ownership) |
| SEO-01 | SEO meta management — editable title, description, OG image per page from admin | Requires new `seo_meta` DB table + PHP endpoint + `generateMetadata` in server page wrappers; rebuilt on deploy; constraint is build-time-only |
| SEO-02 | Sitemap.xml auto-generated for all public pages | Use `next-sitemap` package in postbuild; hardcode static slugs (service, blog, case study, guide) to match `generateStaticParams` lists |
| SEO-03 | robots.txt properly configured | `next-sitemap` generates it alongside sitemap.xml; or static `public/robots.txt` file |
| SEO-04 | Schema markup (Organization, Service, Review schemas) | JSON-LD via `<script type="application/ld+json">` in layout.tsx (Organization/sitewide) and per service/blog page (Service, Review) |
| SEO-05 | Calendly/booking integration for all "Book a call" CTAs | `react-calendly` 4.4.0 with `dynamic(() => ..., { ssr: false })`; CalendlyURL stored in `settings` DB; existing `default_cta_link` setting repurposed or a new `calendly_url` key added |
| SEO-06 | Page speed audit and optimisation before launch | Audit with PageSpeed Insights / Lighthouse; known bottlenecks for this stack: Framer Motion bundle weight, unoptimized images, third-party Calendly/analytics scripts, Geist font load |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- **Static export only**: `output: 'export'` in `next.config.ts` — no SSR at runtime, no API routes, no server actions
- **No server-side rendering at runtime** — all pages are pre-rendered HTML + client-side JS
- **Backend**: PHP REST API, no framework, action-based POST routing
- **Images**: `unoptimized: true` already set in next.config.ts
- **Hosting**: Shared Hostinger — no Node.js at runtime, SFTP deploy
- **Deployment**: GitHub Actions → SFTP to Hostinger; no staging environment
- **All dynamic content must be fetched client-side** (except metadata which is fetched at build time via `generateMetadata`)
- **PHP pattern**: `INSERT ... ON DUPLICATE KEY UPDATE` for upserts; `json_resp()` helper; `get_input()` for body

---

## Standard Stack

### Core (already in project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework — static export | Locked; already in use |
| `generateMetadata` | built-in | Build-time SEO meta per page | Server Component API, embeds in initial HTML |
| `<script type="application/ld+json">` | native HTML | JSON-LD schema markup | Official Next.js recommendation for structured data |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-sitemap` | 4.2.3 | Postbuild sitemap + robots.txt generation | Runs after `next build`, outputs to `out/` |
| `react-calendly` | 4.4.0 | Calendly popup widget | Wrap in `dynamic(() => ..., { ssr: false })` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next-sitemap` | Native `sitemap.ts` | Native has known bug with `output: 'export'` in Next.js 15/16; postbuild approach is certain |
| `react-calendly` | Direct Calendly script embed | Script embed is messier to control as a React component; `react-calendly` provides typed props and event hooks |
| `generateMetadata` at build | Client-side `document.head` injection | Client injection does NOT appear in initial HTML source; SEO crawlers that don't execute JS won't see it |

**Installation:**
```bash
npm install next-sitemap react-calendly
```

**Version verification:**
```bash
npm view next-sitemap version      # confirmed 4.2.3
npm view react-calendly version    # confirmed 4.4.0
```

---

## Architecture Patterns

### Recommended Project Structure (additions for Phase 7)
```
frontend/src/app/
├── not-found.tsx              # NEW — custom 404 page (compiles to out/404.html)
├── sitemap.ts                 # SKIP — use next-sitemap postbuild instead
├── robots.ts                  # SKIP — use next-sitemap postbuild instead
├── admin/
│   └── seo/
│       └── page.tsx           # NEW — admin SEO meta editor per page
backend/api/
├── seo_meta.php               # NEW — CRUD for per-page SEO metadata
frontend/
├── next-sitemap.config.js     # NEW — next-sitemap configuration
```

### Pattern 1: Admin-Editable Metadata via Build-Time Fetch

**What:** Each public page's `page.tsx` (the server component wrapper, not the `"use client"` client component) exports `generateMetadata`. This function calls the PHP `seo_meta.php` API during `next build`, fetching the stored title/description/og-image for that page. The result is baked into the HTML `<head>` at build time.

**When to use:** All public pages with admin-editable SEO (homepage, blog, case studies, guides, service pages, testimonials, contact, privacy policy, terms, etc.)

**Key constraint:** Changes to SEO meta in the admin panel require a new deploy to appear in page source. This is unavoidable with static export — document this clearly.

**How current pages work:** Most public pages already use the `"use client"` directive, meaning the `page.tsx` file IS the client component. For those pages, a thin server wrapper must be created that exports `generateMetadata` and renders the client component.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/blog/[slug]/page.tsx (already a server component wrapper — add generateMetadata)

import type { Metadata } from 'next'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  // Fetch from PHP seo_meta.php at build time
  const res = await fetch(`${BASE_URL}/seo_meta.php?page=blog/${slug}`)
    .catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null

  return {
    title: meta?.seo_title || 'Blog — Digi Pexel',
    description: meta?.meta_description || 'AI automation insights from Digi Pexel.',
    openGraph: {
      title: meta?.seo_title || 'Blog — Digi Pexel',
      description: meta?.meta_description || '',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}
```

### Pattern 2: JSON-LD Schema Markup

**What:** A native `<script type="application/ld+json">` tag placed in the server component (layout or page). Organization schema goes in `app/layout.tsx`. Service schema goes in each `app/services/[slug]/page.tsx` server wrapper.

**Official source:** https://nextjs.org/docs/app/guides/json-ld

**Key rule:** Use a native `<script>` tag, NOT `next/script`. JSON-LD is structured data, not executable code.

**XSS prevention:** Replace `<` with `<` via `.replace(/</g, '\\u003c')` before embedding.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Digi Pexel',
  url: 'https://digipexel.cluxn.com',
  description: 'AI automation and digital marketing agency',
  sameAs: ['https://linkedin.com/company/digipexel'],
}

// In layout.tsx or page.tsx server component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
  }}
/>
```

### Pattern 3: Calendly Popup Integration

**What:** `react-calendly`'s `PopupWidget` requires browser DOM (specifically `rootElement`). It MUST be loaded with `ssr: false` in a static export — the widget errors during pre-render without it.

**Pattern:** Wrap in `dynamic(() => import('./CalendlyPopup'), { ssr: false })`. Create a thin client component that renders the `PopupWidget`.

**Where to trigger:** Replace `<Link href={effectiveCtaLink}>Start Building Now</Link>` in `connect-cta.tsx` (non-homepage variant) with the popup trigger. The `ctaHref` prop currently takes precedence — if it points to a Calendly URL, detect it and show popup instead of navigating.

**Admin integration:** Add `calendly_url` key to the `settings` table. Admin enters their Calendly scheduling link in Settings. The `Connect` component fetches it from `settings.php` (already does this for `default_cta_link`).

**Example:**
```typescript
// Source: https://github.com/tcampb/react-calendly
// components/ui/calendly-button.tsx
"use client";
import { PopupWidget } from 'react-calendly';
import { useEffect, useState } from 'react';

export function CalendlyButton({ url, label }: { url: string; label: string }) {
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
  useEffect(() => { setRootEl(document.getElementById('__next') || document.body); }, []);
  if (!rootEl || !url) return null;
  return (
    <PopupWidget
      url={url}
      rootElement={rootEl}
      text={label}
      textColor="#ffffff"
      color="#2563eb"
    />
  );
}

// In a page or connect-cta.tsx:
import dynamic from 'next/dynamic';
const CalendlyButton = dynamic(
  () => import('@/components/ui/calendly-button').then(m => m.CalendlyButton),
  { ssr: false }
);
```

### Pattern 4: next-sitemap Postbuild

**What:** `next-sitemap` runs after `next build` as a `postbuild` npm script. It reads the `out/` directory to find all pages, then generates `sitemap.xml` and `robots.txt` in `out/`. Static slugs (blogs, case studies, services) must be hardcoded in `next-sitemap.config.js` OR provided via `additionalPaths` function.

**Config file:**
```javascript
// next-sitemap.config.js (at frontend/ root)
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://digipexel.cluxn.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/admin/*'] },
    ],
  },
  exclude: ['/admin', '/admin/*'],
  // Note: slugs must match generateStaticParams exactly
}
```

**package.json change:**
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

### Pattern 5: 404 Page (not-found.tsx)

**What:** The official Next.js static export docs confirm that `out/404.html` is generated. Creating `app/not-found.tsx` produces a branded 404 page. The root `app/not-found.tsx` handles all unmatched routes globally.

**Confirmed:** The Next.js static export guide shows `404.html` in the generated `out/` directory as a standard output.

**Note on `global-not-found.js`:** This is a separate experimental API (Next.js 15.4+) that requires full `<html>` document structure. For our use case, the standard `app/not-found.tsx` is correct — it inherits the root layout (Navbar, Footer) and compiles to `404.html`.

**Anti-Pattern:** Do NOT create a `/404/page.tsx` route. Use `app/not-found.tsx` at the app root.

### seo_meta DB Table Pattern

**What:** New `seo_meta` table using `page_key VARCHAR(100) PRIMARY KEY` as the lookup key. Page keys follow the URL path pattern: `'home'`, `'blog'`, `'blog/ai-automation-eliminates-manual-work'`, `'services/ai-seo'`, etc.

```sql
CREATE TABLE IF NOT EXISTS seo_meta (
  page_key VARCHAR(100) PRIMARY KEY,
  seo_title VARCHAR(255),
  meta_description TEXT,
  og_image TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**PHP endpoint:** `backend/api/seo_meta.php` — GET by `?page=home`, POST with `action: 'save_seo_meta'`.

**Admin page:** `/admin/seo` — page selector dropdown (all public pages hardcoded) + title/description/og-image fields per page.

### Anti-Patterns to Avoid

- **Client-side meta injection for SEO:** Using `useEffect` to set `document.title` or inject `<meta>` tags after hydration does NOT satisfy "appears in page source" — search crawlers that don't execute JS will miss it. Use `generateMetadata` only.
- **Native sitemap.ts with output:export:** Known GitHub issue #68667 — native `sitemap.ts` fails or generates incorrect output with `output: 'export'` in Next.js 15. Use `next-sitemap` postbuild instead.
- **Using next/script for JSON-LD:** The official docs explicitly state: JSON-LD is structured data, not executable code — use a native `<script>` tag.
- **SSR-rendering react-calendly:** The PopupWidget accesses `document` and `window`. Without `ssr: false`, the static build will fail or produce hydration errors.
- **Single Calendly URL hardcoded in code:** Store Calendly URL in `settings` DB key `calendly_url` so admin can update it without code changes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom PHP script or manual XML | `next-sitemap` postbuild | Handles static + dynamic routes, produces valid XML, generates robots.txt simultaneously |
| Calendly popup | Custom modal iframe | `react-calendly` PopupWidget | Handles load events, proper iframe sandboxing, accessibility |
| Schema markup typing | Untyped objects | `schema-dts` types OR manual review against schema.org | Avoids invalid schema that fails Google Rich Results Test |
| Robots.txt | Manual public/robots.txt | `next-sitemap` with `generateRobotsTxt: true` | Keeps sitemap URL reference in sync automatically |

**Key insight:** The sitemap, robots.txt, and schema domains look simple but have protocol edge cases (changefreq values, priority ranges, schema property names) that are easy to get wrong. Use tools that have already solved these.

---

## Common Pitfalls

### Pitfall 1: SEO Meta Changes Don't Appear — Expecting Real-Time Updates

**What goes wrong:** Admin saves new title/description in the admin panel, refreshes the site, and the page `<title>` hasn't changed. They think it's broken.

**Why it happens:** Static export bakes metadata at build time. The change IS saved to the DB correctly, but won't appear in the HTML source until the next `next build + deploy`.

**How to avoid:** Add a clear UI note in the admin SEO page: "Changes take effect after the next site rebuild. Trigger a rebuild from GitHub Actions or contact your developer." Document this in PLAN comments.

**Warning signs:** Test by checking `view-source:` of the live page, not the browser tab title (which may reflect client-side updates).

---

### Pitfall 2: react-calendly Crashes Static Build

**What goes wrong:** `PopupWidget` is imported directly (without `dynamic`), the static build fails with `document is not defined` or similar window/DOM error.

**Why it happens:** react-calendly's PopupWidget accesses `document.getElementById` during initialization. During `next build`, this runs in Node.js where `document` doesn't exist.

**How to avoid:** Always wrap in `dynamic(() => import(...), { ssr: false })`. The `rootElement` prop must also be set inside a `useEffect` or `useState` initialized after mount.

**Warning signs:** Build succeeds locally with `next dev` but fails with `next build`.

---

### Pitfall 3: Sitemap Missing Dynamic Routes

**What goes wrong:** `sitemap.xml` only lists static pages (homepage, /blog, /services) — none of the dynamic slugs (/blog/ai-automation..., /services/ai-seo, etc.) appear.

**Why it happens:** `next-sitemap` reads the `out/` directory after build. Dynamic pages ARE generated (because `generateStaticParams` is defined), so they WILL appear in the output — BUT only if the slugs match exactly. If `generateStaticParams` returns fewer slugs than exist in the DB, those DB pages won't be in the sitemap.

**How to avoid:** Ensure the hardcoded slug lists in `generateStaticParams` match the `INSERT IGNORE` seeds in `init_db.php` exactly. For blog/case studies that grow over time: document that new content requires a new deploy to appear in sitemap.

**Warning signs:** After build, count URLs in `out/blog/` directory — should match `generateStaticParams` return count.

---

### Pitfall 4: next-sitemap Outputs to Wrong Directory

**What goes wrong:** `sitemap.xml` appears in `frontend/` root instead of `out/`, so it's not uploaded by SFTP deploy.

**Why it happens:** `next-sitemap` default output is the `public/` directory, but static export output is `out/`. When `output: 'export'` is used, `next-sitemap` should detect the `out/` folder.

**How to avoid:** In `next-sitemap.config.js`, verify the `outDir` config if needed: `outDir: './out'`. Test the postbuild output location.

**Warning signs:** SFTP deploy succeeds but `https://digipexel.cluxn.com/sitemap.xml` returns 404.

---

### Pitfall 5: Schema Markup Not Appearing in Page Source

**What goes wrong:** JSON-LD `<script>` is placed inside a `"use client"` component. The schema tag is rendered client-side only and doesn't appear in the raw page source HTML.

**Why it happens:** Client components are pre-rendered during static build BUT — if the component is deeply nested or wrapped, the JSON-LD may end up in client-side JS bundle rather than initial HTML.

**How to avoid:** Place JSON-LD `<script>` tags in Server Components only. `app/layout.tsx` is already a Server Component — add global Organization schema there. Per-page schemas go in the server wrapper `page.tsx`.

**Warning signs:** Run Google's Rich Results Test against the live URL — if it finds no schema, the tag is client-side only.

---

### Pitfall 6: 404 Page Design Mismatch

**What goes wrong:** `app/not-found.tsx` uses the root layout (Navbar/Footer from root layout.tsx) — but the existing Navbar in blocks/floating-icons-hero-demo.tsx does a fetch call on mount, which may flash or show errors on a 404 page where context is missing.

**How to avoid:** The `not-found.tsx` is a Server Component (unless marked `"use client"`). It renders WITHIN the root layout, so Navbar/Footer are inherited automatically — do NOT import them manually, or they will double-render. Verify by checking how `thank-you/page.tsx` handles it (it manually imports Navbar — this is fine for non-layout pages, but `not-found.tsx` is different since it's wrapped by root layout).

**Warning signs:** Double navbar or missing styles on the 404 page.

---

## Code Examples

### generateMetadata Fetching from PHP Backend
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/page.tsx (homepage — server component, add generateMetadata)
import type { Metadata } from 'next'
import HomePage from './home-client' // move "use client" logic to separate file

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=home`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Digi Pexel — AI Automation Agency',
    description: meta?.meta_description || 'We design reliable AI workflows...',
    openGraph: {
      title: meta?.seo_title || 'Digi Pexel',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function Page() {
  return <HomePage />
}
```

### Organization Schema in layout.tsx
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// Added to app/layout.tsx RootLayout return, inside <body>
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Digi Pexel',
  url: 'https://digipexel.cluxn.com',
  logo: 'https://digipexel.cluxn.com/icon.svg',
  description: 'AI automation and digital marketing agency for B2B decision makers',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://digipexel.cluxn.com/contact-us',
  },
}
// In JSX:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g, '\\u003c') }} />
```

### robots.txt via next-sitemap
```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://digipexel.cluxn.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
    additionalSitemaps: ['https://digipexel.cluxn.com/sitemap.xml'],
  },
  exclude: ['/admin', '/admin/*', '/thank-you'],
}
```

### PHP seo_meta endpoint (key pattern)
```php
// backend/api/seo_meta.php — GET handler
if ($method === 'GET') {
  $page_key = $_GET['page'] ?? '';
  if (!$page_key) { json_resp('error', null, 'page key required'); }
  $stmt = $pdo->prepare("SELECT seo_title, meta_description, og_image FROM seo_meta WHERE page_key = ?");
  $stmt->execute([$page_key]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  json_resp('success', $row ?: null);
}
// POST save_seo_meta handler uses INSERT ... ON DUPLICATE KEY UPDATE
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` + client-side meta injection | `generateMetadata` / `metadata` export in Server Components | Next.js 13 App Router | Meta in initial HTML; no race conditions |
| Manual `sitemap.xml` in `public/` | `next-sitemap` postbuild or native `sitemap.ts` | Next.js 13.3+ (native); next-sitemap predates | Auto-generates all routes |
| Calendly inline embed (iframe div) | `react-calendly` PopupWidget with portal | react-calendly 2+ | Cleaner modal UX; controlled via React props |
| `<script type="text/javascript">` for schema | `<script type="application/ld+json">` native tag in Server Component | Next.js 13+ | No hydration mismatch; SEO-correct |

**Deprecated/outdated:**
- `next/head` from pages router: Not available in App Router
- `next export` command: Removed in Next.js 14; replaced by `output: 'export'` config
- Native `robots.ts`/`sitemap.ts` with `output: 'export'`: Known bug in Next.js 15, workaround is next-sitemap postbuild

---

## Open Questions

1. **Does sitemap.ts work with output:export in Next.js 16.1.6?**
   - What we know: GitHub issue #68667 filed against Next.js 15, marked as open as of Aug 2024. Official docs (updated May 2026) don't document incompatibility explicitly.
   - What's unclear: Whether the issue was silently fixed in 16.x.
   - Recommendation: Use `next-sitemap` postbuild as the safe path. If the planner wants to test native sitemap.ts, add `export const dynamic = 'force-static'` — but use next-sitemap as fallback.

2. **Calendly URL — new setting key or repurpose `default_cta_link`?**
   - What we know: `default_cta_link` is already stored in the `settings` table, fetched by `connect-cta.tsx`, and serves as the primary CTA destination. Many CTAs say "Book a call" and link there.
   - What's unclear: Whether the user wants ALL CTAs to open Calendly popup, or only specific ones.
   - Recommendation: Per SEO-05, ALL "Book a call" / "Book a free audit" CTAs should open Calendly. Add a new `calendly_url` settings key. Admin sets their Calendly URL there. When populated, the `Connect` component uses CalendlyButton instead of a Link. When empty, fall back to `default_cta_link` (no regression).

3. **Per-page SEO scope: how many pages get admin-editable meta?**
   - What we know: The requirement says "any public page." Public pages are: home, blog listing, blog detail (per slug), case studies listing, case study detail (per slug), guides listing, guide detail (per id), services listing (n/a), service detail (per slug), testimonials, contact-us, privacy-policy, terms-and-conditions.
   - Recommendation: Admin SEO page uses a dropdown with hardcoded page list + slug. For dynamic routes, admin types the slug manually or selects from a fetched list. Page key pattern: `home`, `blog`, `blog/{slug}`, `services/{slug}`, etc.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `next build` + `next-sitemap` postbuild | Confirmed (CI uses Node 20) | 20 (CI) | — |
| npm | Package install | Confirmed | lockfile v3 | — |
| PHP 8.x | `seo_meta.php` backend | Confirmed (Hostinger) | 8.x | — |
| MySQL | `seo_meta` table creation | Confirmed (Hostinger) | localhost | — |
| Calendly account | SEO-05 | NOT VERIFIED — user must provide URL | — | CTA falls back to `default_cta_link` |
| Google PageSpeed Insights | SEO-06 audit | Web service, no install needed | Current | GTmetrix as alternative |

**Missing with no fallback:** None that block code. Calendly URL requires a user-supplied Calendly scheduling link — the component must degrade gracefully when empty.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + jest-environment-jsdom |
| Config file | `frontend/jest.config.js` |
| Quick run command | `cd frontend && npm test -- --testPathPattern=07` |
| Full suite command | `cd frontend && npm test -- --forceExit --maxWorkers=2` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STATIC-02 | not-found.tsx renders with Navbar and CTA links | unit | `npm test -- not-found` | ❌ Wave 0 |
| STATIC-01 | thank-you page renders with design system components | unit | `npm test -- thank-you` | ❌ Wave 0 |
| SEO-04 | JSON-LD script tag present in layout.tsx output | unit | `npm test -- layout` | ❌ Wave 0 |
| SEO-05 | CalendlyButton renders PopupWidget with correct URL | unit | `npm test -- calendly` | ❌ Wave 0 |
| SEO-01 | generateMetadata falls back to defaults when API unreachable | unit | `npm test -- seo-meta` | ❌ Wave 0 |
| SEO-03 | robots.txt content disallows /admin | manual/smoke | postbuild verification | N/A |
| SEO-06 | Page speed audit | manual | Lighthouse CLI or PageSpeed Insights | N/A |

### Sampling Rate
- **Per task commit:** `cd frontend && npm test -- --testPathPattern=<file> --forceExit`
- **Per wave merge:** `cd frontend && npm test -- --forceExit --maxWorkers=2`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `frontend/src/app/__tests__/not-found.test.tsx` — covers STATIC-02
- [ ] `frontend/src/app/__tests__/thank-you.test.tsx` — covers STATIC-01
- [ ] `frontend/src/components/ui/__tests__/calendly-button.test.tsx` — covers SEO-05
- [ ] `frontend/src/app/__tests__/layout-schema.test.tsx` — covers SEO-04

---

## Sources

### Primary (HIGH confidence)
- [Next.js — generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — confirmed `generateMetadata` is Server Component only; static export bakes meta at build time
- [Next.js — JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — confirmed native `<script>` tag pattern with `.replace(/</g, '\\u003c')`
- [Next.js — sitemap.xml reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — confirmed `MetadataRoute.Sitemap` return type, `export const dynamic = 'force-static'` requirement
- [Next.js — robots.txt reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — `robots.ts` pattern confirmed
- [Next.js — Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) — confirmed `out/404.html` IS generated; unsupported features list
- [Next.js — not-found.js reference](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — root `app/not-found.tsx` handles global unmatched URLs; `global-not-found.js` is experimental

### Secondary (MEDIUM confidence)
- [GitHub Issue #68667 — robots.ts fails with output:export in Next.js 15](https://github.com/vercel/next.js/issues/68667) — issue filed Aug 2024, status uncertain for 16.x; next-sitemap recommended as workaround
- [react-calendly GitHub README](https://github.com/tcampb/react-calendly) — PopupWidget requires `rootElement` as DOM node; `ssr: false` required for Next.js static builds
- `npm view react-calendly version` — confirmed 4.4.0
- `npm view next-sitemap version` — confirmed 4.2.3
- [next-sitemap npm package](https://www.npmjs.com/package/next-sitemap) — postbuild pattern, `generateRobotsTxt`, `exclude` option confirmed

### Tertiary (LOW confidence)
- Community reports that `sitemap.ts` + `robots.ts` with `output: 'export'` were fixed in some Next.js 16 canary — not officially documented; use next-sitemap to be safe

---

## Metadata

**Confidence breakdown:**
- Static pages (STATIC-01 through 05): HIGH — pages exist, patterns confirmed, just redesign/content work
- SEO meta architecture (SEO-01): HIGH — `generateMetadata` from official docs; constraint on build-time-only confirmed
- Sitemap/robots (SEO-02/03): HIGH for next-sitemap approach; MEDIUM for native sitemap.ts (uncertain with static export)
- Schema markup (SEO-04): HIGH — official Next.js JSON-LD guide confirmed
- Calendly (SEO-05): HIGH for integration pattern; LOW for specific user's Calendly URL (not verified)
- Page speed (SEO-06): MEDIUM — bottlenecks identified from research but actual numbers unknown until audit

**Research date:** 2026-05-16
**Valid until:** 2026-06-16 (30 days; stable ecosystem)
