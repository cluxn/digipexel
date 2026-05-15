# Quick Task 260515-apt: Fix Logo & Floating-Icon Image Upload Persistence + ESLint Errors

**Date:** 2026-05-15  
**Status:** Complete

## What was broken

### 1. Upload response key mismatch (PRIMARY — affects both logo and icon uploads)
`upload.php` uses `json_resp('success', ['url' => $url])` which wraps the URL under `data.url` per the standard `json_resp` convention. Both admin pages incorrectly read `json.url` (undefined) instead of `json.data.url`. Result: upload silently "succeeds" but the URL is never applied to state, so the old image stays visible.

**Fix:** `logos/page.tsx` and `site-content/page.tsx` — changed `json.url` → `json.data?.url` in the success check and `json.url` → `json.data.url` in the assignment.

### 2. Logos page data parsing mismatch
`logos.php` GET response structure is `{status, data: {enabled, logos[]}}` but the page read `data.data` (the whole `{enabled, logos}` object, not an array) and `data.enabled` (undefined). At render, `logos.map(...)` on a plain object throws `TypeError: logos.map is not a function`, crashing the component and falling back to demo/localStorage data.

**Fix:** `logos/page.tsx` — changed `setLogos(data.data)` → `setLogos(data.data.logos)` and `setIsEnabled(data.enabled)` → `setIsEnabled(data.data.enabled)`.

### 3. ESLint errors blocking build
Two errors in `logos/page.tsx`:
- `@typescript-eslint/no-explicit-any` in `updateLogo` — fixed by replacing `(newLogos[index] as any)[field] = value` with spread: `newLogos[index] = { ...newLogos[index], [field]: value }`.
- `react/no-unescaped-entities` for apostrophe in JSX — escaped as `&apos;`.

## Result
- Logo images uploaded via the Upload button now correctly apply the returned URL to the logo row
- Floating icon images uploaded for hero slots now correctly apply the returned URL to the icon slot
- The logos page correctly parses the API response and renders the logo list without crashing
- ESLint passes with 0 errors (warnings only)
