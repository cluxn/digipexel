---
quick_id: 260515-akk
description: wire admin dashboard stats and actions to live API data
date: 2026-05-15
status: ready
---

# Quick Task 260515-akk: Wire Admin Dashboard to Live Data

## Root Cause

`frontend/src/app/admin/page.tsx` is a static component with hardcoded fake numbers (15 blogs, 82 leads, etc.), hardcoded fake lead rows, hardcoded fake nudge campaigns, and dead Notifications/View Analytics buttons.

## Tasks

### Task 1: Rewrite admin/page.tsx as live-data client component

**Changes:**
- Add `useState` + `useEffect` that fetches `api.get("blogs", {admin:"1"})`, `api.get("case_studies")`, `api.get("guides")`, `api.get("leads")` in parallel via `Promise.all`
- Read nudge config from `localStorage.getItem("DP_NUDGES_CONFIG")` for Active Nudges count
- Stats (7): New Leads, Case Studies, Web Inquiries, Active Nudges, Blog Posts, Guides, Active Banners — all computed from live data
- Captured Leads section: show real leads (first 5), loading/empty states, status badge colours match `'new'|'contacted'|'archived'`
- Nudge Campaigns section: show 3 real nudge types (Banner, Popup, Exit Popup) from localStorage config; Settings button → `<Link href="/admin/nudges">`; Delete/Disable button → sets `enabled:false` in localStorage + re-renders
- Notifications button → `<Link href="/admin/leads">` showing new lead count when >0
- View Analytics button → `<Link href="/admin/leads">`
- Loading state: show "—" for all stats while fetching
