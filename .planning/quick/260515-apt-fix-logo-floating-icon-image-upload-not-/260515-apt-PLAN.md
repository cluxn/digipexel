---
phase: quick
plan: 260515-apt
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/app/admin/logos/page.tsx
  - frontend/src/app/admin/site-content/page.tsx
---

<objective>
Fix three bugs preventing logo and floating-icon image uploads from persisting, and fix ESLint errors blocking the build.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Fix upload response key mismatch</name>
  <files>
    frontend/src/app/admin/logos/page.tsx
    frontend/src/app/admin/site-content/page.tsx
  </files>
  <action>
upload.php returns {"status":"success","data":{"url":"..."}} via json_resp(), but both admin pages read json.url (undefined) instead of json.data.url. Fix by reading json.data?.url in the success check and assignment.
  </action>
  <done>Both handleLogoFileChange and uploadIconImage now read json.data?.url / json.data.url</done>
</task>

<task type="auto">
  <name>Task 2: Fix logos page data parsing</name>
  <files>frontend/src/app/admin/logos/page.tsx</files>
  <action>
logos.php GET returns {status, data: {enabled, logos[]}} but page reads data.data (object) as logos array and data.enabled (undefined) as enabled state. Fix by reading data.data.logos and data.data.enabled.
  </action>
  <done>setLogos(data.data.logos) and setIsEnabled(data.data.enabled)</done>
</task>

<task type="auto">
  <name>Task 3: Fix ESLint errors blocking build</name>
  <files>frontend/src/app/admin/logos/page.tsx</files>
  <action>
Two ESLint errors: (1) no-explicit-any in updateLogo — fix with spread assignment. (2) react/no-unescaped-entities for apostrophe — escape as &apos;
  </action>
  <done>Build-blocking ESLint errors resolved; only warnings remain</done>
</task>

</tasks>
