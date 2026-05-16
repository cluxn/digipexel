# Quick Task 260515-hoh — Plan

**Task:** fix uploadIconImage fetch errors and backend API unreachable in admin panel
**Date:** 2026-05-15

## Root Cause Analysis

Three distinct bugs:

### Bug 1: "Failed to fetch" TypeError in uploadIconImage / handleLogoFileChange
Both admin pages call `fetch()` directly (not via `safeFetch`) for file uploads. The Chrome extension `frame_ant.js` monkey-patches `window.fetch` and attaches a `.then()` without a `.catch()`. When the backend is unreachable, the extension's chain fires an `unhandledrejection` event before the async try-catch can mark the promise as handled. This was previously fixed in `safeFetch` (quick task 260515-a8v) by adding `fetchPromise.catch(() => {})` before `await`. The upload functions never got the same fix.

**Fix:** Replace raw `fetch()` + `res.json()` with `safeFetch()` in both upload handlers — automatically inherits the unhandledrejection suppression.

### Bug 2: Logos images not saving/reflecting
`logos/page.tsx` uses hardcoded relative URL `/api/logos.php` for ALL API operations (fetch, save, toggle). Relative `/api/logos.php` resolves to:
- Locally: `http://localhost:3000/api/logos.php` → 404 (no Next.js API route there)
- On Hostinger: `https://digipexel.cluxn.com/api/logos.php` → 404 (backend is at `/backend/api/logos.php`)

Result: fetch falls through to localStorage/demo fallback. Saves only update localStorage ("Changes saved to PREVIEW"). Zero data persists to the database.

**Fix:** Replace `/api/logos.php` relative paths with `${API_BASE_URL}/logos.php` (API_BASE_URL already imported in file).

### Bug 3: "Backend API unreachable" in site content
`constants.ts` defaults `API_BASE_URL` to `https://digi.cluxn.com/backend/api`. The GitHub Actions deploy workflow deploys the backend to `public_html/digipexel/backend/` (accessible at `https://digipexel.cluxn.com/backend/api/`) and explicitly initializes the DB via `https://digipexel.cluxn.com/backend/init_db.php`. The two URLs diverge: frontend points to `digi.cluxn.com` but the CI/CD-deployed backend lives at `digipexel.cluxn.com`. The `NEXT_PUBLIC_API_URL` env var is not set during the build step, so the hardcoded fallback is used.

**Fix:** Update `constants.ts` default to `https://digipexel.cluxn.com/backend/api`. Update GitHub Actions workflow to explicitly set `NEXT_PUBLIC_API_URL` during build so deployed frontend and backend are always in sync.

---

## Tasks

### Task 1 — Fix upload functions to use safeFetch (site-content + logos)
**Files:**
- `frontend/src/app/admin/site-content/page.tsx`
- `frontend/src/app/admin/logos/page.tsx`

**Action:**
In `site-content/page.tsx`, `uploadIconImage` function:
```diff
- const res = await fetch(`${API_BASE_URL}/upload.php`, { method: "POST", body: formData });
- const json = await res.json();
+ const json = await safeFetch(`${API_BASE_URL}/upload.php`, { method: "POST", body: formData });
```
Also add `safeFetch` to imports (it's in `@/lib/utils`).

In `logos/page.tsx`, `handleLogoFileChange` function:
```diff
- const res = await fetch(`${API_BASE_URL}/upload.php`, { method: "POST", body: formData });
- const json = await res.json();
+ const json = await safeFetch(`${API_BASE_URL}/upload.php`, { method: "POST", body: formData });
```
(safeFetch already imported in logos page)

**Verify:** No raw `fetch()` calls remain in admin upload functions. `safeFetch` usage confirmed.

---

### Task 2 — Fix logos page API URLs
**File:** `frontend/src/app/admin/logos/page.tsx`

**Action:** Three locations need updating:

1. `fetchData` function:
```diff
- const data = await safeFetch("/api/logos.php");
+ const data = await safeFetch(`${API_BASE_URL}/logos.php`);
```

2. `handleToggleSection` function:
```diff
- await fetch("/api/logos.php", {
-   method: "POST",
-   body: JSON.stringify({ action: "toggle_section", enabled: nuevoEstado }),
- });
+ await safeFetch(`${API_BASE_URL}/logos.php`, {
+   method: "POST",
+   headers: { "Content-Type": "application/json" },
+   body: JSON.stringify({ action: "toggle_section", enabled: nuevoEstado }),
+ });
```

3. `saveChanges` function:
```diff
- const data = await safeFetch("/api/logos.php", {
-   method: "POST",
-   body: JSON.stringify({ action: "update_logos", logos }),
- });
+ const data = await safeFetch(`${API_BASE_URL}/logos.php`, {
+   method: "POST",
+   headers: { "Content-Type": "application/json" },
+   body: JSON.stringify({ action: "update_logos", logos }),
+ });
```

**Verify:** No relative `/api/` paths remain in logos page. All calls use API_BASE_URL.

---

### Task 3 — Fix API base URL and deploy config
**Files:**
- `frontend/src/lib/constants.ts`
- `.github/workflows/deploy-to-subdomain.yml`

**Action in constants.ts:**
```diff
- export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://digi.cluxn.com/backend/api";
+ export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://digipexel.cluxn.com/backend/api";
```

**Action in deploy-to-subdomain.yml** — add env var to build step:
```diff
      - name: 🏗️ Build Statically Exported Frontend
        run: |
          cd frontend
          npm run build
+       env:
+         NEXT_PUBLIC_API_URL: https://digipexel.cluxn.com/backend/api
```

**Verify:** `constants.ts` uses `digipexel.cluxn.com`. Deploy workflow sets `NEXT_PUBLIC_API_URL` explicitly.
