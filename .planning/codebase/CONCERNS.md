# Technical Concerns

## Security (CRITICAL)

- **Hardcoded MySQL password** in `backend/config.php` — committed to git history
- **FTP password hardcoded** in `.github/workflows/deploy-to-subdomain.yml` (commit `db7256b` "inline credentials") — `Cluxnftp@12345` visible in plaintext
- **Admin auth is client-side only** — `frontend/src/app/admin/login/page.tsx` checks password `"12345"` in browser JS and sets a `localStorage` flag; zero server-side session validation
- **All backend write/delete API endpoints are unauthenticated** — `?admin=1` is a GET parameter any visitor can pass
- **`Access-Control-Allow-Origin: *`** set globally in `backend/common.php` — allows any origin to call the API
- **`backend/init_db.php` is publicly accessible** — no auth protection on database initialization endpoint

## Performance

- Schema migrations run as `ALTER TABLE ... ADD COLUMN` inside try/catch **on every request** — should run once at deploy time, not per-request
- No HTTP caching headers on API responses
- No CDN configured for static assets

## Technical Debt

- Two inconsistent API call patterns used across the frontend (`safeFetch()` vs direct fetch)
- Bulk update actions use `DELETE FROM table` then re-insert **with no transaction wrapping** — data loss risk if the insert fails
- Nudge config stored in `localStorage` only — has zero effect on real visitors
- 5 admin sidebar pages are "Coming Soon" stubs (banners, newsletter, approvals, settings, waitlist)
- All social links in the frontend point to `#` (placeholder)
- Duplicate TypeScript type definitions across multiple files
- Framer Motion imported inconsistently from both `framer-motion` and `motion/react`
- Dashboard stats are hardcoded mock numbers, not live data

## Scalability

- Single PHP backend with no connection pooling — will struggle under concurrent load
- No queue system for background jobs (email sends, etc.)
- MySQL on shared Hostinger hosting — limited vertical scaling

## Missing Infrastructure

- **Zero test files** despite Jest, Cypress, and Testing Library being installed
- No error monitoring (no Sentry or equivalent)
- No HTTP→HTTPS redirect in `.htaccess`
- CI pipeline deploys without running lint or tests first
- No staging environment — all changes go directly to production subdomain

## Quick Wins

1. Move all secrets to GitHub Actions secrets (FTP password, DB password) — remove from code immediately
2. Add server-side admin session validation (PHP session token) — `?admin=1` is not security
3. Add `.htaccess` HTTPS redirect (one line)
4. Move schema migrations out of per-request code into a deploy script
5. Wrap bulk delete+insert operations in MySQL transactions
6. Set up Jest config and write at least smoke tests for critical paths
7. Add `Content-Security-Policy` and restrict CORS to known origins
8. Replace hardcoded dashboard stats with real DB queries
