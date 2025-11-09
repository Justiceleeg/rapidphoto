## Note: UI Framework Dependency
**IMPORTANT**: This change should be implemented AFTER `refactor-ui-frameworks` is complete.
- Gallery components should be built using **shadcn/ui** (not Tamagui)
- Components will use Tailwind CSS for styling
- See `refactor-ui-frameworks` change for framework setup details

## 1. API Client
- [ ] 1.1 Implement photo client methods (`packages/api-client/src/photo.client.ts`)
  - `getPhotos(page, limit)` - List photos with pagination
  - `getPhoto(id)` - Get single photo
  - `deletePhoto(id)` - Delete photo
  - `updatePhotoTags(id, tags)` - Update photo tags

## 2. Gallery Components
- [ ] 2.1 Create PhotoGrid component (`apps/web/components/gallery/PhotoGrid.tsx`)
  - Use shadcn/ui components and Tailwind CSS
  - Display photos in a responsive grid layout
  - Handle photo click to open modal
- [ ] 2.2 Create PhotoModal component (`apps/web/components/gallery/PhotoModal.tsx`)
  - Use shadcn/ui Dialog/Modal component
  - Display full-size photo
  - Show photo metadata
  - Close button
- [ ] 2.3 Create TagInput component (`apps/web/components/gallery/TagInput.tsx`)
  - Use shadcn/ui Input component
  - Allow adding/removing tags
  - Autocomplete functionality
- [ ] 2.4 Add tag display and editing to PhotoModal (`apps/web/components/gallery/PhotoModal.tsx`)
  - Use shadcn/ui Badge component for tag chips
  - Display tags as chips/badges
  - Allow editing via TagInput component

## 3. Gallery Page
- [ ] 3.1 Create gallery page (`apps/web/app/(dashboard)/gallery/page.tsx`)
  - Use React Query for data fetching
  - Integrate PhotoGrid component
  - Integrate PhotoModal component
- [ ] 3.2 Add pagination to gallery
  - Previous/Next buttons
  - Page number display
  - Handle page changes

## 4. Navigation
- [ ] 4.1 Add navigation link to gallery in dashboard layout (`apps/web/app/(dashboard)/layout.tsx`)

## 5. Testing
- [ ] 5.1 Test gallery on web (view photos, pagination, modal, navigation)
- [ ] 5.2 Test tag functionality (add tags, remove tags, autocomplete, save changes)

