# Change: Mobile Gallery

## Why
Enable users to view their uploaded photos in a gallery interface on the mobile application. This adds a gallery screen with photo grid display, pull-to-refresh functionality, and a modal viewer for individual photos.

## What Changes
- Create PhotoGrid component for mobile using FlatList with 3 columns
- Create PhotoViewer modal component for viewing individual photos
- Create gallery screen in tabs navigation
- Add pull-to-refresh functionality to gallery
- Integrate with photo client methods from api-client package

## Impact
- Affected specs: `mobile`
- Affected code:
  - `apps/mobile/components/gallery/PhotoGrid.tsx` (new)
  - `apps/mobile/components/gallery/PhotoViewer.tsx` (new)
  - `apps/mobile/app/(tabs)/gallery.tsx` (new)

