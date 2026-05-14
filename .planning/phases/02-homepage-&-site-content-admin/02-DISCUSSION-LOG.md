# Phase 2: Homepage & Site Content Admin - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 02-homepage-&-site-content-admin
**Areas discussed:** Navbar editability scope (user selected); Site content admin structure, WhatsApp/Settings bootstrap, Floating icons (orchestrator decided from project context)

---

## Navbar Editability Scope

| Option | Description | Selected |
|--------|-------------|----------|
| CTA button only | Only the 'Book a Call' button text and link is admin-editable. Nav dropdowns stay hardcoded. | ✓ |
| Top-level items + CTA | Admin can edit top-level nav item labels and hrefs plus CTA. Dropdown contents hardcoded. | |
| Full control | Admin manages all nav links including dropdown contents, categories, and items. | |

**User's choice:** CTA button only (Recommended)
**Notes:** Navbar has complex 4-category Services dropdown + Work + Insights. Full editability would be significant scope. CTA-only is fastest to build and lowest risk.

---

## Site Content Admin Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single tabbed page | One /admin/site-content page with Hero/Navbar/Stats/Footer tabs | ✓ (orchestrator) |
| 4 separate admin pages | /admin/site-content/hero, /admin/site-content/navbar, etc. | |

**Orchestrator's choice:** Single tabbed page — cleaner UX, one sidebar item.

---

## WhatsApp Button & Settings Bootstrap

| Option | Description | Selected |
|--------|-------------|----------|
| Bootstrap minimal settings endpoint | Create api/settings.php + settings table in Phase 2 for WhatsApp number. Phase 6 extends. | ✓ (orchestrator) |
| Hardcode placeholder number | Add button with hardcoded number, Phase 6 makes it editable. | |

**Orchestrator's choice:** Bootstrap minimal settings — cleaner than a hardcoded value, Phase 6 extension is natural.

---

## Floating Icons Admin Control

| Option | Description | Selected |
|--------|-------------|----------|
| Preset icon registry | 6 fixed slots, admin picks from ~20 supported icons per slot. Icons stay as SVG components. | ✓ (orchestrator) |
| Image URL input | Admin provides image URL per slot. More flexible but complex. | |
| Keep hardcoded | Only hero text/CTA editable, icons stay fixed. | |

**Orchestrator's choice:** Preset icon registry — maintains design intent, admin-manageable without URL input.

---

## Claude's Discretion

- Exact JSON schema for site_content content blobs
- Admin UI layout within each tab (form fields, save button, loading/error states)
- Newsletter form visual design in footer
- WhatsApp button hover animation and exact positioning
- Whether new DB tables go in init_db.php or a migration file

## Deferred Ideas

- Full footer link editability — Phase 6 Settings
- Full navbar dropdown admin control — out of scope
- Newsletter subscriber list/export — Phase 6
- Full settings admin page — Phase 6
- Announcement bar / banners — Phase 6
