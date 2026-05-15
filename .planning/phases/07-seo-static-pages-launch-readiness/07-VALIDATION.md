---
phase: 7
slug: seo-static-pages-launch-readiness
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 29.x |
| **Config file** | frontend/jest.config.js |
| **Quick run command** | `npm test -- --testPathPattern="seo\|sitemap\|static"` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --passWithNoTests`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | STATIC-01..05 | visual/manual | n/a — page redesigns | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | SEO-01 | build | `npm run build && grep -r 'og:title' out/` | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 1 | SEO-02/03 | file | `ls out/sitemap.xml out/robots.txt` | ❌ W0 | ⬜ pending |
| 07-02-03 | 02 | 1 | SEO-04 | build | `npm run build && grep -r 'application/ld+json' out/` | ❌ W0 | ⬜ pending |
| 07-03-01 | 03 | 2 | SEO-05 | manual | Calendly popup opens on CTA click | ❌ W0 | ⬜ pending |
| 07-03-02 | 03 | 2 | SEO-06 | manual | Page speed audit passes | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing Jest infrastructure covers automated checks (file existence, grep checks)
- Static page redesigns and Calendly require manual verification
- Build-output grep checks run post `npm run build` (not unit tests)

*Existing infrastructure covers all automated phase requirements. Manual verifications documented below.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Static pages match design system | STATIC-01..05 | Visual/content review | Load each page, confirm layout matches site design |
| SEO changes appear in page source | SEO-01 | Requires deploy + view-source | After deploy, view-source on a page with custom SEO meta |
| Calendly popup opens | SEO-05 | Requires live Calendly URL configured | Click "Book a call" CTA, verify popup opens |
| Page speed passes | SEO-06 | Requires live site + Lighthouse | Run Lighthouse on deployed site, confirm no critical issues |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
