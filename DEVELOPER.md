# Digi Pexel Developer Guide

Welcome to the Digi Pexel codebase. This project is structured as a Monorepo with a Next.js frontend and a Native PHP backend.

## Architecture

### Backend (`/backend`)
- **Language**: PHP 8.x
- **Database**: MySQL (via PDO)
- **Core Logic**: `common.php` centralizes headers, CORS, JSON responses, and utility functions (like `slugify`).
- **API Endpoints**: Located in `/backend/api/*.php`. Each file handles a specific resource (blogs, case studies, etc.).
- **Common Utilities**:
  - `send_json_headers()`: Sets CORS and Content-Type.
  - `json_resp($status, $data, $message)`: Standardizes JSON output.
  - `get_input()`: Helper to read JSON request body.

### Frontend (`/frontend`)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **API Client**: `src/lib/api.ts` centralizes all backend requests.
- **Constants**: `src/lib/constants.ts` stores global settings, navigation links, and social links.
- **Components**:
  - `src/components/ui`: Base UI components (Radix UI, buttons, etc.).
  - `src/components/blocks`: Larger layout blocks used in pages.

## Development Workflow

### Adding a New API Endpoint
1. Create a new PHP file in `backend/api/resource_name.php`.
2. Requirement `../common.php` and call `send_json_headers()`.
3. Use `$pdo` (defined in `config.php`, included via `common.php`) for database operations.
4. Return responses using `json_resp()`.

### Adding a New Page in Frontend
1. Create a new directory in `src/app/my-page/page.tsx`.
2. If fetching data, use the `api` utility from `@/lib/api`.
3. Update `NAV_LINKS` in `src/lib/constants.ts` if the page should appear in navigation.

## Scaling Best Practices
- **DRY (Don't Repeat Yourself)**: If logic is needed in multiple PHP files, move it to `common.php`.
- **Environment Variables**: Use `.env.local` for sensitive data or dynamic URLs.
- **Standardized Responses**: Always use the `{ "status": "success", "data": ... }` format.
- **Modular Components**: Keep blocks focused on a single section of a page.

## Database
Run `init_db.php` on a new environment to set up the base schema. Migrations for new columns are often handled automatically in the respective resource API files during the first run.
