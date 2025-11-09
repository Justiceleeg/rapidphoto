## Note: UI Framework Dependency
**IMPORTANT**: This change should be implemented AFTER `refactor-ui-frameworks` is complete.
- Gallery components should be built using **BNA UI** (not Tamagui)
- See `refactor-ui-frameworks` change for framework setup details

## 1. Gallery Components
- [ ] 1.1 Create PhotoGrid component for mobile (`apps/mobile/components/gallery/PhotoGrid.tsx`)
  - Use BNA UI components
  - Use FlatList with 3 columns
  - Display photo thumbnails
  - Handle photo press to open viewer
- [ ] 1.2 Create PhotoViewer modal component (`apps/mobile/components/gallery/PhotoViewer.tsx`)
  - Use BNA UI Modal component
  - Display full-size photo
  - Show photo metadata
  - Display tags as chips/badges (using BNA UI Badge/Chip components)
  - Close button

## 2. Gallery Screen
- [ ] 2.1 Create gallery screen (`apps/mobile/app/(tabs)/gallery.tsx`)
  - Use React Query for data fetching
  - Integrate PhotoGrid component
  - Integrate PhotoViewer component
- [ ] 2.2 Add pull-to-refresh functionality
  - Refresh photo list on pull down
  - Show refresh indicator

## 3. Testing
- [ ] 3.1 Test gallery on mobile (view photos, pull-to-refresh, modal viewer)
- [ ] 3.2 Test tag display in PhotoViewer (tags shown as chips/badges)

