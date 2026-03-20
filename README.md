# Digi Pexel

This project is built using the **GSD Framework** standard:
- **Frontend**: Next.js (React) styled with Tailwind CSS for a premium agency look.
- **Backend**: Native PHP for direct and easy deployment to Hostinger.

## Project Structure
- `/frontend`: Contains the Next.js application. 
- `/backend`: Contains the PHP API endpoints and database logic.

## Deployment to Hostinger (The GSD Way)

This structure is specifically designed so that **no data will be lost** and everything can be easily hosted on Hostinger.

1. **Backend (PHP & MySQL)**
   - Upload the contents of the `/backend` folder to your Hostinger `public_html/api` folder (or a subdomain like `api.digipexel.com`).
   - Create a MySQL database in Hostinger and update `backend/config.php` with the live database credentials.

2. **Frontend (Next.js)**
   - **Option A (Static Export for Shared Hosting)**
     - In `frontend/next.config.mjs`, add `output: 'export'`.
     - Run `npm run build` inside `/frontend`.
     - Upload the generated `out/` folder contents to your Hostinger `public_html` root.
   - **Option B (Node.js App on VPS or Advanced Hostinger Plan)**
     - Deploy the Next.js app natively and connect it to your domain.

## Running Locally
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: Serve the `backend` folder using XAMPP, WAMP, or Laravel Valet to test the APIs locally. Update the fetch URL in `/frontend/src/app/page.tsx` as needed for testing.
