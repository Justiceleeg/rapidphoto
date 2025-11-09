# Change: Mobile Batch Upload & Progress

## Why
Enable users to upload multiple photos (up to 100) simultaneously from the mobile application with real-time progress tracking. This extends the single photo upload functionality to support batch operations, including multiple photo selection, progress tracking per file, and real-time updates via Server-Sent Events on React Native.

## What Changes
- Update upload store to handle multiple files and track progress per file
- Update ImagePicker component to support multiple photo selection
- Create UploadProgress component for mobile with real-time progress display
- Setup SSE connection in UploadProgress component (using EventSource polyfill or fetch-based SSE)
- Update upload screen to support batch uploads

## Impact
- Affected specs: `mobile`
- Affected code:
  - `apps/mobile/lib/stores/upload-store.ts` (modified)
  - `apps/mobile/components/upload/ImagePicker.tsx` (modified)
  - `apps/mobile/components/upload/UploadProgress.tsx` (new)
  - `apps/mobile/app/(tabs)/index.tsx` (modified)

