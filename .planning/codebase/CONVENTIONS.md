# Code Conventions

## Style Guide
- ESLint 9 with `eslint-config-next` (no Prettier configured)
- No explicit formatting tool — relies on ESLint rules only

## TypeScript / Type Safety
- Strict mode enabled in `tsconfig.json`
- Path alias `@/*` → `src/*` for absolute imports
- TypeScript used throughout frontend; PHP backend is untyped

## Patterns Used
- **47 client components** using `"use client"` directive
- **Three component tiers:**
  - `ui/` — primitive components (buttons, inputs, etc.)
  - `blocks/` — page sections (composed from ui/)
  - `page-clients/` — dynamic wrappers for pages
- `cn()` utility + CVA (class-variance-authority) for variant-based component styling
- Framer Motion for all animations — inconsistent import source: `framer-motion` vs `motion/react` (mixed usage)
- `safeFetch()` wrapper used for all public API calls
- Admin pages fall back to mock data (no real API connection)
- `react-hook-form` and `zod` installed but currently unused

## Naming Conventions
- **Components:** PascalCase (e.g., `HeroSection`, `AdminLayout`)
- **Functions:** camelCase (e.g., `safeFetch`, `handleSubmit`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files/folders:** kebab-case (e.g., `admin-layout.tsx`, `hero-section.tsx`)

## Import Style
- Absolute imports via `@/*` alias preferred
- Named exports for shared/reusable components
- Default exports for page components (Next.js convention)
- No barrel files (`index.ts`) pattern observed
