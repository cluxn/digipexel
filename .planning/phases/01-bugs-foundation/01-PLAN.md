---
phase: 01-bugs-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/next.config.ts
  - backend/.htaccess
  - frontend/src/components/admin/admin-layout.tsx
  - frontend/src/app/admin/page.tsx
  - frontend/src/lib/constants.ts
  - frontend/src/components/ui/footer-section.tsx
autonomous: true
requirements:
  - BUG-01
  - BUG-02
  - BUG-03
  - BUG-04
  - BUG-05
  - BUG-06
  - BUG-07
  - BUG-08

must_haves:
  truths:
    - "All next/image components render without console errors on static export"
    - "Admin sidebar contains exactly 11 items — no Approval Queue entry"
    - "Newsletter, Banners, and Settings sidebar items link to real routes, not #"
    - "Admin sidebar nav element scrolls when content overflows"
    - "Admin dashboard shows no horizontal pill tab navigation block"
    - "No files exist at frontend/src/app/admin/approvals/ or frontend/src/app/admin/waitlist/"
    - "All sidebar item names match the renamed vocabulary (PARTNER LOGOS, CASE STUDIES, etc.)"
    - "Backend .htaccess redirects HTTP requests to HTTPS with 301"
    - "Social link icons in footer are visible but carry no href and use pointer-events-none"
  artifacts:
    - path: "frontend/next.config.ts"
      provides: "Static export config with unoptimized images"
      contains: "unoptimized: true"
    - path: "backend/.htaccess"
      provides: "HTTPS enforcement before all other rewrite rules"
      contains: "RewriteCond %{HTTPS} off"
    - path: "frontend/src/components/admin/admin-layout.tsx"
      provides: "Corrected sidebar: renamed items, fixed hrefs, removed Approval Queue, scrollable nav"
      contains: "overflow-y-auto"
    - path: "frontend/src/app/admin/page.tsx"
      provides: "Dashboard without horizontal category pill tabs"
    - path: "frontend/src/lib/constants.ts"
      provides: "SOCIAL_LINKS with no href property"
    - path: "frontend/src/components/ui/footer-section.tsx"
      provides: "Social icons rendered as non-clickable spans"
  key_links:
    - from: "frontend/next.config.ts"
      to: "all pages using next/image"
      via: "unoptimized: true flag"
      pattern: "unoptimized:\\s*true"
    - from: "backend/.htaccess"
      to: "all backend API requests"
      via: "mod_rewrite HTTPS rule before existing rules"
      pattern: "RewriteCond %\\{HTTPS\\} off"
    - from: "frontend/src/components/admin/admin-layout.tsx"
      to: "/admin/newsletter, /admin/banners, /admin/settings"
      via: "sidebarItems href values"
      pattern: "href.*admin/newsletter"
---

<objective>
Eliminate all 8 blocking bugs identified in Phase 1 context — image rendering failures, admin double menu, broken sidebar links, sidebar scrolling, junk sidebar items, misnamed sidebar items, missing HTTPS enforcement, and public placeholder links.

Purpose: Clean foundation for all subsequent phases. Every change is corrective — no new features.
Output: Modified config files, admin layout, admin dashboard, constants, footer, and .htaccess. Two stub page directories deleted.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/01-bugs-foundation/01-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Config and infrastructure fixes (BUG-01, BUG-07)</name>
  <files>frontend/next.config.ts, backend/.htaccess</files>

  <read_first>
    - frontend/next.config.ts — read entire file before editing; must preserve existing remotePatterns and output/trailingSlash
    - backend/.htaccess — read entire file before editing; HTTPS rule must go INSIDE the existing IfModule block, BEFORE the existing RewriteRule
  </read_first>

  <action>
**frontend/next.config.ts — add `unoptimized: true` (D-01, BUG-01)**

The current `images` object contains only `remotePatterns`. Add `unoptimized: true` as the first key inside that object. Final result:

```ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  output: 'export',
  trailingSlash: true,
};
```

Do NOT change output, trailingSlash, or remotePatterns.

---

**backend/.htaccess — prepend HTTPS redirect rule (D-09, BUG-07)**

The current file has one `<IfModule mod_rewrite.c>` block containing `RewriteEngine On` followed by file/dir conditions. Insert the HTTPS redirect AFTER `RewriteEngine On` and BEFORE the existing `RewriteCond %{REQUEST_FILENAME} !-f` lines. The Authorization header rule at the bottom stays unchanged.

Final file content:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>

# Handle Authorization header for API requests
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
```
  </action>

  <verify>
    <automated>
      node -e "const fs=require('fs'); const c=fs.readFileSync('frontend/next.config.ts','utf8'); if(!c.includes('unoptimized: true')) process.exit(1); console.log('next.config OK');"
      node -e "const fs=require('fs'); const c=fs.readFileSync('backend/.htaccess','utf8'); if(!c.includes('RewriteCond %{HTTPS} off')) process.exit(1); if(c.indexOf('RewriteCond %{HTTPS} off') > c.indexOf('RewriteEngine On') && c.indexOf('RewriteCond %{HTTPS} off') < c.indexOf('REQUEST_FILENAME')) { console.log('.htaccess OK'); } else { process.exit(1); }"
    </automated>
  </verify>

  <acceptance_criteria>
    - `frontend/next.config.ts` contains the exact string `unoptimized: true` inside the `images` object
    - `remotePatterns` array with `images.unsplash.com` and `upload.wikimedia.org` still present
    - `output: 'export'` and `trailingSlash: true` still present
    - `backend/.htaccess` contains `RewriteCond %{HTTPS} off` on a line before `RewriteCond %{REQUEST_FILENAME} !-f`
    - `backend/.htaccess` contains `RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`
    - The Authorization header block at end of .htaccess is unchanged
  </acceptance_criteria>

  <done>Static export images will no longer throw optimization errors. HTTP requests to the backend will 301-redirect to HTTPS.</done>
</task>

<task type="auto">
  <name>Task 2: Admin layout — sidebar overhaul (BUG-03, BUG-04, BUG-05, BUG-06)</name>
  <files>frontend/src/components/admin/admin-layout.tsx</files>

  <read_first>
    - frontend/src/components/admin/admin-layout.tsx — read entire file; note the sidebarItems array (lines 26-39) and the nav element (line 85) before making any change
  </read_first>

  <action>
Four changes to this single file, applied together:

**1. Replace the entire `sidebarItems` array (D-03, D-05, D-06 partial, D-08, BUG-03, BUG-05, BUG-06)**

Remove the existing array and replace it with the corrected version below. Key changes from the original:
- APPROVAL QUEUE entry deleted entirely (D-05)
- NEWSLETTER: href `#` → `/admin/newsletter`, status `Upcoming` → `Active` (D-03)
- MARKETING BANNERS: href `#` → `/admin/banners`, status `Upcoming` → `Active`, name → `BANNERS` (D-03 + D-08)
- SETTINGS: href `#` → `/admin/settings`, status `Upcoming` → `Active` (D-03)
- Renames per D-08 (all other items):

```ts
const sidebarItems = [
  { name: "DASHBOARD",     icon: LayoutDashboard, href: "/admin",             status: "Active" },
  { name: "PARTNER LOGOS", icon: ImageIcon,        href: "/admin/logos",       status: "Active" },
  { name: "CASE STUDIES",  icon: Briefcase,        href: "/admin/case-studies",status: "Active" },
  { name: "BLOG POSTS",    icon: FileText,          href: "/admin/blog",        status: "Active" },
  { name: "GUIDES",        icon: BookOpen,          href: "/admin/guides",      status: "Active" },
  { name: "TESTIMONIALS",  icon: MessageSquare,     href: "/admin/testimonials",status: "Active" },
  { name: "LEADS",         icon: Users,             href: "/admin/leads",       status: "Active" },
  { name: "NEWSLETTER",    icon: Mail,              href: "/admin/newsletter",  status: "Active" },
  { name: "POPUPS",        icon: Sparkles,          href: "/admin/nudges",      status: "Active" },
  { name: "BANNERS",       icon: Layers,            href: "/admin/banners",     status: "Active" },
  { name: "SETTINGS",      icon: Settings,          href: "/admin/settings",    status: "Active" },
];
```

**2. Remove the `Clock` import (D-05)**

`Clock` was used only by APPROVAL QUEUE. Remove it from the lucide-react import line. The remaining imports to keep: `LayoutDashboard`, `Image as ImageIcon`, `Workflow`, `MessageSquare`, `Users`, `Globe`, `LogOut`, `Sparkles`, `Loader2`, `BookOpen`, `FileText`, `Briefcase`, `Mail`, `Layers`, `Settings`.

Note: `Workflow` is imported but not used in sidebarItems — leave it as-is to avoid unintended breakage.

**3. Add `overflow-y-auto` to sidebar nav element (D-04, BUG-04)**

Find the `<nav>` element at line 85:
```tsx
<nav className="flex-1 px-4 space-y-1">
```
Change to:
```tsx
<nav className="flex-1 px-4 space-y-1 overflow-y-auto">
```
  </action>

  <verify>
    <automated>
      node -e "const fs=require('fs'); const c=fs.readFileSync('frontend/src/components/admin/admin-layout.tsx','utf8'); const checks = ['PARTNER LOGOS','CASE STUDIES','BLOG POSTS','GUIDES','POPUPS','BANNERS','overflow-y-auto','/admin/newsletter','/admin/banners','/admin/settings']; const missing = checks.filter(s=>!c.includes(s)); const forbidden = ['APPROVAL QUEUE','LOGO MARQUEE','PRODUCT REGISTRY','BLOG HUB','INSIGHTS & GUIDES','CLIENT LEADS','NUDGES & POPUPS','MARKETING BANNERS']; const found = forbidden.filter(s=>c.includes(s)); if(missing.length||found.length){console.error('MISSING:',missing,'STILL PRESENT:',found);process.exit(1);}console.log('admin-layout OK');"
    </automated>
  </verify>

  <acceptance_criteria>
    - `sidebarItems` array contains exactly 11 entries (DASHBOARD through SETTINGS)
    - No entry with `name: "APPROVAL QUEUE"` exists anywhere in the file
    - `Clock` is not imported from lucide-react
    - Entry for NEWSLETTER has `href: '/admin/newsletter'` and `status: 'Active'`
    - Entry for BANNERS has `href: '/admin/banners'` and `status: 'Active'`
    - Entry for SETTINGS has `href: '/admin/settings'` and `status: 'Active'`
    - Names present: "PARTNER LOGOS", "CASE STUDIES", "BLOG POSTS", "GUIDES", "LEADS", "POPUPS", "BANNERS"
    - Names absent: "LOGO MARQUEE", "PRODUCT REGISTRY", "BLOG HUB", "INSIGHTS & GUIDES", "CLIENT LEADS", "NUDGES & POPUPS", "MARKETING BANNERS"
    - `<nav` element's className includes `overflow-y-auto`
    - No `status: "Upcoming"` entries remain in sidebarItems (all Active)
  </acceptance_criteria>

  <done>Admin sidebar shows 11 correctly named items, all with working hrefs, no Approval Queue, scrollable when content overflows.</done>
</task>

<task type="auto">
  <name>Task 3: Admin dashboard cleanup + delete stub pages (BUG-02, BUG-05 partial)</name>
  <files>
    frontend/src/app/admin/page.tsx,
    frontend/src/app/admin/approvals/page.tsx (DELETE),
    frontend/src/app/admin/waitlist/page.tsx (DELETE)
  </files>

  <read_first>
    - frontend/src/app/admin/page.tsx — read entire file; identify dashboardCategories array (lines 26-36) and the "Category Navigation" JSX block (lines 72-90) to remove
  </read_first>

  <action>
**1. Remove `dashboardCategories` array and its JSX block from `admin/page.tsx` (D-02, BUG-02)**

Delete the `dashboardCategories` constant (lines 26-36 — the entire array literal including the closing `];`).

Delete the "Category Navigation" JSX block — this is the `{/* Category Navigation */}` comment and the entire `<div className="bg-white border border-slate-100 rounded-[2rem] p-3...">` element that maps over `dashboardCategories` (lines 72-90).

After removal, also remove any now-unused icon imports. `dashboardCategories` used no icons directly, but check the existing import list against what remains in the file. The icons used by the `stats` array are: `Clock`, `Briefcase`, `MessageSquare`, `Sparkles`, `Layers`, `Users`, `FileText`. The icons used in other JSX are: `ArrowRight`, `Eye`, `Trash2`, `Mail`, `Settings`, `Bell`, `CheckCircle2`, `TrendingUp`. Remove only icons that are no longer referenced ANYWHERE in the file after the category block is deleted. Do NOT remove icons that are still used elsewhere.

Keep unchanged: header section, stats grid, Captured Leads panel, Nudge Campaigns panel.

**2. Delete stub page files and their directories (D-06, BUG-05)**

Delete these files:
- `frontend/src/app/admin/approvals/page.tsx`
- `frontend/src/app/admin/waitlist/page.tsx`

After deleting the files, also delete the parent directories if they are empty:
- `frontend/src/app/admin/approvals/` (if empty after deletion)
- `frontend/src/app/admin/waitlist/` (if empty after deletion)

Use the filesystem tools to delete. Do NOT delete any other files.
  </action>

  <verify>
    <automated>
      node -e "const fs=require('fs'); const c=fs.readFileSync('frontend/src/app/admin/page.tsx','utf8'); if(c.includes('dashboardCategories'))process.exit(1); if(c.includes('Category Navigation'))process.exit(1); if(fs.existsSync('frontend/src/app/admin/approvals'))process.exit(1); if(fs.existsSync('frontend/src/app/admin/waitlist'))process.exit(1); console.log('dashboard + deletions OK');"
    </automated>
  </verify>

  <acceptance_criteria>
    - `frontend/src/app/admin/page.tsx` does NOT contain the string `dashboardCategories`
    - `frontend/src/app/admin/page.tsx` does NOT contain `Category Navigation` comment
    - `frontend/src/app/admin/page.tsx` does NOT contain the `bg-white border border-slate-100 rounded-[2rem] p-3` div
    - `stats` array still present in admin/page.tsx (stats grid must be kept)
    - `Captured Leads` section JSX still present in admin/page.tsx
    - `Nudge Campaigns` section JSX still present in admin/page.tsx
    - Directory `frontend/src/app/admin/approvals/` does not exist
    - Directory `frontend/src/app/admin/waitlist/` does not exist
    - `frontend/src/app/admin/banners/`, `newsletter/`, `settings/` directories are untouched
  </acceptance_criteria>

  <done>Admin dashboard has one navigation (sidebar only). Approval Queue and Waitlist stub pages are gone from the codebase.</done>
</task>

<task type="auto">
  <name>Task 4: Fix public # placeholder social links (BUG-08)</name>
  <files>frontend/src/lib/constants.ts, frontend/src/components/ui/footer-section.tsx</files>

  <read_first>
    - frontend/src/lib/constants.ts — read entire file; note SOCIAL_LINKS type and current href values (lines 43-48)
    - frontend/src/components/ui/footer-section.tsx — read entire file; note socialLinks array (lines 41-83) and where icons are rendered as `<a href={social.href}>` (line 111-119)
  </read_first>

  <action>
**1. Update SOCIAL_LINKS type and values in `constants.ts` (D-10, BUG-08)**

Change the `SOCIAL_LINKS` export so `href` is `string | undefined` and all four entries have no href value:

```ts
export const SOCIAL_LINKS: Array<{ label: string; href?: string }> = [
  { label: 'Facebook' },
  { label: 'Instagram' },
  { label: 'YouTube' },
  { label: 'LinkedIn' },
];
```

Remove the `href: '#'` values. The type annotation `Array<{ label: string; href?: string }>` makes href optional so TypeScript strict mode does not error.

---

**2. Update social icon rendering in `footer-section.tsx` (D-10, BUG-08)**

The `socialLinks` array in this file is its own hardcoded copy (independent of constants.ts). Change the `href` property in all four entries from `'#'` to `undefined`:

```ts
const socialLinks = [
  { label: 'Facebook',  href: undefined, svg: (...) },
  { label: 'Instagram', href: undefined, svg: (...) },
  { label: 'YouTube',   href: undefined, svg: (...) },
  { label: 'LinkedIn',  href: undefined, svg: (...) },
];
```

Then change the rendering from an `<a>` anchor to a `<span>` element for all social icons. This is the cleanest approach — no href, no pointer, no navigation:

Replace the current anchor:
```tsx
<a
  key={social.label}
  href={social.href}
  aria-label={social.label}
  className="w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all duration-300"
>
  {social.svg}
</a>
```

With a span — keep all visual classes but remove hover color change since the icon is non-functional. Add `title="Coming soon"` so users understand on hover:
```tsx
<span
  key={social.label}
  aria-label={social.label}
  title="Coming soon"
  className="w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 cursor-default transition-all duration-300"
>
  {social.svg}
</span>
```

The `href` property can be removed from the socialLinks array entries entirely since it is no longer consumed. Do NOT remove the `svg` property — icons must remain visible.
  </action>

  <verify>
    <automated>
      node -e "const fs=require('fs'); const ct=fs.readFileSync('frontend/src/lib/constants.ts','utf8'); if(ct.includes(\"href: '#'\"))process.exit(1); const ft=fs.readFileSync('frontend/src/components/ui/footer-section.tsx','utf8'); if(ft.includes(\"href: '#'\"))process.exit(1); if(!ft.includes('cursor-default'))process.exit(1); if(!ft.includes('Coming soon'))process.exit(1); console.log('social links OK');"
    </automated>
  </verify>

  <acceptance_criteria>
    - `frontend/src/lib/constants.ts` SOCIAL_LINKS has no `href: '#'` values
    - `frontend/src/lib/constants.ts` SOCIAL_LINKS type allows optional `href` (contains `href?:` or `href?: string`)
    - `frontend/src/components/ui/footer-section.tsx` social icon elements are `<span>` not `<a>`
    - `frontend/src/components/ui/footer-section.tsx` contains `cursor-default` on social icon elements
    - `frontend/src/components/ui/footer-section.tsx` contains `title="Coming soon"` on social icon elements
    - SVG content for all 4 social icons is still present in footer-section.tsx (icons are visible)
    - `frontend/src/components/ui/footer-section.tsx` does NOT contain `href: '#'` anywhere
  </acceptance_criteria>

  <done>Social media icons are visible in the footer but non-clickable, with a "Coming soon" tooltip. No # placeholder hrefs remain on the public site.</done>
</task>

</tasks>

<verification>
After all 4 tasks complete, verify the full phase:

1. Build check — confirms no TypeScript or import errors introduced:
   ```
   cd frontend && npm run build 2>&1 | tail -20
   ```
   Expected: build succeeds, no errors related to unoptimized, Clock, dashboardCategories, or href types.

2. Sidebar item count — must be exactly 11:
   ```
   node -e "const c=require('fs').readFileSync('frontend/src/components/admin/admin-layout.tsx','utf8'); const m=c.match(/name:/g); console.log('sidebarItems name count:', m ? m.length-1 : 0);"
   ```
   Expected: 11 (one `name:` in the component function name doesn't count — adjust grep if needed).

3. Deleted paths do not exist:
   ```
   node -e "const fs=require('fs'); ['frontend/src/app/admin/approvals','frontend/src/app/admin/waitlist'].forEach(p=>{if(fs.existsSync(p)){console.error('STILL EXISTS:',p);process.exit(1);}});console.log('Deleted paths confirmed gone');"
   ```

4. No remaining # hrefs in public-facing files:
   ```
   node -e "const fs=require('fs'); const files=['frontend/src/lib/constants.ts','frontend/src/components/ui/footer-section.tsx']; files.forEach(f=>{const c=fs.readFileSync(f,'utf8'); if(c.includes(\"href: '#'\")){console.error(f+' still has # href');process.exit(1);}});console.log('No # hrefs remaining');"
   ```
</verification>

<success_criteria>
- `next build` completes without errors
- `frontend/next.config.ts` contains `unoptimized: true`
- `backend/.htaccess` contains HTTPS redirect before existing rewrite rules
- Admin sidebar has 11 items, all with real hrefs, correct names, no Approval Queue
- Admin sidebar nav has `overflow-y-auto`
- Admin dashboard has no `dashboardCategories` array or pill tab JSX
- `frontend/src/app/admin/approvals/` and `frontend/src/app/admin/waitlist/` do not exist
- Social icon elements in footer are `<span>` with `cursor-default`, no `href="#"`
- `SOCIAL_LINKS` in constants.ts has no `href: '#'` values
</success_criteria>

<output>
After completion, create `.planning/phases/01-bugs-foundation/01-01-SUMMARY.md` with:
- What was changed (list each file and the change made)
- Decisions honored (D-01 through D-12)
- Verification results (build output, check outputs)
- Any deviations from plan and why
</output>
