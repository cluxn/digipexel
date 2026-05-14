# Phase 3: Service Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 03-service-pages
**Areas discussed:** Admin data architecture, Testimonials source

---

## Admin data architecture

| Option | Description | Selected |
|--------|-------------|----------|
| New service_content table | New table: service_content(slug, section, content JSON, PRIMARY KEY(slug, section)). Cleaner, easier to fetch all sections for a service. New PHP endpoint api/service_content.php. | ✓ |
| Extend site_content table | Add rows with keys like 'service-hero:ai-seo'. No new table or endpoint. Simpler but mixes service data with homepage data. | |

**User's choice:** New service_content table (Recommended)
**Notes:** Follows Phase 2's site_content pattern but as a separate table for clean separation between homepage CMS and per-service CMS.

---

## Testimonials source

| Option | Description | Selected |
|--------|-------------|----------|
| Per-service in service_content | Store 2-3 testimonials per service as JSON inside service_content (slug='ai-seo', section='testimonials'). Admin edits in the service editor. Independent from central testimonials table. | ✓ |
| Central testimonials DB with service tag | Add service_slug column to testimonials table. Admin tags testimonials to services. Service page fetches filtered by slug. | |

**User's choice:** Per-service in service_content (Recommended)
**Notes:** Keeps service testimonials editable in one place (the service editor), avoids complicating the central testimonials table schema.

---

## Claude's Discretion

- Editable sections scope: follow requirements exactly (hero, features, roadmap, market impact, CTA, testimonials) — comparison/gap section stays hardcoded
- Admin UX pattern: service dropdown + section tabs at /admin/services — extension of existing site-content tab pattern
- JSON field names within each section's content blob
- Whether to add a second hero CTA button (decided not to — ctaSecondary data exists but is unused in JSX)
- Seed strategy for service_content table (INSERT IGNORE from existing SERVICES hardcoded data)

## Deferred Ideas

None.
