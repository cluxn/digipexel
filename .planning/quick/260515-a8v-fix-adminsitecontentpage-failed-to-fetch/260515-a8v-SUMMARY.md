# Quick Task 260515-a8v — Summary

**Task:** fix AdminSiteContentPage Failed to fetch error in fetchAll useEffect
**Date:** 2026-05-15
**Status:** Complete

## What Was Done

Modified `frontend/src/lib/utils.ts` — the `safeFetch` function.

**Root cause:** Chrome extension `frame_ant.js` monkey-patches `window.fetch` and attaches a `.then()` handler without a `.catch()`. When the backend is unreachable, `fetch` rejects. The extension's handler-less chain causes the browser to emit a global `unhandledrejection` event before `safeFetch`'s try-catch can mark it as handled. Next.js dev overlay listens for `unhandledrejection` and shows the red error screen.

**Fix:** Added a synchronous no-op `.catch(() => {})` on the fetch promise immediately before `await`-ing it. This marks the rejection as "handled" from the browser's perspective in the same microtask tick as the promise creation — preventing `unhandledrejection` from firing — while leaving all error handling in the surrounding try-catch intact.

## Change

`frontend/src/lib/utils.ts` — inside `safeFetch` try block:

Before:
```js
const res = await fetch(url, { ...options, signal: controller.signal });
```

After:
```js
const fetchPromise = fetch(url, { ...options, signal: controller.signal });
fetchPromise.catch(() => {});
const res = await fetchPromise;
```

## Impact

- All admin pages making `api.get()` / `api.post()` calls benefit — the fix is in the shared utility
- `safeFetch`'s error handling behavior is unchanged; the try-catch still catches and returns `{ status: "error" }` for all network failures
- The `apiError` banner in `AdminSiteContentPage` still shows correctly when the backend is unreachable
