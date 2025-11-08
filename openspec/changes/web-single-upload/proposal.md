# Change: Web Single Photo Upload

## Why
Enable users to upload a single photo from the web application. This provides the frontend interface for photo uploads, including drag-and-drop functionality, image preview, and upload state management.

## What Changes
- Implement upload client methods in api-client package
- Create upload store for managing upload state
- Create DropZone component for drag-and-drop file selection
- Create ImagePreview component for displaying selected images
- Create upload page with upload functionality
- Integrate with backend upload endpoints

## Impact
- Affected specs: `web`
- Affected code:
  - `packages/api-client/src/upload.client.ts` (new)
  - `apps/web/lib/stores/upload-store.ts` (new)
  - `apps/web/components/upload/DropZone.tsx` (new)
  - `apps/web/components/upload/ImagePreview.tsx` (new)
  - `apps/web/app/(dashboard)/upload/page.tsx` (new)

