# Change: Web Gallery

## Why
Enable users to view their uploaded photos in a gallery interface on the web application. This adds a gallery page with photo grid display, pagination, and a modal for viewing individual photos in detail.

## What Changes
- Implement photo client methods in api-client package (including updatePhotoTags)
- Create PhotoGrid component for displaying photos in a grid layout
- Create PhotoModal component for viewing individual photos
- Create TagInput component for adding/editing tags with autocomplete
- Add tag display and editing to PhotoModal
- Create gallery page with React Query for data fetching
- Add pagination controls to gallery
- Add navigation link to gallery in dashboard layout

## Impact
- Affected specs: `web`
- Affected code:
  - `packages/api-client/src/photo.client.ts` (new)
  - `apps/web/components/gallery/PhotoGrid.tsx` (new)
  - `apps/web/components/gallery/PhotoModal.tsx` (new)
  - `apps/web/components/gallery/TagInput.tsx` (new)
  - `apps/web/app/(dashboard)/gallery/page.tsx` (new)
  - `apps/web/app/(dashboard)/layout.tsx` (modified)

