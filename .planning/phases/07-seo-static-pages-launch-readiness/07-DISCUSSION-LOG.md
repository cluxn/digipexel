# Phase 7: SEO, Static Pages & Launch Readiness — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-16
**Phase:** 07-seo-static-pages-launch-readiness
**Areas discussed:** Calendly CTA scope, Static page tone/content, OG image input method

---

## Calendly CTA Scope

| Option | Description | Selected |
|--------|-------------|----------|
| All CTAs site-wide | Every 'Book a call' / 'Book a free audit' button across all pages opens Calendly popup | ✓ |
| Service pages + hero only | Only service pages and homepage hero CTA use Calendly | |
| Only the Connect CTA block | Only the bottom-of-page Connect section button opens Calendly | |

**User's choice:** All CTAs site-wide
**Notes:** Simple rule, consistent UX, maximum lead capture. Fallback to `default_cta_link` when `calendly_url` is empty.

---

## Static Page Tone / Content

| Option | Description | Selected |
|--------|-------------|----------|
| Keep quirky brand voice | 404 + thank-you use creative copy; Privacy Policy and T&C get professional legal content | ✓ |
| Go fully professional | All static pages shift to straightforward professional copy | |
| Claude decides copy tone | Claude picks appropriate tone per page | |

**User's choice:** Keep quirky brand voice
**Notes:** Existing thank-you "Transmission Success" tone is approved. 404 can be similarly creative. Legal pages (Privacy Policy, T&C) stay professional and expanded for a digital marketing automation agency.

---

## OG Image Input Method

| Option | Description | Selected |
|--------|-------------|----------|
| URL text field | Admin pastes image URL — no upload endpoint needed | ✓ |
| File upload | Admin uploads image file directly — requires new PHP upload endpoint | |

**User's choice:** URL text field
**Notes:** Simpler implementation, works with static export constraint. Admin can use Cloudinary, their site images, or any hosted URL.

---

## Claude's Discretion

- Schema markup depth per service page
- Exact copy for 404 and thank-you redesigns (quirky brand voice direction confirmed)
- Which slugs appear in admin SEO dropdown vs. manual entry
- Page speed optimizations within code scope

## Deferred Ideas

None raised during discussion.
