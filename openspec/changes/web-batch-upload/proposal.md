# Change: Web Batch Upload & Progress

## Why
Enable users to upload multiple photos (up to 100) simultaneously from the web application with real-time progress tracking. This extends the single photo upload functionality to support batch operations, including multiple file selection, progress tracking per file, and real-time updates via Server-Sent Events.

## What Changes
- Update upload store to handle multiple files and track progress per file
- Update upload client to support batch operations and add failPhoto method
- Create UploadProgress component for displaying real-time upload progress
- Setup SSE connection in UploadProgress component using EventSource
- Update upload page to support batch uploads
- Update DropZone component to accept multiple files

## Impact
- Affected specs: `web`
- Affected code:
  - `apps/web/lib/stores/upload-store.ts` (modified)
  - `packages/api-client/src/upload.client.ts` (modified)
  - `apps/web/components/upload/UploadProgress.tsx` (new)
  - `apps/web/app/(dashboard)/upload/page.tsx` (modified)
  - `apps/web/components/upload/DropZone.tsx` (modified)

