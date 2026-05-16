# Deferred Items — Phase 05 Testimonials System Upgrade

## Out-of-scope issues discovered during execution

### 1. Missing API_BASE_URL import in admin blog page
- **File:** `frontend/src/app/admin/blog/page.tsx`
- **Error:** `Cannot find name 'API_BASE_URL'` at line 108
- **Root cause:** Commit `e2b58c7` (fix(api-urls)) replaced relative paths with `API_BASE_URL` references but failed to add the import statement.
- **Impact:** Build fails at TypeScript compilation. Not caused by Plan 03 changes.
- **Recommended fix:** Add `import { API_BASE_URL } from "@/lib/constants";` to the imports in `frontend/src/app/admin/blog/page.tsx`.

### 2. TypeScript type errors in admin testimonials page
- **File:** `frontend/src/app/admin/testimonials/page.tsx`
- **Errors:** `TS2352` type conversion errors at lines 160 and 218
- **Root cause:** Introduced in Plan 02 (05-02) — pre-existing in this codebase as of 2026-05-15.
- **Impact:** TypeScript strict mode flags these, but runtime behavior is unaffected.
- **Recommended fix:** Change `as Record<string, unknown>` casts to `as unknown as Record<string, unknown>`.

### 3. Service page generateStaticParams config warning
- **File:** `frontend/src/app/services/[slug]/page.tsx`
- **Error:** Static export configuration parsing issue
- **Root cause:** Pre-existing issue from Phase 03. Build may have passed before because of runtime compilation differences.
