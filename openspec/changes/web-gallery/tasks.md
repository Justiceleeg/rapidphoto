## 1. API Client
- [ ] 1.1 Implement photo client methods (`packages/api-client/src/photo.client.ts`)
  - `getPhotos(page, limit)` - List photos with pagination
  - `getPhoto(id)` - Get single photo
  - `deletePhoto(id)` - Delete photo

## 2. Gallery Components
- [ ] 2.1 Create PhotoGrid component (`apps/web/components/gallery/PhotoGrid.tsx`)
  - Display photos in a responsive grid layout
  - Handle photo click to open modal
- [ ] 2.2 Create PhotoModal component (`apps/web/components/gallery/PhotoModal.tsx`)
  - Display full-size photo
  - Show photo metadata
  - Close button

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

