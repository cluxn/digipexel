# Phase 02: Homepage & Site Content Admin - Research

**Researched:** 2026-05-14
**Domain:** Next.js static export + PHP REST API — connecting homepage sections to admin CMS
**Confidence:** HIGH (all findings based on direct codebase inspection)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Single admin page at `/admin/site-content` with 4 tabs: Hero, Navbar, Stats, Footer. One sidebar item "SITE CONTENT" added (position: after DASHBOARD, before PARTNER LOGOS).
- **D-02:** Hero tab edits: `heading`, `titleHighlight`, `subtitle`, `ctaText`, `ctaHref`, and the 6 floating icon slot identifiers.
- **D-03:** Navbar tab edits: CTA button `text` and `href` only. Dropdown structure (Services, Work, Insights) remains hardcoded — not admin-editable.
- **D-04:** Stats tab edits: 4 rows, each with `label`, `value`, `description` fields.
- **D-05:** Footer tab scope limited to newsletter section heading/subtext only. Nav links and social links stay hardcoded.
- **D-06:** New `site_content` DB table: `section VARCHAR(50) PRIMARY KEY`, `content JSON NOT NULL`, `updated_at TIMESTAMP`. One row per section: `hero`, `nav`, `stats`, `footer`.
- **D-07:** New `settings` DB table: `key VARCHAR(50) PRIMARY KEY`, `value TEXT`. Initial row: `whatsapp_number` = `''`.
- **D-08:** New `newsletter_subscribers` DB table: `id INT AUTO_INCREMENT PRIMARY KEY`, `email VARCHAR(255) UNIQUE`, `subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`, `status ENUM('active','unsubscribed') DEFAULT 'active'`.
- **D-09:** `backend/api/site_content.php` — GET `?section=hero|nav|stats|footer`; POST `action=save_section`.
- **D-10:** `backend/api/settings.php` — GET `?key=whatsapp_number`; POST `action=save_setting`.
- **D-11:** `backend/api/newsletter.php` — POST `action=subscribe`, accepts `email`.
- **D-12:** `FloatingIconsHeroDemo` fetches hero content from `api/site_content.php?section=hero` on mount. Falls back to hardcoded values on failure.
- **D-13:** Admin changes reflected on homepage on next page load (no cache, client-side fetch).
- **D-14:** Floating icons use a preset icon registry — hardcoded map of ~20 supported tool icons. All SVGs stay in code.
- **D-15:** Admin sees a dropdown/select per slot (6 slots) — picks an icon name from the preset list. Slot position classes remain hardcoded.
- **D-16:** Icon slot data stored in `site_content` table, section=`hero`, as `iconSlots: [{slot: 1, icon: "openai", label: "OpenAI"}, ...]`.
- **D-17:** Logo marquee — no code changes needed. Update logos data via existing `/admin/logos` page. Add: OpenAI, Anthropic, n8n, Zapier, Make.com, Google Ads, Meta, Microsoft.
- **D-18:** Logo marquee admin task is a data update — not a code change.
- **D-19:** Simple copy edits in code: `services.tsx` eyebrow "Our Ecosystem" → "What We Do". Other eyebrows reviewed and simplified where jargon exists.
- **D-20:** Services cards in `services.tsx` — verify `href` values only. No code changes expected unless an href is `"#"`.
- **D-21:** `context-problem.tsx` subtitle trimmed to max 2 lines. Current text is already close — verify and trim if needed.
- **D-22:** `testimonials.tsx` block fetches from `api/testimonials.php` on mount. Falls back to current hardcoded array.
- **D-23:** Display first 9 published testimonials ordered by `id ASC`. No `display_on_homepage` flag needed.
- **D-24:** Add email newsletter signup form to `footer-section.tsx` — single-line email input + Subscribe button, inline.
- **D-25:** On submit, POST to `api/newsletter.php` with `action=subscribe`. Show success/error inline with `useState`.
- **D-26:** Footer nav links are already all connected — no changes needed.
- **D-27:** WhatsApp floating button: fixed bottom-right, z-50, green circle, WhatsApp icon, 52×52px, subtle drop shadow.
- **D-28:** Button fetches number from `api/settings.php?key=whatsapp_number` on mount. Hidden if number is empty or API fails. Opens `https://wa.me/{number}` in new tab.
- **D-29:** New `WhatsAppButton` client component at `frontend/src/components/ui/whatsapp-button.tsx`. Mounted in `app/layout.tsx` globally.

### Claude's Discretion
- Exact JSON schema for `site_content` content blobs
- Admin UI layout within each tab (form fields, save button placement, loading/error states)
- Newsletter subscribe form visual design within footer (minimal, matching existing footer aesthetic)
- WhatsApp button hover animation and exact positioning
- Whether DB table creation goes in `init_db.php` or a separate migration — follow existing `init_db.php` pattern

### Deferred Ideas (OUT OF SCOPE)
- Full footer link admin-editability (nav columns, social link URLs) — Phase 6
- Full navbar dropdown admin control — not in scope
- Newsletter subscriber list view and export — Phase 6
- Settings admin page (full) — Phase 6
- Announcement bar / banners on public pages — Phase 6
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Hero section content editable from admin | D-12, D-13: `FloatingIconsHeroDemo` refactored to fetch from `site_content.php?section=hero`; hardcoded fallback pattern from `logo-marquee.tsx` |
| HOME-02 | Floating icons replaced with real tech brand icons, manageable from admin | D-14, D-15, D-16: Preset icon registry already in `floating-icons-hero-demo.tsx` (22 SVG icons defined); admin picks from dropdown |
| HOME-03 | Navbar links and CTA button editable from admin | D-03: CTA-only editability — `href="/contact-us"` and text "Book a Call" in `floating-icons-hero-demo.tsx` Navbar component |
| HOME-04 | Logo marquee updated with real partner logos | D-17, D-18: Data update only via existing `/admin/logos` UI; SVG URLs from Wikimedia or official CDNs |
| HOME-05 | All section eyebrow labels rewritten to be clear | D-19: `services.tsx` "Our Ecosystem" → "What We Do"; other eyebrows reviewed |
| HOME-06 | Services section cards linked to service pages | D-20: All `href` values already set in `services.tsx` — verify only |
| HOME-07 | Problem section paragraph trimmed to 2 lines | D-21: `context-problem.tsx` subtitle is 2 sentences, ~2 lines — verify, trim if needed |
| HOME-08 | Homepage testimonials block fetches from admin panel | D-22, D-23: `testimonials.tsx` converted to client component with `useEffect` + `safeFetch`; first 9 by `id ASC` |
| HOME-09 | Footer newsletter signup input, all links connected | D-24, D-25, D-26: Add newsletter form to `footer-section.tsx`; all nav links already working |
| HOME-10 | WhatsApp floating button on every public page | D-27, D-28, D-29: New `WhatsAppButton` component in `app/layout.tsx` |
| CONT-01 | Admin section to manage hero content | D-01, D-02: Hero tab in `/admin/site-content` |
| CONT-02 | Admin section to manage navbar links (CTA only per D-03) | D-01, D-03: Navbar tab — CTA text and href only |
| CONT-03 | Admin section to manage footer content | D-01, D-05: Footer tab — newsletter heading/subtext only |
| CONT-04 | Admin section to manage agency stats | D-01, D-04: Stats tab — 4 rows of label, value, description |
</phase_requirements>

---

## Summary

Phase 2 connects every remaining hardcoded homepage section to the admin CMS. The work falls into four groups: (1) new PHP endpoints and DB tables for content that has no API yet (`site_content`, `settings`, `newsletter_subscribers`), (2) new admin page `/admin/site-content` with four tabs, (3) frontend homepage blocks refactored to fetch from API instead of hardcoded data (`FloatingIconsHeroDemo`, `AgencyStats`, `Testimonials`), and (4) two new UI components (`WhatsAppButton`, newsletter form in footer).

The codebase already has a complete, working pattern for this exact work. `LogoMarquee` is the canonical example: `"use client"`, `useState` + `useEffect`, `safeFetch("/api/logos.php")`, hardcoded fallback array. Every block that needs connecting follows this exact pattern. The admin page pattern (`/admin/logos/page.tsx`) shows the form structure: load on mount via `safeFetch`, controlled `useState` per field, save via `api.post()`, inline success/error, localStorage preview fallback.

The `testimonials.tsx` block currently has no `"use client"` directive — it must be added when converting to a data-fetching component. The `floating-icons-hero-demo.tsx` already has all 22 icon SVGs defined inline and all 6 slot identities hardcoded — the refactor is purely wiring those up to dynamic state from the API rather than constants.

**Primary recommendation:** Follow the `LogoMarquee` + `AdminLogosPage` pairing as the template for every homepage block conversion and its corresponding admin tab. All patterns are already proven in production code — do not invent new ones.

---

## Standard Stack

No new libraries are needed for this phase. All required capabilities exist in the current dependencies.

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.3 | UI, `useState`, `useEffect` | Project foundation |
| Next.js | 16.1.6 | App Router, static export | Project foundation |
| Tailwind CSS | 4.x | Styling | Project convention |
| lucide-react | 0.577.0 | Icons (WhatsApp icon) | Already used throughout |
| framer-motion / motion | 12.36.0 | Animations | Already used in `AgencyStats`, footer |

### Supporting (backend, already established)

| Tool | Purpose | Pattern |
|------|---------|---------|
| PHP 8.x PDO/MySQL | New endpoints follow `logos.php` pattern | `require_once '../common.php'` |
| MySQL JSON column | `site_content.content` column type | `JSON NOT NULL` — MySQL 5.7.8+ supported on Hostinger |

### No New Installations Needed

All required npm packages are already in `frontend/package.json`. No `npm install` step required for this phase.

---

## Architecture Patterns

### Canonical Homepage Block Pattern (from `logo-marquee.tsx`)

Every homepage block that fetches from API follows this exact structure:

```typescript
// Source: frontend/src/components/blocks/logo-marquee.tsx
"use client";

import React, { useEffect, useState } from "react";
import { safeFetch } from "@/lib/utils";

interface DataShape { /* ... */ }

const FALLBACK_DATA: DataShape[] = [ /* hardcoded values */ ];

export function BlockComponent() {
  const [data, setData] = useState<DataShape[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const json = await safeFetch("/api/endpoint.php?param=value");
      if (json.status === "success") {
        setData(json.data.field); // extract correct key from json.data
        setLoading(false);
        return;
      }
      // On failure: keep FALLBACK_DATA already in state
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null; // or skeleton

  return ( /* render with data */ );
}
```

**Critical note on `safeFetch` path:** Public homepage blocks call `safeFetch("/api/endpoint.php")` — a root-relative path. This works because Next.js static export rewrites or the browser resolves against the origin. Admin pages use `api.post("endpoint_name", body)` which constructs `${API_BASE_URL}/endpoint_name.php` as a full absolute URL.

### Canonical Admin Page Pattern (from `/admin/logos/page.tsx`)

```typescript
// Source: frontend/src/app/admin/logos/page.tsx
"use client";

import AdminLayout from "@/components/admin/admin-layout";
import { safeFetch } from "@/lib/utils";
import { api } from "@/lib/api";

export default function AdminSitePage() {
  const [data, setData] = useState(/* initial state */);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await api.get("site_content", { section: "hero" });
    if (res?.status === "success") {
      // populate state from res.data
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    setSaving(true);
    const res = await api.post("site_content", { action: "save_section", section: "hero", content: data });
    setSaveStatus(res?.status === "success" ? "success" : "error");
    setSaving(false);
  };

  return (
    <AdminLayout>
      {/* tab switcher + form fields + save button */}
    </AdminLayout>
  );
}
```

### Canonical PHP Endpoint Pattern (from `backend/api/logos.php`)

```php
<?php
// backend/api/site_content.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $section = $_GET['section'] ?? null;
        if (!$section) {
            json_resp('error', null, 'section parameter required');
        }
        $stmt = $pdo->prepare("SELECT content FROM site_content WHERE section = ?");
        $stmt->execute([$section]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            json_resp('success', json_decode($row['content'], true));
        } else {
            json_resp('success', null, 'No content for section');
        }
    }
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'save_section') {
            $section = $input['section'];
            $content = json_encode($input['content']);
            $stmt = $pdo->prepare(
                "INSERT INTO site_content (section, content, updated_at) VALUES (?, ?, NOW())
                 ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = NOW()"
            );
            $stmt->execute([$section, $content]);
            json_resp('success', null, 'Section saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
```

### Recommended Admin Tab Structure for `/admin/site-content`

```
/admin/site-content/page.tsx
  - State: activeTab ("hero" | "nav" | "stats" | "footer")
  - State: one state object per tab's data
  - Each tab rendered as conditional section (not separate routes)
  - Single "Save [TabName]" button per tab, not one global save
  - Tab switcher styled same as existing admin pills
```

### `init_db.php` Extension Pattern

New tables are added as additional `CREATE TABLE IF NOT EXISTS` blocks inside the same `$sql` heredoc, following existing tables. Seed rows use the `WHERE NOT EXISTS` pattern already in the file.

```php
// Add inside $sql string in init_db.php, after existing table definitions:
CREATE TABLE IF NOT EXISTS site_content (
    section VARCHAR(50) PRIMARY KEY,
    content JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(50) PRIMARY KEY,
    `value` TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'unsubscribed') DEFAULT 'active'
);
```

Seed `whatsapp_number`:
```php
INSERT INTO settings (`key`, `value`)
SELECT 'whatsapp_number', ''
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE `key` = 'whatsapp_number');
```

### Anti-Patterns to Avoid

- **Never import from both `framer-motion` and `motion/react` in the same file.** Existing codebase has mixed usage (`agency-stats.tsx` imports from `framer-motion`; `testimonials.tsx`, `context-problem.tsx`, `logo-marquee.tsx` import from `motion/react`). Follow the import already present in each file when editing — do not introduce a second import source.
- **Never use `api.post()` from homepage public blocks.** Public blocks use `safeFetch()` with relative paths. Admin pages use `api.post()` / `api.get()` with full API_BASE_URL. Keep these separate.
- **Never add `"use client"` to `app/layout.tsx`.** It is currently a Server Component. `WhatsAppButton` must be its own `"use client"` component that layout imports — not inline client code.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP fetch with error handling | Custom fetch wrapper | `safeFetch()` from `lib/utils.ts` | Already handles non-2xx, JSON parse errors, network failures |
| Admin HTTP client | Direct fetch in admin | `api.get()` / `api.post()` from `lib/api.ts` | Handles API_BASE_URL construction |
| Class merging | Manual string concat | `cn()` from `lib/utils.ts` | Handles Tailwind conflicts |
| Icon display | Custom SVG component | lucide-react for WhatsApp icon | Already in dependencies |
| Testimonials data shape | Custom type | Match existing `testimonials` DB schema: `name, role, company, content, image_url` | DB already has this shape |

**Key insight:** Every utility this phase needs already exists. The phase is wiring, not building infrastructure.

---

## Common Pitfalls

### Pitfall 1: `logos.php` Response Shape Mismatch

**What goes wrong:** `logos.php` returns `json_resp('success', ["enabled" => ..., "logos" => ...])`. This wraps the array under `data`, so the actual response is `{ status: "success", data: { enabled: true, logos: [...] } }`. The logo-marquee component reads `json.data` (gets the object `{ enabled, logos }`) and `json.enabled` (gets `undefined`). This is a latent bug in the existing code — the admin logos page reads `data.data` correctly.

**Why it happens:** `json_resp()` always wraps the second argument under `data`. If you pass an associative array, `data` is an object with named keys.

**How to avoid for new endpoints:** When writing `site_content.php`, return the content directly: `json_resp('success', $decoded_content_array)`. The caller gets `json.data` = the content object. Be explicit: `const content = json.data as HeroContent`.

**Warning signs:** If the homepage block shows empty/fallback data when the API call returns 200, check what key the JSON is actually under.

### Pitfall 2: `testimonials.tsx` is Missing `"use client"`

**What goes wrong:** The current `testimonials.tsx` does NOT have a `"use client"` directive at the top. It also has no `useEffect` — it renders from a hardcoded static array. When converting it to fetch from the API, you must add `"use client"` as the very first line and add the import for `useState`, `useEffect`.

**Why it happens:** Static-data components don't need the client directive; forgetting to add it when adding hooks causes a Next.js build error.

**How to avoid:** Add `"use client";` as line 1 before any imports when converting.

### Pitfall 3: `app/layout.tsx` Cannot Become a Client Component

**What goes wrong:** Adding `"use client"` to `app/layout.tsx` to mount `WhatsAppButton` inline will break the layout (prevents `export const metadata`, disables RSC features).

**Why it happens:** Next.js App Router layouts that export `metadata` must be Server Components.

**How to avoid:** Create `WhatsAppButton` as its own `"use client"` component at `components/ui/whatsapp-button.tsx`. Import and render it inside `RootLayout`'s JSX. The component itself handles client behavior; the layout stays a Server Component.

### Pitfall 4: `init_db.php` Multiple SQL Statements via `$pdo->exec()`

**What goes wrong:** PDO's `exec()` typically cannot run multiple statements in a single call on all PDO drivers. The existing `init_db.php` puts multiple `CREATE TABLE` statements in a single `$pdo->exec($sql)` call — this works on Hostinger MySQL because of the specific driver config, but adding new tables must go inside the same `$sql` string, not a second `exec()` call that might fail silently.

**How to avoid:** Append the three new `CREATE TABLE IF NOT EXISTS` blocks into the existing `$sql` string variable, before the `$pdo->exec($sql)` call. Seed inserts go after `$pdo->exec($sql)` as separate `exec()` calls following the existing pattern.

### Pitfall 5: WhatsApp `wa.me` Number Format

**What goes wrong:** `https://wa.me/+91-9876543210` fails. WhatsApp `wa.me` requires digits only, no `+`, no dashes, no spaces.

**How to avoid:** Strip non-digit characters in the component: `const cleaned = number.replace(/\D/g, '')`. Validate the stored number is pure digits or do stripping on render. If number is empty after cleaning, hide the button.

### Pitfall 6: `safeFetch` Path vs Full URL

**What goes wrong:** `safeFetch("/api/logos.php")` works in the browser (resolves against the page origin). But if a developer uses `safeFetch(API_BASE_URL + "/site_content.php")` instead, the URL becomes absolute (e.g., `https://digi.cluxn.com/backend/api/site_content.php`). Both work in production, but mixing creates inconsistency and can cause CORS issues in local dev.

**How to avoid:** Homepage public blocks use `safeFetch("/api/endpoint.php")` (root-relative). Admin pages use `api.get("endpoint_name")` / `api.post("endpoint_name", body)` which already handles the full URL via `API_BASE_URL`. Do not mix the two approaches within the same component type.

### Pitfall 7: Admin Sidebar Item Insertion Order

**What goes wrong:** D-01 specifies SITE CONTENT goes "after DASHBOARD, before PARTNER LOGOS." The current `sidebarItems` array in `admin-layout.tsx` starts: `DASHBOARD`, `PARTNER LOGOS`, `CASE STUDIES`, ... — so the new item must be inserted at index 1 (between index 0 and index 1).

**How to avoid:** Insert `{ name: "SITE CONTENT", icon: Globe, href: "/admin/site-content", status: "Active" }` at array position 1. The `Globe` icon is already imported in `admin-layout.tsx` (used for the "VIEW SITE" footer link) — no new import needed.

---

## Code Examples

### Hero Content JSON Schema (Claude's Discretion — Recommended)

```typescript
// Stored in site_content table, section = "hero"
interface HeroContent {
  heading: string;           // "Automate"
  titleHighlight: string;    // "with AI that ships"
  subtitle: string;          // paragraph text
  ctaText: string;           // "Book a Strategy Call"
  ctaHref: string;           // "/contact-us"
  iconSlots: Array<{
    slot: number;            // 1-6 (matches aiIcons[].id)
    icon: string;            // key from ICON_REGISTRY: "openai", "n8n", etc.
    label: string;           // display label: "OpenAI", "n8n"
  }>;
}
```

### Nav Content JSON Schema

```typescript
// Stored in site_content table, section = "nav"
interface NavContent {
  ctaText: string;   // "Book a Call"
  ctaHref: string;   // "/contact-us"
}
```

### Stats Content JSON Schema

```typescript
// Stored in site_content table, section = "stats"
interface StatsContent {
  stats: Array<{
    label: string;       // "FASTER SHIPPING"
    value: string;       // "42%"
    description: string; // "Automation eliminates..."
  }>;
}
```

### Footer Content JSON Schema

```typescript
// Stored in site_content table, section = "footer"
interface FooterContent {
  newsletterHeading: string;  // e.g. "Stay ahead of AI automation"
  newsletterSubtext: string;  // e.g. "Weekly insights for ops leaders."
}
```

### Floating Icon Registry Pattern

```typescript
// In floating-icons-hero-demo.tsx — map from string key to component
const ICON_REGISTRY: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "openai":    IconOpenAI,
  "n8n":       IconN8N,
  "zapier":    IconZapier,
  "make":      IconMake,
  "anthropic": IconAnthropic,
  "slack":     IconSlack,
  "google":    IconGoogle,
  "github":    IconGitHub,
  "notion":    IconNotion,
  "figma":     IconFigma,
  "microsoft": IconMicrosoft,
  "vercel":    IconVercel,
  "stripe":    IconStripe,
  "discord":   IconDiscord,
  "youtube":   IconYouTube,
  "linear":    IconLinear,
  "x":         IconX,
  "spotify":   IconSpotify,
  "dropbox":   IconDropbox,
  "twitch":    IconTwitch,
  "apple":     IconApple,
};
```

### WhatsApp Button Component Structure

```typescript
// frontend/src/components/ui/whatsapp-button.tsx
"use client";

import React, { useEffect, useState } from "react";
import { safeFetch } from "@/lib/utils";

export function WhatsAppButton() {
  const [number, setNumber] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNumber() {
      const json = await safeFetch("/api/settings.php?key=whatsapp_number");
      if (json.status === "success" && json.data?.value) {
        const cleaned = (json.data.value as string).replace(/\D/g, "");
        if (cleaned.length >= 7) setNumber(cleaned);
      }
    }
    fetchNumber();
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-full bg-[#25D366]
                 flex items-center justify-center shadow-lg shadow-black/20
                 hover:scale-110 transition-transform duration-200"
    >
      {/* WhatsApp SVG icon — inline, no external dependency */}
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.006 2C6.477 2 2 6.477 2 12.003c0 1.765.463 3.478 1.34 4.988L2 22l5.14-1.315A9.988 9.988 0 0 0 12.006 22C17.524 22 22 17.524 22 12.003 22 6.477 17.524 2 12.006 2zm5.99 14.027c-.248.694-1.435 1.328-2.006 1.413-.511.077-1.159.109-1.871-.118-.432-.136-.985-.319-1.694-.625-2.981-1.287-4.928-4.289-5.077-4.487-.148-.199-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.479.272-.298.594-.372.792-.372.199 0 .397.002.57.01.182.01.427-.069.669.51.247.595.841 2.058.916 2.207.075.149.124.322.025.52-.1.199-.149.323-.298.497-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.249.67-.15.272.1 1.733.818 2.03.967.298.149.496.223.57.347.075.124.075.719-.173 1.413z"/>
      </svg>
    </a>
  );
}
```

### Newsletter Form in Footer

```typescript
// Added inside footer-section.tsx brand column, after social icons
// State lives in the Footer component (convert to "use client" + add useState)
const [email, setEmail] = useState("");
const [subStatus, setSubStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
const [subLoading, setSubLoading] = useState(false);

const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubLoading(true);
  const res = await safeFetch("/api/newsletter.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "subscribe", email }),
  });
  if (res.status === "success") setSubStatus("success");
  else if (res.message?.includes("Duplicate") || res.message?.includes("already")) setSubStatus("duplicate");
  else setSubStatus("error");
  setSubLoading(false);
};
```

### `settings.php` Response Shape

GET `?key=whatsapp_number` should return:
```json
{ "status": "success", "data": { "key": "whatsapp_number", "value": "" } }
```

So the component reads `json.data.value`.

### Logo Data Seeds to Add (D-17)

These SVG URLs are verified from Wikimedia Commons (all CC licensed, free to use):

| Brand | SVG URL |
|-------|---------|
| OpenAI | Use inline SVG already in `floating-icons-hero-demo.tsx` — no Wikimedia URL; use `text` display_type with name "OpenAI" |
| Anthropic | Same — use `text` display_type |
| n8n | Same — use `text` display_type |
| Zapier | `https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg` |
| Google Ads | `https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg` |
| Meta | `https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg` |
| Microsoft | Already in `floating-icons-hero-demo.tsx` as `IconMicrosoft` — use `text` display_type |
| Make.com | Use `text` display_type with name "Make" |

Note: For brands without a reliable Wikimedia URL, use `display_type: "text"` so just the brand name renders in the marquee — this is supported by the existing logo-marquee component.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely code and database changes within the existing Hostinger + Next.js setup. No new external tools, services, or runtimes are required. All database operations use the existing PDO/MySQL connection in `config.php`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + jest-environment-jsdom + @testing-library/react 16.3.2 |
| Config file | `frontend/jest.config.js` (or `jest.config.ts` — check at task time) |
| Quick run command | `cd frontend && npx jest --testPathPattern="site-content\|whatsapp\|newsletter" --passWithNoTests` |
| Full suite command | `cd frontend && npx jest --passWithNoTests` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-08 | `Testimonials` component fetches from API, renders first 9 | unit | `cd frontend && npx jest --testPathPattern="testimonials" --passWithNoTests` | Wave 0 |
| HOME-10 | `WhatsAppButton` hidden when number is empty; shows when set | unit | `cd frontend && npx jest --testPathPattern="whatsapp" --passWithNoTests` | Wave 0 |
| HOME-09 | Newsletter form submits and shows success/duplicate messages | unit | `cd frontend && npx jest --testPathPattern="newsletter\|footer" --passWithNoTests` | Wave 0 |
| HOME-01 | `FloatingIconsHeroDemo` renders API content, falls back on failure | unit | `cd frontend && npx jest --testPathPattern="hero" --passWithNoTests` | Wave 0 |
| CONT-01–04 | `/admin/site-content` tabs render correct form fields | smoke | manual — admin page (auth-gated) | manual-only |

### Sampling Rate

- **Per task commit:** `cd frontend && npx jest --passWithNoTests`
- **Per wave merge:** `cd frontend && npx jest --passWithNoTests`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `frontend/src/components/ui/__tests__/whatsapp-button.test.tsx` — covers HOME-10
- [ ] `frontend/src/components/blocks/__tests__/testimonials.test.tsx` — covers HOME-08
- [ ] `frontend/src/components/ui/__tests__/footer-section.test.tsx` — covers HOME-09 newsletter form

*(Admin page CONT-01 to CONT-04 cannot be unit tested without mocking auth — treat as manual verification)*

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Hardcoded stats array in `agency-stats.tsx` | Fetch from `api/site_content.php?section=stats` | Stats become editable from admin |
| Hardcoded testimonials array in `testimonials.tsx` | Fetch from `api/testimonials.php` | Real testimonials from DB |
| Hardcoded hero text in `FloatingIconsHeroDemo` | Fetch from `api/site_content.php?section=hero` | Heading/CTA editable from admin |
| No newsletter subscribe endpoint | `api/newsletter.php` with `action=subscribe` | Lead capture from footer |
| No WhatsApp button | `WhatsAppButton` client component in root layout | WhatsApp contact on every page |
| No `site_content` DB table | New table with JSON column per section | CMS storage for page sections |

---

## Open Questions

1. **`logos.php` response shape bug**
   - What we know: `logos.php` returns `json_resp('success', ["enabled" => ..., "logos" => ...])`. The `logo-marquee.tsx` reads `json.data` (= `{ enabled, logos }`) and `json.enabled` (= `undefined`). The `isVisible` would always remain at its `useState(true)` default since `json.enabled` is undefined. The `setLogos(json.data)` would set logos to the whole object, not the logos array.
   - What's unclear: Does this bug manifest in production or does the PHP actually format the response differently than I can read from static analysis? The admin logos page reads `data.data` which would be correct.
   - Recommendation: The planner should include a task to audit and fix `logos.php` GET response and `logo-marquee.tsx` consumer alignment. The fix is `setLogos(json.data.logos)` and `setIsVisible(json.data.enabled ?? true)` in the marquee component. Since D-17 says "no code changes to logo marquee needed," this bug fix might be out of scope — but document it for visibility.

2. **`footer-section.tsx` is not `"use client"`**
   - What we know: `footer-section.tsx` uses `framer-motion` (which works in server components with limited features) but the newsletter form needs `useState` and `useEffect` — requiring `"use client"`.
   - What's unclear: Whether converting the footer to `"use client"` impacts any parent layout.
   - Recommendation: Add `"use client"` to `footer-section.tsx` and add `useState` for the newsletter form. The footer is only used in page-level components that are already client-side.

3. **`settings.php` response shape for empty value**
   - What we know: `settings` table has `key` and `value` columns. When `whatsapp_number` is seeded as empty string, `GET ?key=whatsapp_number` should return the row.
   - Recommendation: Return `{ status: "success", data: { key: "whatsapp_number", value: "" } }` even for empty values, and let the `WhatsAppButton` component hide itself when value is empty after digit-stripping.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)

All findings are based on reading the actual source files in this repo. No external sources were needed because all patterns, types, and constraints are defined entirely within the project itself.

- `frontend/src/components/blocks/logo-marquee.tsx` — canonical homepage fetch pattern
- `frontend/src/app/admin/logos/page.tsx` — canonical admin page pattern
- `backend/api/logos.php` — canonical PHP endpoint pattern
- `backend/common.php` — `json_resp()`, `send_json_headers()`, `get_input()` signatures
- `backend/init_db.php` — DB table creation pattern, seed insert pattern
- `frontend/src/components/blocks/floating-icons-hero-demo.tsx` — all 22 icon SVGs, 6 slot config, Navbar CTA location
- `frontend/src/components/blocks/agency-stats.tsx` — hardcoded stats shape to match in JSON schema
- `frontend/src/components/blocks/testimonials.tsx` — no `"use client"` directive, hardcoded array shape
- `frontend/src/components/admin/admin-layout.tsx` — sidebarItems array, Globe icon already imported
- `frontend/src/app/layout.tsx` — Server Component, `WhatsAppButton` mount location
- `frontend/src/lib/utils.ts` — `safeFetch()` exact signature and behavior
- `frontend/src/lib/api.ts` — `api.get()` / `api.post()` exact URL construction
- `frontend/src/lib/constants.ts` — `API_BASE_URL` fallback value
- `frontend/src/components/ui/footer-section.tsx` — current footer structure (no newsletter form)
- `frontend/src/components/blocks/services.tsx` — all 11 service hrefs verified present (none are `"#"`)
- `frontend/src/components/blocks/context-problem.tsx` — subtitle text verified at ~2 lines

### Secondary (MEDIUM confidence)

- WhatsApp `wa.me` URL format (digits-only requirement) — well-documented public API behavior, HIGH confidence

---

## Project Constraints (from CLAUDE.md)

These directives apply to all tasks in this phase:

- **Static export:** No SSR at runtime. All dynamic content must be fetched client-side. Use `"use client"` + `useEffect` pattern — no `getServerSideProps`, no server actions.
- **No framework for PHP:** Follow existing action-based POST routing (`$input['action']`). No Laravel, Slim, or other PHP frameworks.
- **`images: { unoptimized: true }`** already set — use `<img>` for dynamically loaded logos/testimonial images (not `next/image` with optimization).
- **`safeFetch()` for all public API calls:** Homepage blocks use `safeFetch()`. Admin pages use `api.get()` / `api.post()`.
- **Hardcoded fallback required:** Every homepage block that fetches from API must fall back to hardcoded demo data if `status !== "success"`.
- **TypeScript strict mode:** All new `.tsx` files must compile without `any` (or use explicit `// eslint-disable` if unavoidable with third-party patterns).
- **Named exports for shared components:** `WhatsAppButton` should be a named export (`export function WhatsAppButton`). Admin page is a default export (Next.js page convention).
- **Absolute imports via `@/*`:** `import { safeFetch } from "@/lib/utils"` — not relative paths.
- **No staging environment:** All changes go directly to production via GitHub Actions SFTP on push to `master`. Test locally before committing.
- **`init_db.php` must stay accessible** (server migration in progress) — do not add IP restrictions or authentication to it.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified present in `package.json` via CLAUDE.md and direct file inspection
- Architecture patterns: HIGH — copied directly from existing working production code
- Pitfalls: HIGH — found via direct static analysis of the codebase (not assumptions)
- Data schemas: HIGH — derived from existing DB table definitions in `init_db.php` and hardcoded component data shapes

**Research date:** 2026-05-14
**Valid until:** 2026-06-14 (stable project — patterns won't change unless Phase 1 retroactively edits these files)
