---
phase: 02
slug: homepage-site-content-admin
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-14
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.7.0 + jest-environment-jsdom + @testing-library/react 16.3.2 |
| **Config file** | `frontend/jest.config.js` (or `jest.config.ts` — verify at task time) |
| **Quick run command** | `cd frontend && npx jest --testPathPattern="site-content\|whatsapp\|newsletter\|testimonials\|hero\|footer" --passWithNoTests` |
| **Full suite command** | `cd frontend && npx jest --passWithNoTests` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd frontend && npx jest --passWithNoTests`
- **After every plan wave:** Run `cd frontend && npx jest --passWithNoTests`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | HOME-10 | unit | `cd frontend && npx jest --testPathPattern="whatsapp" --passWithNoTests` | Wave 0 | ⬜ pending |
| 02-01-02 | 01 | 1 | HOME-09 | unit | `cd frontend && npx jest --testPathPattern="footer" --passWithNoTests` | Wave 0 | ⬜ pending |
| 02-01-03 | 01 | 1 | HOME-08 | unit | `cd frontend && npx jest --testPathPattern="testimonials" --passWithNoTests` | Wave 0 | ⬜ pending |
| 02-01-04 | 01 | 1 | HOME-01 | unit | `cd frontend && npx jest --testPathPattern="hero" --passWithNoTests` | Wave 0 | ⬜ pending |
| 02-02-01 | 02 | 1 | CONT-01–04 | manual | Admin page at `/admin/site-content` — auth-gated, cannot unit test | manual-only | ⬜ pending |
| 02-03-01 | 03 | 2 | HOME-04 | manual | Logo marquee visual check after DB seed | manual-only | ⬜ pending |
| 02-03-02 | 03 | 2 | HOME-05–07 | lint | `cd frontend && npx tsc --noEmit` | existing | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `frontend/src/components/ui/__tests__/whatsapp-button.test.tsx` — stubs for HOME-10 (hidden when empty, visible when set)
- [ ] `frontend/src/components/blocks/__tests__/testimonials.test.tsx` — stubs for HOME-08 (fetch from API, render first 9)
- [ ] `frontend/src/components/ui/__tests__/footer-section.test.tsx` — stubs for HOME-09 (newsletter form submit, success/duplicate states)
- [ ] `frontend/src/components/blocks/__tests__/floating-icons-hero-demo.test.tsx` — stubs for HOME-01 (renders API content, falls back on failure)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/admin/site-content` tabs render correct form fields | CONT-01, CONT-02, CONT-03, CONT-04 | Auth-gated admin page; mocking `localStorage` auth for tests is fragile | Log in as admin, navigate to `/admin/site-content`, verify 4 tabs (Hero, Navbar, Stats, Footer) each show correct input fields |
| Logo marquee shows updated partner logos | HOME-04 | Visual component — correct logos require DB seed data seeded via admin UI | Visit homepage, verify marquee shows updated logos including OpenAI, Anthropic, n8n, Zapier, etc. |
| WhatsApp button opens correct chat URL | HOME-10 | Browser navigation to external URL | Set a WhatsApp number in admin settings, visit homepage, click WhatsApp button, verify it opens `https://wa.me/{number}` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
