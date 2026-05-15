# Quick Task 260515-aee — Summary

**Task:** add image upload replace delete to admin hero icons and logos sections
**Date:** 2026-05-15
**Status:** Complete

## What Was Done

### 1. `backend/api/upload.php` (new)
- Accepts `multipart/form-data` POST with `file` field
- Validates MIME type via `finfo` (jpeg, png, gif, webp, svg only) and size (max 2 MB)
- Stores to `backend/uploads/` directory (created automatically if missing)
- Returns `{ "status": "success", "url": "https://host/backend/uploads/filename" }`

### 2. `frontend/src/components/ui/floating-icons-hero-section.tsx`
- Wired the `imageUrl` field in `IconProps` — it was already in the interface but never rendered
- `Icon` component now renders `<img src={imageUrl}>` inside the same frosted-glass card when `imageUrl` is set, falling back to the SVG component otherwise

### 3. `frontend/src/components/blocks/floating-icons-hero-demo.tsx`
- `aiIcons` builder now detects URL values in the `icon` field (starts with `http` or `/`)
- URL icons → passed as `imageUrl` to the hero component (renders as `<img>`)
- Registry keys → passed as `icon` component (same as before — backward compatible)

### 4. `frontend/src/app/admin/site-content/page.tsx` (hero icon slots)
- Added `uploadingSlot` state and 6 per-slot `useRef<HTMLInputElement>` file input refs
- Added `uploadIconImage()` helper that POSTs to `${API_BASE_URL}/upload.php`
- Each icon slot now shows:
  - Preset Icon select (disabled/shows "— custom image —" when custom URL active)
  - Custom Image row: URL text input + Upload button + Reset button (when URL set)
  - Preview thumbnail shows custom image when URL set, SVG component otherwise

### 5. `frontend/src/app/admin/logos/page.tsx`
- Added `uploadingLogo`, `uploadTargetIndex` states and a single shared `logoFileInputRef`
- Added `handleLogoUploadClick()` + `handleLogoFileChange()` upload handlers
- Logo row: Upload button (icon) next to URL field triggers the shared hidden file input
- Preview thumbnail: red × button appears when `logo.src` is set, clears it on click

## Behaviour

- Upload → file picked → POST to `/backend/uploads/upload.php` → URL returned → field updated
- Logos: "×" on preview = clear image src only (logo row stays); Trash icon = delete entire row
- Hero icons: "Reset" button reverts custom image back to first preset icon ("openai")
- All existing preset-icon and URL-based logo data continues to work without changes
