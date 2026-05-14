# Phase 3: Service Pages - Research

**Researched:** 2026-05-14
**Domain:** Next.js static export service pages + PHP REST API + Admin CMS
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** New `service_content` table: `slug VARCHAR(50)`, `section VARCHAR(50)`, `content JSON NOT NULL`, `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`, `PRIMARY KEY (slug, section)`.
- **D-02:** Seed `service_content` from the existing `SERVICES` hardcoded object and `DEFAULT_SECTIONS` at init_db time using INSERT IGNORE so all 11 services have content immediately on first deploy.
- **D-03:** New `backend/api/service_content.php`. GET `?slug=ai-seo` returns all sections for that slug as `{ status: "success", data: { hero: {...}, features: {...}, ... } }`. GET `?slug=ai-seo&section=hero` returns single section. POST `action=save_section` + `slug` + `section` + `content` JSON saves one section. Follow existing action-based POST pattern from `site_content.php`.
- **D-04:** New page at `frontend/src/app/admin/services/page.tsx`. Add "SERVICES" to admin sidebar `admin-layout.tsx` between "SITE CONTENT" and "PARTNER LOGOS", icon: `Layers` or `Globe`.
- **D-05:** Admin page UI: service selector dropdown at top, then 6 section tabs: **Hero | Features | Roadmap | Market Impact | CTA | Testimonials**. On service change: fetch all sections for that slug. Follow the site-content page tab pattern.
- **D-06:** Each tab has a form + "Save [Section]" button. On save: POST to service_content.php with action=save_section. Show saving/saved/error status per tab.
- **D-07:** Hero tab fields: badge, heroLine1, heroLine2, heroCopy, ctaPrimary, pills (3 inputs), snapshotTitle, snapshotRows (4 inputs), statLabel1, statValue1, statLabel2, statValue2.
- **D-08:** Features tab fields: 3 feature cards, each with title + description. Icon stays hardcoded per card.
- **D-09:** Roadmap tab fields: 6 steps, each with title + desc. Plus roadmapTitle and roadmapCopy.
- **D-10:** Market Impact tab fields: outcomesTitle, outcomesCopy, 2 outcome cards (quote, company, sector, metric value, metric label), 4 stats (value + label).
- **D-11:** CTA tab fields: ctaBadge, ctaTitle, ctaCopy.
- **D-12:** Testimonials tab fields: 2-3 testimonials, each with quote + role + company.
- **D-13:** Comparison/gap section stays hardcoded in SERVICES constant. Not editable.
- **D-14:** Feature card icons hardcoded per card. No icon picker.
- **D-15:** Service page fetches from `api/service_content.php?slug={slug}` on client mount. Falls back to existing `SERVICES[slug]` hardcoded object if API fails.
- **D-16:** Service page is a `"use client"` component. On mount: one fetch call gets all 6 sections for the slug.
- **D-17:** All sections must follow eyebrow badge → heading → max 2-sentence description. Audit and fix violations.
- **D-18:** Design reference is benai.co/custom-solutions. Current layout already matches — fixes are copy and structural alignment only.
- **D-19:** Hero primary button → `/contact-us` (verify all 11).
- **D-20:** `ctaSecondary` field exists in data but is NOT rendered — do not add a second hero button. Claude decides whether to remove or keep unused.
- **D-21:** Feature card "Get Started" links → `/contact-us` (verify).
- **D-22:** CTA section buttons → `/contact-us` (already via `Connect` component).
- **D-23:** No `#` placeholder links on any service page after Phase 3.

### Claude's Discretion

- Exact JSON field names inside each section's content blob
- Whether to seed service_content via INSERT IGNORE or a separate seed call
- Loading skeleton or spinner while fetching service content on page load
- Admin form layout within each tab (label placement, input ordering)
- Whether `roadmapTitle`/`roadmapCopy` are per-service or shared (lean toward per-service for `roadmapTitle` minimum)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SVC-01 | All 12 service pages use consistent section format (eyebrow → heading → 2-line para) | Page audit section below; existing JSX already has Badge eyebrows — gaps are Roadmap and Outcomes sections using DEFAULT_SECTIONS hardcoded headings |
| SVC-02 | All service page buttons linked to respective destinations | Button audit below confirms hero primary already uses `/contact-us`; secondary is unrendered data (D-20); feature card "Get Started" uses `/contact-us` |
| SVC-03 | All service page content editable per service from admin (hero, features, roadmap, market impact, CTA, testimonials) | DB table D-01, PHP endpoint D-03, admin page D-04 through D-12, client fetch D-15/D-16 |
| SVC-04 | 6-step delivery roadmap customized per service with 2-line description per step | Roadmap currently uses DEFAULT_SECTIONS (shared). Must move to per-service data in service_content table. D-09 covers fields. |
| SVC-05 | Market impact section editable from admin with genuine numbers per service | Outcomes section currently uses DEFAULT_SECTIONS (shared). Must move to per-service. D-10 covers fields. |
| SVC-06 | CTA section copy customized per service | Connect component receives variant prop — service-specific ctaBadge/ctaTitle/ctaCopy from D-11, but Connect component may need prop extension. See Architecture notes. |
| SVC-07 | Service page testimonials look genuine and editable from admin | service.testimonials already exists in SERVICES data per service. D-12 stores them in DB per service. |
| SVC-08 | Design aligned to benai.co/custom-solutions reference | Layout already matches per CONTEXT.md D-18. Work is content/copy consistency only. |
</phase_requirements>

---

## Summary

Phase 3 is a well-scoped CMS extension phase. The service page JSX already exists with a solid layout. The work splits into three streams: (1) add a `service_content` PHP endpoint + DB table, (2) build the admin services page following the site-content pattern exactly, and (3) convert the service page from fully-static `SERVICES` lookup to a hybrid client-side API fetch with static fallback.

The most important implementation detail is data schema design: the per-service content is split across 6 sections (hero, features, roadmap, market_impact, cta, testimonials), each stored as a single JSON blob in one `(slug, section)` row. Field names within each blob must be agreed upon once and used consistently across three surfaces: the PHP seed data, the admin form state shape, and the service page render logic.

The service count question from CONTEXT.md specifics is resolved by code inspection: `SERVICES` has exactly 11 slugs and `generateStaticParams` is keyed to `Object.keys(SERVICES)`. The requirement text "12 service pages (11 existing + AI SEO Automation)" is a counting error — `ai-seo` is already one of the 11. Phase 3 operates on 11 service pages.

**Primary recommendation:** Follow the `site_content.php` + `admin/site-content/page.tsx` pattern exactly. The patterns are already proven; Phase 3 adds a second dimension (slug) to the same key–value JSON storage model.

---

## Standard Stack

### Core (already in project — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router, static export, `"use client"` pages | Project constraint |
| React | 19.2.3 | Component rendering | Project constraint |
| TypeScript | 5.x | Strict typing throughout frontend | Project constraint |
| PHP PDO/MySQL | 8.x | Backend API + database | Project constraint |
| `api.ts` (`api.get` / `api.post`) | — | Frontend HTTP client | Established pattern |
| `safeFetch()` | — | Error-safe fetch wrapper | Established pattern |

### Supporting (already in project)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.577.0 | Icons in feature cards and admin sidebar | All icon use |
| `@/components/ui/button` | — | Button primitive | All CTA buttons |
| `@/components/ui/badge` | — | Eyebrow badge | All section eyebrows |
| `AdminLayout` | — | Admin sidebar + auth guard | Wrap admin services page |
| `cn()` utility | — | Tailwind class merging | All className composition |

**Installation:** No new packages required. Phase 3 uses only libraries already present.

---

## Architecture Patterns

### Recommended Project Structure

No new directories needed. New files:

```
backend/
└── api/
    └── service_content.php        # new GET/POST endpoint

backend/
└── init_db.php                    # modify: add table + seed INSERT IGNORE

frontend/src/
├── app/
│   ├── admin/
│   │   └── services/
│   │       └── page.tsx           # new admin page
│   └── services/
│       └── [slug]/
│           └── page.tsx           # modify: add client fetch + fallback
└── components/
    └── admin/
        └── admin-layout.tsx       # modify: add SERVICES sidebar item
```

---

### Pattern 1: PHP service_content endpoint (follow site_content.php exactly)

**What:** GET returns all sections for a slug as a flat object keyed by section name. GET with `?section=X` returns just that section's content JSON. POST `action=save_section` upserts one `(slug, section)` row.

**When to use:** All admin saves and all public page fetches.

```php
// Source: backend/api/site_content.php (existing — mirror this structure)

// GET: ?slug=ai-seo  → returns { status: "success", data: { hero: {...}, features: {...}, ... } }
// GET: ?slug=ai-seo&section=hero → returns { status: "success", data: {...hero fields...} }
// POST: { action: "save_section", slug: "ai-seo", section: "hero", content: {...} }

if ($method === 'GET') {
    $slug    = $_GET['slug']    ?? null;
    $section = $_GET['section'] ?? null;
    if (!$slug) { json_resp('error', null, 'slug parameter required'); }

    if ($section) {
        // single section fetch
        $stmt = $pdo->prepare("SELECT content FROM service_content WHERE slug = ? AND section = ?");
        $stmt->execute([$slug, $section]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_resp('success', $row ? json_decode($row['content'], true) : null);
    } else {
        // all sections for slug
        $stmt = $pdo->prepare("SELECT section, content FROM service_content WHERE slug = ?");
        $stmt->execute([$slug]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        foreach ($rows as $row) {
            $result[$row['section']] = json_decode($row['content'], true);
        }
        json_resp('success', $result);
    }
}
```

---

### Pattern 2: Admin page with service selector + 6 tabs (follow site-content page exactly)

**What:** Top-level service `<select>` drives which slug is loaded. Tab row switches between sections. Each tab has a form + save button with idle/saving/saved/error status. On service change, fetch all sections for the new slug and update all 6 content state objects at once.

**When to use:** Admin service page.

```typescript
// Source: frontend/src/app/admin/site-content/page.tsx (existing — extend this pattern)

// Service selector triggers re-fetch:
const [selectedSlug, setSelectedSlug] = useState("ai-seo");

useEffect(() => {
  const fetchServiceSections = async () => {
    setLoading(true);
    const res = await api.get("service_content", { slug: selectedSlug });
    if (res?.status === "success" && res.data) {
      if (res.data.hero)         setHeroContent(res.data.hero);
      if (res.data.features)     setFeaturesContent(res.data.features);
      if (res.data.roadmap)      setRoadmapContent(res.data.roadmap);
      if (res.data.market_impact) setMarketImpactContent(res.data.market_impact);
      if (res.data.cta)          setCtaContent(res.data.cta);
      if (res.data.testimonials) setTestimonialsContent(res.data.testimonials);
    }
    setLoading(false);
  };
  fetchServiceSections();
}, [selectedSlug]);

// saveSection for service page:
const saveSection = async (section: TabId, content: any, setStatus: StatusSetter) => {
  setStatus("saving");
  const res = await api.post("service_content", {
    action: "save_section",
    slug: selectedSlug,
    section,
    content,
  });
  autoReset(setStatus, res?.status === "success" ? "saved" : "error");
};
```

---

### Pattern 3: Service page hybrid fetch (follow context-problem.tsx safeFetch pattern)

**What:** Service page becomes `"use client"`. On mount, fetch all sections from `service_content.php?slug={slug}`. Merge API data over the static `SERVICES[slug]` fallback. If API fails or returns empty, `SERVICES[slug]` is the complete fallback.

**When to use:** `frontend/src/app/services/[slug]/page.tsx` render.

```typescript
// Source: frontend/src/components/blocks/context-problem.tsx (safeFetch fallback pattern)
// NOTE: page.tsx currently uses React.use(params) for params unwrapping — keep this.
// Adding "use client" at the top replaces the server component behavior.

"use client";
// ...existing imports...
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const staticData = SERVICES[slug];
  if (!staticData) return notFound();

  // API-loaded sections merge over static defaults
  const [heroData, setHeroData] = useState(staticData);
  const [roadmapData, setRoadmapData] = useState(DEFAULT_SECTIONS);
  // ... other section states ...

  useEffect(() => {
    safeFetch(`${API_BASE_URL}/service_content.php?slug=${slug}`)
      .then((res) => {
        if (res?.status === "success" && res.data) {
          if (res.data.hero)         setHeroData({ ...staticData, ...res.data.hero });
          if (res.data.roadmap)      setRoadmapData({ ...DEFAULT_SECTIONS, ...res.data.roadmap });
          // ... merge other sections ...
        }
      });
  }, [slug]);
  // ...
}
```

**Critical note:** `generateStaticParams` must remain for static export pre-rendering. It does NOT conflict with `"use client"` — Next.js static export allows `generateStaticParams` in a page that is also a client component. The file currently uses `React.use(params)` to unwrap the `Promise<{ slug: string }>` params — this pattern must be preserved.

---

### Pattern 4: DB table creation + seed in init_db.php

**What:** Add `CREATE TABLE IF NOT EXISTS service_content` then INSERT IGNORE seed rows for all 11 slugs × 6 sections.

**When to use:** init_db.php.

```php
// Source: backend/init_db.php (existing pattern — add after existing tables)

CREATE TABLE IF NOT EXISTS service_content (
    slug    VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    content JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (slug, section)
);

-- Seed example (repeat for all 11 slugs × 6 sections):
INSERT IGNORE INTO service_content (slug, section, content) VALUES
('ai-seo', 'hero', '{"badge":"AI SEO Automation","heroLine1":"Stop optimizing for bots.","heroLine2":"Start winning AI answers.",...}'),
('ai-seo', 'features', '{"cards":[{"title":"GEO Optimization","description":"..."},...]},
...
```

Use INSERT IGNORE (not ON DUPLICATE KEY UPDATE) for seeding so re-running init_db.php after admin edits does NOT overwrite customized content.

---

### Pattern 5: Admin sidebar entry

**What:** Add one object to the `sidebarItems` array in `admin-layout.tsx` between "SITE CONTENT" (index 1) and "PARTNER LOGOS" (index 2).

```typescript
// Source: frontend/src/components/admin/admin-layout.tsx
// Layers is already imported. Use it.
{ name: "SERVICES", icon: Layers, href: "/admin/services", status: "Active" },
```

---

### Anti-Patterns to Avoid

- **Fetching sections individually on page load:** The public service page should make ONE fetch call (`?slug={slug}` with no `&section`) to get all 6 sections in one HTTP round-trip. Don't make 6 parallel calls.
- **Omitting fallback for missing sections:** When the API returns a partial result (e.g., hero exists but testimonials not seeded yet), the page must gracefully merge with `SERVICES[slug]` and `DEFAULT_SECTIONS` defaults.
- **Using ON DUPLICATE KEY UPDATE in seed:** Seed statements must use INSERT IGNORE so re-running init_db.php after admin has saved custom content does not overwrite changes.
- **Making service page a Server Component:** The existing page imports `React.use(params)` and the project is static export — `"use client"` is the correct direction. Server components cannot use `useEffect` for data fetching.
- **Duplicating `generateStaticParams` removal:** `generateStaticParams` is needed for static export to pre-render all 11 slugs. Keep it alongside `"use client"`.
- **Storing feature card icons in DB:** D-14 is locked — icons stay hardcoded. The features section JSON stores only `title` and `description` per card.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP client with error handling | Custom fetch wrapper | `api.get()` / `api.post()` from `lib/api.ts` | Already wraps `safeFetch()` with error normalization |
| Admin auth guard | Custom middleware | `AdminLayout` component | Already checks `localStorage.admin_auth` |
| Status feedback (saving/saved/error) | Custom state machine | `autoReset()` helper + 3-state pattern from site-content page | Pattern is tested and consistent across all admin pages |
| Tailwind class merging | Manual string concat | `cn()` from `lib/utils.ts` | Handles conflict resolution |
| Admin sidebar layout | New layout component | `AdminLayout` | Wrap every admin page with it |
| JSON upsert logic | Custom PHP | `INSERT ... ON DUPLICATE KEY UPDATE` | Standard MySQL pattern already used in `site_content.php` |

**Key insight:** Every building block for Phase 3 already exists in the project. The planner should frame all tasks as "replicate X pattern, adapting for service_content slug+section dimensions."

---

## Common Pitfalls

### Pitfall 1: generateStaticParams + "use client" coexistence

**What goes wrong:** Developer removes `generateStaticParams` when adding `"use client"` thinking they conflict, causing all service pages to 404 in static export.

**Why it happens:** `generateStaticParams` is a Next.js App Router export that works with both server and client components in static export mode. They are orthogonal concerns.

**How to avoid:** Keep `export async function generateStaticParams()` exactly as-is. Add `"use client"` as the first line. The build will pre-render all 11 slugs.

**Warning signs:** Build output shows fewer static pages than expected; service pages 404 after deploy.

---

### Pitfall 2: React.use(params) in a client component

**What goes wrong:** `React.use(params)` is used to unwrap `Promise<{ slug: string }>` in the existing page. If this is replaced with direct `params.slug` access, TypeScript strict mode will reject it because `params` is typed as a Promise.

**Why it happens:** Next.js 15+ App Router passes params as a Promise, requiring `React.use()` or `async` component to unwrap. Client components cannot be async, so `React.use()` is the correct pattern.

**How to avoid:** Keep `const { slug } = React.use(params)` unchanged. Do not attempt `params.slug` or `await params`.

**Warning signs:** TypeScript error "Property 'slug' does not exist on type 'Promise<...>'".

---

### Pitfall 3: Admin service selector resetting unsaved changes

**What goes wrong:** User edits Hero tab, then changes the service selector without saving. The new service fetch overwrites the in-progress edits silently.

**Why it happens:** The `useEffect` on `selectedSlug` replaces all content state on every service change.

**How to avoid:** When `selectedSlug` changes, reset all content states to either the API data or the SERVICES defaults for the new slug. This is correct behavior — the admin should save before switching services. Claude's discretion: add a visual note ("Unsaved changes will be lost") or simply accept this behavior (simpler). The site-content page does not warn either.

**Warning signs:** Not a bug per se — but document the expected behavior for the admin.

---

### Pitfall 4: INSERT IGNORE seed being overwritten

**What goes wrong:** Developer uses `ON DUPLICATE KEY UPDATE` in the seed, causing re-running init_db.php (e.g., during server migration) to overwrite admin-customized content with defaults.

**Why it happens:** Seed intent is "populate empty slots" not "overwrite existing."

**How to avoid:** Use `INSERT IGNORE INTO service_content` for all seed rows. Only an explicit admin save should overwrite content.

**Warning signs:** Admin reports custom content disappearing after server maintenance.

---

### Pitfall 5: ctaSecondary field in SERVICES data but not rendered

**What goes wrong:** The SERVICES TypeScript type declares `ctaSecondary: string` but the JSX never renders it (D-20 is locked: no second hero button). This creates a confusing admin field if ctaSecondary is accidentally included in the hero tab form.

**Why it happens:** The field was in an earlier design and was pruned from JSX but not from the type.

**How to avoid:** The hero admin tab MUST NOT include a `ctaSecondary` field. The JSON stored in `service_content` for the hero section should omit `ctaSecondary`. Claude's discretion: remove the field from the TypeScript `ServiceData` type or mark it as optional and document it as unused.

**Warning signs:** Admin sees a "Secondary CTA" input that does nothing on the live page.

---

### Pitfall 6: Service count mismatch (11 vs 12)

**What goes wrong:** REQUIREMENTS.md says "12 service pages (11 existing + AI SEO Automation)" but `ai-seo` is already one of the 11 slugs in SERVICES. There is no 12th service.

**Why it happens:** The requirement was written before `ai-seo` was added to SERVICES, creating an off-by-one in the spec.

**How to avoid:** The plan should target exactly 11 service slugs: `ai-seo`, `custom-ai-solutions`, `youtube-automation`, `instagram-automation`, `linkedin-automation`, `automation-flows`, `ai-workflows`, `workflow-creation`, `accounting-bookkeeping`, `hiring-recruitment`, `sales-automation`. Do not create a 12th service page. The requirement SVC-01 is satisfied by 11 pages.

**Warning signs:** Plan creates a new `ai-seo-automation` slug that duplicates the existing `ai-seo`.

---

## Code Examples

Verified patterns from existing codebase:

### Canonical JSON field names for each section blob

These field names are derived directly from the existing SERVICES and DEFAULT_SECTIONS objects in `services/[slug]/page.tsx`. Using these ensures zero field-name translation between seed, admin, and render.

**hero section blob:**
```json
{
  "badge": "AI SEO Automation",
  "heroLine1": "Stop optimizing for bots.",
  "heroLine2": "Start winning AI answers.",
  "heroCopy": "We build AI-ready...",
  "ctaPrimary": "Book a Strategy Call",
  "pills": ["GEO Strategy", "Entity Authority", "RAG Readiness"],
  "snapshotTitle": "Live Visibility Snapshot",
  "snapshotRows": ["Model citations: 68%", "Entity coverage: 92%", "Prompt intent match: 84%", "Trust signals: 76%"],
  "statLabel1": "Visibility Delta",
  "statValue1": "+41%",
  "statLabel2": "AI Answer Rate",
  "statValue2": "3.2x"
}
```

**features section blob:**
```json
{
  "cards": [
    { "title": "GEO Optimization", "description": "Optimize for Generative Engine Results..." },
    { "title": "Entity Authority", "description": "Map your content to semantic entities..." },
    { "title": "Automated Content Loop", "description": "A system that continuously updates..." }
  ]
}
```
Note: No `icon` field — icons stay hardcoded by card index.

**roadmap section blob:**
```json
{
  "roadmapTitle": "The 6-step delivery",
  "roadmapTitleAccent": "roadmap",
  "roadmapCopy": "A transparent, milestone-driven approach...",
  "items": [
    { "step": "01", "title": "Discovery", "desc": "Process auditing & feasibility" },
    { "step": "02", "title": "Architecture", "desc": "Logic mapping & tool selection" },
    { "step": "03", "title": "Engineering", "desc": "Build & data integration" },
    { "step": "04", "title": "Validation", "desc": "Security audit & QA testing" },
    { "step": "05", "title": "Deployment", "desc": "Live launch & pilot monitoring" },
    { "step": "06", "title": "Scale", "desc": "Performance tuning & expansion" }
  ]
}
```

**market_impact section blob:**
```json
{
  "outcomesTitle": "Partnering for",
  "outcomesTitleAccent": "high-velocity growth",
  "outcomesCopy": "We help modern teams ship faster...",
  "cards": [
    { "quote": "We removed the manual bottlenecks...", "company": "Atlas Studio", "sector": "Operations", "metricValue": "2x", "metricLabel": "Throughput" },
    { "quote": "Quality improved while cycle time dropped.", "company": "Signal Ops", "sector": "Delivery", "metricValue": "-38%", "metricLabel": "Cycle time" }
  ],
  "stats": [
    { "value": "2x", "label": "Throughput" },
    { "value": "38%", "label": "Faster cycles" },
    { "value": "6", "label": "Weeks to launch" },
    { "value": "24/7", "label": "Monitoring" }
  ]
}
```

**cta section blob:**
```json
{
  "ctaBadge": "Deployment Ready",
  "ctaTitle": "Ship faster with automation.",
  "ctaCopy": "Get a tailored plan and deployment timeline in days, not weeks."
}
```
Note: CTA section is rendered via `<Connect variant="light" />`. If `ctaBadge`/`ctaTitle`/`ctaCopy` need to be dynamic per service, the `Connect` component needs to accept these as optional props. Currently it does not — this is a required code change in the service page (pass props to Connect, or render an inline CTA block instead of Connect when custom content is available).

**testimonials section blob:**
```json
{
  "items": [
    { "quote": "Our brand citations increased 140%.", "role": "CEO", "company": "Nexus Tech" },
    { "quote": "Zero-click search visibility has been a game-changer.", "role": "Marketing Director", "company": "Aura Media" }
  ]
}
```

---

### Tab ID union type for admin services page

```typescript
// Extend the site-content pattern for 6 service sections
type TabId = "hero" | "features" | "roadmap" | "market_impact" | "cta" | "testimonials";

const TABS: { id: TabId; label: string }[] = [
  { id: "hero",          label: "Hero"          },
  { id: "features",      label: "Features"      },
  { id: "roadmap",       label: "Roadmap"       },
  { id: "market_impact", label: "Market Impact" },
  { id: "cta",           label: "CTA"           },
  { id: "testimonials",  label: "Testimonials"  },
];
```

---

### Service selector constant (all 11 slugs)

```typescript
const SERVICE_OPTIONS = [
  { slug: "ai-seo",                label: "AI SEO Services"          },
  { slug: "custom-ai-solutions",   label: "Custom AI Solutions"       },
  { slug: "youtube-automation",    label: "YouTube Automation"        },
  { slug: "instagram-automation",  label: "Instagram Automation"      },
  { slug: "linkedin-automation",   label: "LinkedIn Automation"       },
  { slug: "automation-flows",      label: "Automation Flows"          },
  { slug: "ai-workflows",          label: "AI Workflows"              },
  { slug: "workflow-creation",     label: "Workflow Creation"         },
  { slug: "accounting-bookkeeping",label: "Accounting & Bookkeeping"  },
  { slug: "hiring-recruitment",    label: "Hiring & Recruitment"      },
  { slug: "sales-automation",      label: "Sales Automation"          },
];
```

---

## Button Audit (SVC-02)

Findings from direct code inspection of `services/[slug]/page.tsx`:

| Location | Current href | Status | Action needed |
|----------|-------------|--------|---------------|
| Hero primary button | `<Link href="/contact-us">` | Correct | Verify stays `/contact-us` after API integration |
| Hero secondary button | Not rendered (data only in `ctaSecondary`) | No issue | D-20 confirms: do not render |
| Feature card "Get Started" | `<Link href="/contact-us">` | Correct | No change needed |
| CTA section (`<Connect />`) | Internal to Connect component | Must verify | Connect renders `/contact-us` internally — confirm |
| Comparison section | No links | Correct | Hardcoded text only |
| Roadmap/Outcomes/Testimonials | No external links | Correct | No links in these sections |

No `#` placeholder links found in service page JSX. SVC-02 is effectively satisfied by the current state; the task is to verify it remains true after the hybrid fetch is wired.

---

## CTA Section: Connect Component Analysis

The service page ends with `<Connect variant="light" />`. The `Connect` component renders the final CTA section. D-11 requires `ctaBadge`, `ctaTitle`, `ctaCopy` to be per-service and editable. This requires one of two approaches:

**Option A (recommended):** Add optional props to the `Connect` component: `badge?`, `title?`, `copy?`. When provided, override internal defaults. This is the cleanest extension.

**Option B:** Render an inline CTA block on the service page when custom CTA content is available, and fall back to `<Connect />` when it is not. More defensive but duplicates markup.

Claude should use Option A. The `Connect` component must be checked for its current prop interface before the plan is written.

---

## Section Format Audit (SVC-01, SVC-08)

From code inspection, the current section eyebrow/heading structure in the service page JSX:

| Section | Has Eyebrow Badge | Heading Split | Max 2-sentence copy |
|---------|-----------------|---------------|---------------------|
| Hero | Yes (`service.badge`) | Yes (heroLine1/heroLine2) | Yes (`heroCopy`) |
| Comparison | Yes ("The Reality Check" hardcoded) | No split — single `gapHeading` | No copy paragraph needed |
| Platform/Features | Yes ("The Platform" hardcoded) | Yes (platformTitle / platformTitleAccent from DEFAULT_SECTIONS) | Yes |
| Roadmap | Yes ("The Delivery Process" hardcoded) | Yes (roadmapTitle / roadmapTitleAccent from DEFAULT_SECTIONS) | Yes |
| Market Impact/Outcomes | Yes ("Market Impact" hardcoded) | Yes (outcomesTitle / outcomesTitleAccent) | Yes |
| Testimonials | Yes ("Real Intelligence" hardcoded) | Yes | Yes |

All sections already follow the eyebrow → heading → copy pattern. SVC-01 is fundamentally about making the headings in Roadmap, Market Impact, and Features sections per-service and editable — not a structural redesign.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| All service content hardcoded in SERVICES constant | Hybrid: API fetch merges over static fallback | Enables admin editing without code deploys |
| DEFAULT_SECTIONS shared across all 11 services | Per-service sections in service_content table | Satisfies SVC-04, SVC-05, SVC-06 distinctness requirement |
| Service page is a Server Component | Must become "use client" for client-side API fetch | Required by project's static export constraint |

---

## Open Questions

1. **Connect component props interface**
   - What we know: `<Connect variant="light" />` is the current call. The component exists at `frontend/src/components/blocks/connect-cta.tsx`.
   - What's unclear: Whether it already accepts `badge`, `title`, `copy` props or only `variant`.
   - Recommendation: Planner should include a task to read `connect-cta.tsx` and either add optional props or use Option B inline CTA fallback.

2. **roadmapTitle: per-service or shared?**
   - What we know: D-09 and Claude's discretion note say "lean toward per-service for roadmapTitle minimum." DEFAULT_SECTIONS has generic values.
   - What's unclear: Whether steps themselves (titles/descs) should differ per service in the initial seed or use the same 6-step defaults.
   - Recommendation: Store full roadmap per service in DB. Seed each service with the DEFAULT_SECTIONS roadmap steps. Admin can customize per-service. This satisfies SVC-04.

3. **Loading state UX during API fetch on service page**
   - What we know: Claude's discretion. The admin has `"Synchronizing Data..."` spinner.
   - What's unclear: Whether a spinner on the public service page is appropriate for B2B audience.
   - Recommendation: Render the static SERVICES fallback immediately (no loading blank), then silently replace with API data when it arrives (no visible flash for users with warm API). This avoids a layout shift for the most common case (API available).

---

## Environment Availability

Phase 3 is purely code + DB changes. All required tools are already confirmed available from prior phases. No new external dependencies.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20 | Next.js build | Yes | 20.x (CI pinned) | — |
| PHP 8.x | Backend API | Yes | 8.x (Hostinger) | — |
| MySQL | service_content table | Yes | Hostinger MySQL | — |
| npm | Frontend build | Yes | Present | — |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react 16.3.2 |
| Config file | `frontend/jest.config.ts` (exists) |
| Setup file | `frontend/jest.setup.ts` (imports `@testing-library/jest-dom`) |
| Quick run command | `cd frontend && npx jest --testPathPattern="service" --passWithNoTests` |
| Full suite command | `cd frontend && npx jest` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SVC-01 | All service page sections render eyebrow badge + heading | unit (smoke) | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-02 | Hero primary button links to `/contact-us`, no `#` hrefs | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-03 | Service page uses API data when available, falls back to SERVICES on error | unit (mock API) | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-04 | Roadmap section renders 6 steps from API data | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-05 | Market impact renders API-supplied numbers | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-06 | CTA section reflects per-service ctaTitle | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-07 | Testimonials render from API data when available | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |
| SVC-08 | All eyebrow badges present (no missing Badge components) | unit | `npx jest --testPathPattern="service-page"` | Wave 0 |

All 8 requirements map to a single test file: `frontend/src/app/services/__tests__/service-page.test.tsx`. Tests should mock `safeFetch` (same pattern as `whatsapp-button.test.tsx`) and assert on rendered output for a representative slug (`ai-seo`).

### Sampling Rate

- **Per task commit:** `cd frontend && npx jest --testPathPattern="service" --passWithNoTests`
- **Per wave merge:** `cd frontend && npx jest`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `frontend/src/app/services/__tests__/service-page.test.tsx` — covers SVC-01 through SVC-08

*(All other test infrastructure already exists from prior phases.)*

---

## Project Constraints (from CLAUDE.md)

Directives the planner must verify compliance with:

| Directive | Impact on Phase 3 |
|-----------|------------------|
| Static export (`output: 'export'`) | Service page must be `"use client"` + client-side fetch. No `getServerSideProps` or server fetch at runtime. |
| `images: { unoptimized: true }` in next.config.ts | Already set from Phase 1. No new image handling in Phase 3. |
| PHP backend: action-based POST routing | `service_content.php` POST must use `action=save_section` pattern, not REST-style routing. |
| No PHP framework | Plain PHP + PDO only. No Eloquent, no Slim. |
| `safeFetch()` for public API calls | Service page uses `safeFetch()` directly (not `api.get()`) — both are acceptable; `api.get()` also wraps safeFetch. |
| `api.get()` / `api.post()` for admin pages | Admin services page uses `api.get()` and `api.post()` from `lib/api.ts`. |
| `"use client"` for all interactive components | Admin page and updated service page both require `"use client"`. |
| Named exports for shared components, default exports for pages | Admin services page: `export default function AdminServicesPage`. |
| No barrel files | Do not create `frontend/src/app/admin/services/index.ts`. |
| Absolute imports via `@/*` | All imports in new files use `@/components/...`, `@/lib/...`, etc. |
| TypeScript strict mode | All new interfaces must cover all field names. No implicit `any` except where existing patterns use it (e.g., `features?: { title: string; description: string; icon: any }[]`). |
| No staging environment | Test locally or in production only. Deploy via GitHub Actions SFTP. |
| `init_db.php` must remain accessible | Phase 3 only adds to init_db.php. Does not block or modify the accessibility pattern. |

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection: `frontend/src/app/services/[slug]/page.tsx` — full SERVICES record (11 slugs confirmed), DEFAULT_SECTIONS, all JSX sections, button href values
- Direct code inspection: `frontend/src/app/admin/site-content/page.tsx` — admin tab pattern, saveSection helper, autoReset, TabId union, status state shape
- Direct code inspection: `backend/api/site_content.php` — GET/POST handler, INSERT ON DUPLICATE KEY UPDATE, json_resp usage
- Direct code inspection: `backend/init_db.php` — table creation pattern, INSERT IGNORE seed pattern, existing tables
- Direct code inspection: `frontend/src/components/admin/admin-layout.tsx` — sidebarItems array, Layers already imported
- Direct code inspection: `frontend/src/lib/api.ts` — api.get/api.post signatures
- Direct code inspection: `frontend/src/components/ui/__tests__/whatsapp-button.test.tsx` — established test pattern with safeFetch mock
- Direct code inspection: `frontend/jest.config.ts` + `jest.setup.ts` — test infrastructure confirmed

### Secondary (MEDIUM confidence)

- CONTEXT.md decisions D-01 through D-23 — user-locked implementation choices verified against codebase
- REQUIREMENTS.md SVC-01 through SVC-08 — requirement text cross-referenced with CONTEXT.md and code

### Tertiary (LOW confidence)

- Service count: "12 vs 11" discrepancy resolved by counting SERVICES keys directly (11). The 12th service mentioned in REQUIREMENTS.md does not exist.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries are already in the project and verified by direct file inspection
- Architecture patterns: HIGH — all patterns derived from existing production code in the same repo
- Pitfalls: HIGH — derived from code inspection (React.use, generateStaticParams, INSERT IGNORE logic) and locked decisions
- Service count: HIGH — counted directly from SERVICES object keys

**Research date:** 2026-05-14
**Valid until:** 2026-06-14 (stable stack — no fast-moving dependencies)
