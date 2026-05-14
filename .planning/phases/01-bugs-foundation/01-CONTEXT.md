# Phase 1: Bugs & Foundation - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate all blocking bugs and broken navigation so every subsequent phase builds on a clean base. This phase is purely corrective — no new features, no new pages, no new functionality.

</domain>

<decisions>
## Implementation Decisions

### BUG-01: next/image Static Export Fix
- **D-01:** Add `images: { unoptimized: true }` to `next.config.ts`. Keep existing `remotePatterns` config and `output: 'export'` unchanged. This is a one-line fix.

### BUG-02: Admin Dashboard Double Menu
- **D-02:** Remove the horizontal pill tab navigation (`dashboardCategories` array + the pill tab JSX block) from `frontend/src/app/admin/page.tsx`. Keep the sidebar in `admin-layout.tsx` as the sole navigation. The dashboard content (stats grid, captured leads panel, nudge campaigns panel) stays unchanged.

### BUG-03: Admin Sidebar Broken Links
- **D-03:** Update `sidebarItems` in `admin-layout.tsx`:
  - Newsletter: `href: '#'` → `href: '/admin/newsletter'`
  - Marketing Banners: `href: '#'` → `href: '/admin/banners'`
  - Settings: `href: '#'` → `href: '/admin/settings'`
  - (Users and Analytics don't exist in sidebar yet — added in Phase 6)

### BUG-04: Sidebar Scrollbar
- **D-04:** Add `overflow-y-auto` to the sidebar `<nav>` element in `admin-layout.tsx`. The sidebar is `fixed` with `inset-y-0` so it already has a defined height — overflow-y-auto is sufficient.

### BUG-05: Remove Approval Queue and Waitlist
- **D-05:** Remove "APPROVAL QUEUE" entry from `sidebarItems` array in `admin-layout.tsx`.
- **D-06:** Delete the stub page files: `frontend/src/app/admin/approvals/page.tsx` and `frontend/src/app/admin/waitlist/page.tsx` (and their parent directories if empty).
- **D-07:** Remove Waitlist from the `dashboardCategories` array in `admin/page.tsx` (already being cleaned up in BUG-02, but confirm removal).

### BUG-06: Rename Sidebar Menu Items
- **D-08:** Apply these exact renames to `sidebarItems` in `admin-layout.tsx`:

| Current name | New name |
|---|---|
| DASHBOARD | DASHBOARD |
| LOGO MARQUEE | PARTNER LOGOS |
| PRODUCT REGISTRY | CASE STUDIES |
| BLOG HUB | BLOG POSTS |
| INSIGHTS & GUIDES | GUIDES |
| TESTIMONIALS | TESTIMONIALS |
| CLIENT LEADS | LEADS |
| NEWSLETTER | NEWSLETTER |
| NUDGES & POPUPS | POPUPS |
| MARKETING BANNERS | BANNERS |
| SETTINGS | SETTINGS |

### BUG-07: HTTPS Redirect in .htaccess
- **D-09:** Add HTTPS redirect rule to `backend/.htaccess` — prepend before existing rewrite rules:
  ```
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  ```

### BUG-08: Fix # Placeholder Links
- **D-10:** Social links (Facebook, Instagram, YouTube, LinkedIn) — keep icons **visible but non-clickable**. Remove `href` attribute from anchor tags, or change to `<span>` elements with cursor-default styling. Do NOT hide them. Both locations to update: `frontend/src/lib/constants.ts` (SOCIAL_LINKS array) and `frontend/src/components/ui/footer-section.tsx` (socialLinks array).
- **D-11:** All other `#` placeholder links on the public site — confirmed there are no other `#` links in component files beyond social links. The public nav links in `constants.ts` all point to real routes already.
- **D-12:** Admin sidebar items that were `href: '#'` are handled by D-03 above.

### Claude's Discretion
- Exact CSS approach for non-clickable social icons (remove href vs. span vs. pointer-events-none) — Claude decides what's cleanest.
- Whether to show a `title` tooltip on non-clickable social icons saying "Coming soon" — Claude decides.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to modify
- `frontend/next.config.ts` — add `images: { unoptimized: true }`
- `frontend/src/app/admin/page.tsx` — remove horizontal pill tabs
- `frontend/src/components/admin/admin-layout.tsx` — fix links, rename items, remove items, add scrollbar
- `frontend/src/lib/constants.ts` — social links: remove href
- `frontend/src/components/ui/footer-section.tsx` — social links: remove href
- `backend/.htaccess` — add HTTPS redirect

### Files to delete
- `frontend/src/app/admin/approvals/page.tsx` (and directory)
- `frontend/src/app/admin/waitlist/page.tsx` (and directory)

### Stub pages to keep (don't delete these)
- `frontend/src/app/admin/banners/page.tsx` — stays, gets real link in sidebar
- `frontend/src/app/admin/newsletter/page.tsx` — stays, gets real link in sidebar
- `frontend/src/app/admin/settings/page.tsx` — stays, gets real link in sidebar

### Codebase maps (for context)
- `.planning/codebase/ARCHITECTURE.md` — system overview
- `.planning/codebase/STRUCTURE.md` — file locations

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `admin-layout.tsx` `sidebarItems` array — single source of truth for all sidebar items; all changes go here
- `admin/page.tsx` `dashboardCategories` array — the horizontal pill tabs to remove

### Established Patterns
- Admin sidebar uses `item.status === "Upcoming"` to show "SOON" badge — items being fixed should have `status: "Active"`, removed items just get deleted from array
- `.htaccess` uses `mod_rewrite` with `IfModule` guard — HTTPS redirect must go inside the same `<IfModule mod_rewrite.c>` block before existing rules

### Integration Points
- `next.config.ts` change affects all pages that use `next/image` — test on `/services/[slug]/page.tsx` which was throwing the error
- Social link changes needed in TWO places: `constants.ts` AND `footer-section.tsx` (footer has its own hardcoded copy)

</code_context>

<specifics>
## Specific Ideas

- Social icons: keep visible, non-clickable — user wants them shown as decorative until Phase 6 Settings adds real URLs
- Sidebar naming: exact names from project discussion (all caps, simple vocabulary)
- No new pages or features in this phase — purely corrective

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-bugs-foundation*
*Context gathered: 2026-05-14*
