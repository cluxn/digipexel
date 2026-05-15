# Quick Task 260515-akk — Summary

**Task:** wire admin dashboard stats and actions to live API data
**Date:** 2026-05-15
**Commit:** 09b5a30
**Status:** Complete

## What Changed

`frontend/src/app/admin/page.tsx` — full rewrite from static to live-data client component.

**Stats (7 real values from API):**
- New Leads → leads with status="new"
- Case Studies → case_studies count
- Web Inquiries → total leads count
- Active Nudges → enabled nudge configs from localStorage
- Active Banners → banner.enabled from localStorage
- Blog Posts → blogs?admin=1 count
- Guides → guides count

**Captured Leads:** Fetches real leads via `api.get("leads")`, shows most recent 5 with name/email/date/status badge. Loading and empty states included.

**Nudge Campaigns:** Reads `DP_NUDGES_CONFIG` from localStorage. Shows 3 real types (Banner, Popup, Exit Popup). Settings → `/admin/nudges`. Disable button sets `enabled:false` in localStorage and re-renders.

**Notifications button:** Links to `/admin/leads`, shows "N New" count when new leads exist.

**View Analytics button:** Links to `/admin/leads`.
