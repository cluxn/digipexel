# Architecture

**Analysis Date:** 2026-05-13

## Pattern

**Overall:** Monorepo — statically-exported Next.js frontend + PHP REST backend, deployed to shared Hostinger hosting.

**Key Characteristics:**
- Frontend is a **static export** (`next build` produces `out/` directory) — no server-side rendering at runtime; all pages are pre-rendered HTML + client-side JavaScript.
- Backend is a **thin PHP REST API** (no framework) hosted as a subdirectory of the same domain: `https://digipexel.cluxn.com/backend/api/`.
- The two halves are fully decoupled: the frontend calls the backend over HTTP using the `api` client in `frontend/src/lib/api.ts`.
- Admin panel is a set of Next.js client pages under `/admin` — authentication is handled entirely in the browser (localStorage flag + hardcoded passcode), with no server-side session.

---

## Data Flow

**Public page fetch (blogs, case studies, guides, testimonials, logos):**

1. Browser loads a statically-exported Next.js page (e.g. `/blog`).
2. Page component calls `api.get('blogs')` via `frontend/src/lib/api.ts`.
3. `api.get` calls `safeFetch` in `frontend/src/lib/utils.ts`, issuing a `GET` to `https://digi.cluxn.com/backend/api/blogs.php`.
4. PHP reads from MySQL via PDO and returns `{ "status": "success", "data": [...] }`.
5. React state is set and the UI renders.

**Fallback / demo data:**
- If the PHP API returns an error or network fails, `safeFetch` returns `{ status: "error" }` and page-level client components (e.g. `blog-details-client.tsx`) fall back to hardcoded `DEMO_POST` / `DEMO_RELATED` constants embedded in the component file.

**Lead capture (contact form, blog sidebar form):**

1. User submits form.
2. Client POSTs `{ action: "add_lead", ...fields }` to `backend/api/leads.php`.
3. PHP inserts a row into the `leads` MySQL table.
4. Response `{ "status": "success" }` triggers a success state in the React component.

**Admin write flow (blog, testimonials, logos, guides, case studies):**

1. Admin authenticates via `/admin/login` (localStorage flag `admin_auth=true`).
2. Admin pages (`/admin/blog`, `/admin/testimonials`, etc.) load all records from the backend with `?admin=1` query param (bypasses `status='published'` filter).
3. Admin saves/deletes by POSTing `{ action: "save_post"|"delete_post"|"update_testimonials"|... }` to the appropriate PHP endpoint.
4. PHP performs INSERT/UPDATE/DELETE via PDO.

---

## Key Components

### Backend (`backend/`)

| File | Responsibility |
|------|---------------|
| `config.php` | Database credentials, creates `$pdo` (PDO connection object) |
| `common.php` | Requires `config.php`; exports `send_json_headers()`, `json_resp()`, `slugify()`, `get_input()` |
| `init_db.php` | One-time setup: `CREATE TABLE IF NOT EXISTS` for all 6 tables, seeds default rows |
| `api/blogs.php` | CRUD for blogs; handles auto-migration of new columns on boot |
| `api/case_studies.php` | CRUD for case studies |
| `api/guides.php` | CRUD for guides |
| `api/leads.php` | Capture + status-update + delete for leads |
| `api/logos.php` | CRUD for logo marquee entries |
| `api/testimonials.php` | CRUD for testimonials + `testimonials_focus` media |
| `api/index.php` | Catch-all fallback for the `backend/api/` directory |
| `.htaccess` | Rewrites unmatched requests to `index.php`; preserves Authorization header |

**PHP API response shape (always):**
```json
{ "status": "success"|"error", "data": <payload|null>, "message": "<string|null>" }
```

**Action-based POST routing:** All write operations are dispatched by an `action` field in the JSON body (e.g. `save_post`, `delete_post`, `add_lead`, `update_testimonials`). There is no REST method-per-action convention — all writes go through POST.

### Frontend (`frontend/src/`)

| Module | Responsibility |
|--------|---------------|
| `lib/api.ts` | Centralized HTTP client — `api.get(endpoint, params?)` and `api.post(endpoint, body)`. Constructs URLs as `${API_BASE_URL}/${endpoint}.php`. |
| `lib/utils.ts` | `cn()` (Tailwind class merger), `safeFetch()` (error-safe fetch wrapper with JSON parse guard) |
| `lib/constants.ts` | `SITE_NAME`, `TAGLINE`, `NAV_LINKS`, `SOCIAL_LINKS`, `API_BASE_URL` (reads `NEXT_PUBLIC_API_URL` env var, falls back to `https://digi.cluxn.com/backend/api`) |
| `app/layout.tsx` | Root layout: Geist font, global CSS, mounts `<Nudges />` and `<BackToTop />` globally |
| `app/page.tsx` | Homepage — assembles ~10 block components in sequence |
| `app/services/[slug]/page.tsx` | Dynamic service pages — all service content is hardcoded in a `SERVICES` record (no DB); uses `generateStaticParams` to pre-render all slugs at build time |
| `app/blog/[slug]/page.tsx` | Blog detail — server wrapper that resolves slug, passes to `BlogDetailsClient` |
| `components/page-clients/blog-details-client.tsx` | Full blog post rendering including TOC, sections, share buttons, inline lead form |
| `components/page-clients/case-study-client.tsx` | Case study detail rendering |
| `components/page-clients/guide-client.tsx` | Guide detail rendering |
| `components/admin/admin-layout.tsx` | Shared admin sidebar + auth guard (localStorage check → redirect to `/admin/login`) |
| `components/blocks/` | Marketing section components (hero, stats, logos, testimonials, services, etc.) |
| `components/ui/` | Base UI primitives (Button, Badge, Card, Navbar, Footer, Nudges, etc.) |

---

## State Management

**No global state manager.** All state is local React:

- **Server/API data:** `useState` + `useEffect` with `fetch` or `api.get()` inside client components. No SWR, React Query, or similar.
- **Admin auth:** `localStorage.getItem("admin_auth") === "true"` checked in `AdminLayout`'s `useEffect`. No JWT, no server session.
- **Form state:** Controlled `useState` per field in each form component.
- **UI state:** Local `useState` (loading, error, copied, formSent, activeSection, etc.) within each page-client component.

---

## API Design

**Style:** REST-ish. All endpoints are PHP files; GET retrieves, POST writes (all write actions discriminated by `action` field in body).

**Base URL:** `https://digi.cluxn.com/backend/api` (overridable via `NEXT_PUBLIC_API_URL`)

**Endpoints:**

| Endpoint | GET behavior | POST actions |
|----------|-------------|--------------|
| `blogs.php` | List published blogs (or all with `?admin=1`); single by `?slug=` | `save_post`, `delete_post`, `update_blogs` |
| `case_studies.php` | List / fetch by slug | `save_case_study`, `delete_case_study`, `update_case_studies` |
| `guides.php` | List / fetch by id or slug | `save_guide`, `delete_guide` |
| `leads.php` | List all leads | `add_lead`, `update_status`, `delete_lead` |
| `logos.php` | List all logos | `update_logos` (full replace) |
| `testimonials.php` | List testimonials + focus items | `update_testimonials`, `update_focus` |

**CORS:** `Access-Control-Allow-Origin: *` on all endpoints (set in `send_json_headers()`).

**Auto-migration:** `blogs.php` (and likely other endpoints) use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` on every request to handle schema evolution without a migration system.

---

## Error Handling

**Backend:** Try/catch around all PDO operations; errors returned as `{ "status": "error", "message": "<exception message>" }`.

**Frontend (`safeFetch`):**
- Network errors → caught, return `{ status: "error", message: "Connection failed" }`.
- Non-2xx HTTP → return `{ status: "error", message: "Server returned <N>" }`.
- Invalid JSON body → return `{ status: "error", message: "Invalid server response format" }`.
- Page-level components check `d.status === "success"` and fall back to embedded demo data on failure.

---

## Authentication

**Admin panel only.** Authentication is entirely client-side:
- Login page (`/admin/login/page.tsx`) compares entered code against hardcoded string `"12345"`.
- On success, sets `localStorage.setItem("admin_auth", "true")`.
- `AdminLayout` checks this flag on mount and redirects to `/admin/login` if absent.
- No token sent to backend; backend has no authentication layer — all PHP endpoints are publicly accessible.

---

*Architecture analysis: 2026-05-13*
