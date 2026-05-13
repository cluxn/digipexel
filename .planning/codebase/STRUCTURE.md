# Project Structure

## Root Layout

```
Digi Pexel/
├── .github/workflows/        # CI/CD — GitHub Actions deploy pipeline
├── .planning/codebase/       # GSD codebase maps (this folder)
├── backend/                  # PHP REST API backend
├── frontend/                 # Next.js frontend application
├── DEVELOPER.md              # Developer setup guide
├── deploy_digipexel.ps1      # Manual PowerShell deploy script
└── deploy.zip                # Build artifact (should be gitignored)
```

## Backend Structure

```
backend/
├── api/                      # REST API endpoints (one file per resource)
│   ├── blogs.php             # CRUD for blog posts
│   ├── case_studies.php      # CRUD for case studies
│   ├── guides.php            # CRUD for guides
│   ├── leads.php             # Lead capture (contact form submissions)
│   ├── logos.php             # Client logo management
│   └── testimonials.php      # Testimonial management
├── .htaccess                 # Apache rewrites (API routing)
├── common.php                # Shared utilities, CORS headers, DB helpers
├── config.php                # Database credentials (MySQL connection)
└── init_db.php               # Database schema initialization (publicly accessible — security risk)
```

## Frontend Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin panel routes
│   │   │   ├── page.tsx      # Admin dashboard
│   │   │   ├── login/        # Admin login
│   │   │   ├── blog/         # Blog management
│   │   │   ├── case-studies/ # Case study management
│   │   │   ├── guides/       # Guide management
│   │   │   ├── leads/        # Lead list
│   │   │   ├── logos/        # Logo management
│   │   │   ├── testimonials/ # Testimonial management
│   │   │   ├── nudges/       # Nudge/popup config
│   │   │   ├── approvals/    # [Coming Soon stub]
│   │   │   ├── banners/      # [Coming Soon stub]
│   │   │   ├── newsletter/   # [Coming Soon stub]
│   │   │   ├── settings/     # [Coming Soon stub]
│   │   │   └── waitlist/     # [Coming Soon stub]
│   │   ├── blog/             # Public blog listing + [slug] detail
│   │   ├── case-studies/     # Public case study listing + [slug] detail
│   │   ├── guides/           # Public guides listing + [id] detail
│   │   ├── services/[slug]/  # Dynamic service pages
│   │   ├── ai-seo/           # AI SEO service page
│   │   ├── contact-us/       # Contact form page
│   │   ├── testimonials/     # Public testimonials page
│   │   ├── thank-you/        # Post-contact confirmation
│   │   ├── privacy-policy/   # Legal page
│   │   ├── terms-and-conditions/ # Legal page
│   │   ├── layout.tsx        # Root layout (fonts, metadata)
│   │   ├── page.tsx          # Homepage
│   │   ├── error.tsx         # Error boundary
│   │   └── globals.css       # Global styles + Tailwind base
│   ├── components/
│   │   ├── ui/               # Primitive components (Button, Badge, Card, etc.)
│   │   ├── blocks/           # Page section compositions (Hero, Stats, Testimonials, etc.)
│   │   ├── page-clients/     # Dynamic `"use client"` wrappers for RSC pages
│   │   └── admin/            # Admin-specific layout components
│   └── lib/
│       ├── api.ts            # API fetch functions + safeFetch() wrapper
│       ├── constants.ts      # API_BASE_URL and other app constants
│       └── utils.ts          # cn() Tailwind merge utility
├── public/                   # Static assets (images, fonts)
├── .env.local                # Local env vars (NEXT_PUBLIC_API_URL)
├── .env.example              # Env var template
├── next.config.ts            # Next.js config (static export mode)
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config (strict, @/* alias)
└── package.json              # Dependencies and scripts
```

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/lib/constants.ts` | `API_BASE_URL` — central API endpoint config |
| `frontend/src/lib/api.ts` | `safeFetch()` — all public data fetching goes here |
| `backend/config.php` | MySQL credentials — **contains hardcoded password** |
| `backend/common.php` | CORS config, shared DB connection helper |
| `backend/init_db.php` | One-time schema setup — **publicly accessible, security risk** |
| `.github/workflows/deploy-to-subdomain.yml` | Automated deploy to Hostinger via SFTP/FTP |

## Naming Conventions

- **Page files:** `page.tsx` (Next.js convention)
- **Component files:** kebab-case (`admin-layout.tsx`, `hero-section.tsx`)
- **Component exports:** PascalCase named exports for shared; default exports for pages
- **Backend files:** snake_case (`case_studies.php`, `init_db.php`)
- **CSS classes:** Tailwind utility classes; custom classes only in `globals.css`

## Adding New Code

- **New public page:** create `src/app/<route>/page.tsx`
- **New admin page:** create `src/app/admin/<section>/page.tsx` + add to admin sidebar in `admin-layout.tsx`
- **New API endpoint:** create `backend/api/<resource>.php` following existing CRUD pattern
- **New reusable component:** add to `src/components/ui/` (primitive) or `src/components/blocks/` (section)
- **New constant/config:** add to `src/lib/constants.ts`
