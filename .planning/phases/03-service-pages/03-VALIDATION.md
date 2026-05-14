---
phase: 03
slug: service-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-14
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.7.0 + @testing-library/react 16.3.2 |
| **Config file** | `frontend/jest.config.ts` (exists) |
| **Setup file** | `frontend/jest.setup.ts` (imports `@testing-library/jest-dom`) |
| **Quick run command** | `cd frontend && npx jest --testPathPattern="service" --passWithNoTests` |
| **Full suite command** | `cd frontend && npx jest` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd frontend && npx jest --testPathPattern="service" --passWithNoTests`
- **After every plan wave:** Run `cd frontend && npx jest`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01 | Wave 0 stub | 0 | SVC-01..08 | unit | `npx jest --testPathPattern="service-page" --passWithNoTests` | ❌ W0 | ⬜ pending |
| 03-02 | Backend endpoint | 1 | SVC-03 | unit | `npx jest --testPathPattern="service-page" --passWithNoTests` | ❌ W0 | ⬜ pending |
| 03-03 | DB table + seed | 1 | SVC-03 | unit | `npx jest --testPathPattern="service-page" --passWithNoTests` | ❌ W0 | ⬜ pending |
| 03-04 | Service page fetch | 1 | SVC-01,02,03,04,05,06,07,08 | unit | `npx jest --testPathPattern="service-page"` | ❌ W0 | ⬜ pending |
| 03-05 | Admin services page | 2 | SVC-03 | unit (smoke) | `npx jest --testPathPattern="service"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/app/services/__tests__/service-page.test.tsx` — stubs for SVC-01 through SVC-08 (mock `safeFetch`, assert eyebrow badges, button hrefs, API data rendering, roadmap steps, CTA content, testimonials)
- [ ] Uses existing `frontend/jest.setup.ts` + `frontend/jest.config.ts` — no new framework install needed

*Single test file covers all 8 requirements (researcher finding: all map to service-page.test.tsx).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin service editor saves + reloads per-service content | SVC-03 | Requires live PHP backend + MySQL | Open /admin/services, select ai-seo, change Hero badge, save, reload service page |
| All 11 service pages visually consistent with benai.co reference | SVC-08 | Visual layout comparison | Visit each service page, check eyebrow → heading → 2-line para structure matches reference |
| Roadmap steps display custom 2-line descriptions per service | SVC-04 | Requires seeded DB | Check roadmap section on 3 different service pages after seeding |
| Market impact numbers distinct per service | SVC-05 | Visual check across services | Compare Market Impact section on ai-seo vs custom-ai-solutions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
