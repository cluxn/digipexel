---
quick_id: 260515-aee
description: add image upload replace delete to admin hero icons and logos sections
date: 2026-05-15
status: ready
---

# Quick Task 260515-aee: Image Upload for Hero Icons and Logos

## Root Cause

- **Hero icon slots** (admin site-content): only has a `<select>` dropdown from hardcoded `ICON_REGISTRY` keys — no way to use a custom image
- **Logos admin**: has a URL text field only — no direct file upload
- **`floating-icons-hero-section.tsx`**: `imageUrl` field exists in `IconProps` interface but the `Icon` render component never uses it

## Strategy

Store custom images as URLs in existing string fields:
- `iconSlots[i].icon` can be a registry key (e.g. `"openai"`) OR a full URL (e.g. `"https://..."`)
- `logo.src` already stores a URL — we just add a file-upload path that sets it

Detection: `value.startsWith('http') || value.startsWith('/')` → treat as image URL.

Upload endpoint stores files at `backend/uploads/`, returns full URL `https://{host}/backend/uploads/{filename}`.

## Tasks

### Task 1: backend/api/upload.php (new file)
- Accept `multipart/form-data` POST with `file` field
- Validate: image types only (jpeg, png, gif, webp, svg), max 2 MB
- Store to `../uploads/` relative to `api/` (= `backend/uploads/`)
- Return `{"status":"success","url":"https://host/backend/uploads/filename"}`
- `send_json_headers()` from `common.php` handles CORS

### Task 2: floating-icons-hero-section.tsx — wire imageUrl render path
File: `frontend/src/components/ui/floating-icons-hero-section.tsx`
- In `Icon` component, currently renders SVG component when `iconData.icon` is set and `null` otherwise
- Add: when `iconData.imageUrl` is set, render `<img src={imageUrl}>` inside the same frosted-glass card design
- Priority: `imageUrl` takes precedence over `icon`

### Task 3: floating-icons-hero-demo.tsx — detect URL icons
File: `frontend/src/components/blocks/floating-icons-hero-demo.tsx`
- In `aiIcons` mapping, check if `icon` value is a URL
- If URL: pass `imageUrl: icon, icon: undefined`
- If registry key: pass `icon: ICON_REGISTRY[icon] ?? IconOpenAI, imageUrl: undefined`

### Task 4: site-content/page.tsx — upload + custom URL per icon slot
File: `frontend/src/app/admin/site-content/page.tsx`
- Add `uploadingSlot` state: `number | null`
- Add `uploadImage()` helper that POSTs to `${API_BASE_URL}/upload.php`
- Per icon slot, below the existing select/label row, add a "Custom Image" row:
  - Hidden `<input type="file" accept="image/*">` with a ref per slot
  - "Upload Image" button (triggers file input)
  - URL text input (manual URL entry)
  - If custom URL set: show preview + "Remove" button
  - The `<select>` shows as "— custom image —" when `icon` value is a URL
- Import `API_BASE_URL` from `@/lib/constants`

### Task 5: logos/page.tsx — upload + clear image per logo row
File: `frontend/src/app/admin/logos/page.tsx`
- Add `uploadingLogo` state: `number | null`
- Add `uploadImage()` helper
- Per logo row, next to the SVG URL input:
  - Hidden `<input type="file" accept="image/*">` with a ref per logo index
  - "Upload" icon button that triggers file input
- On the preview box when `logo.src` is set:
  - Show "×" clear button overlay to set `src` to ""
- Import `API_BASE_URL` from `@/lib/constants`
