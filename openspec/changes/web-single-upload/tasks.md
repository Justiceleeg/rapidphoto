## 1. API Client
- [ ] 1.1 Implement upload client methods (`packages/api-client/src/upload.client.ts`)
- [ ] 1.2 Add initUpload method
- [ ] 1.3 Add completePhoto method

## 2. Upload Store
- [ ] 2.1 Create basic upload store (`apps/web/lib/stores/upload-store.ts`)
- [ ] 2.2 Add state for selected file
- [ ] 2.3 Add upload state management (pending, uploading, completed, error)
- [ ] 2.4 Add upload methods (initUpload, uploadToR2, completeUpload)

## 3. Upload Components
- [ ] 3.1 Create DropZone component (`apps/web/components/upload/DropZone.tsx`)
- [ ] 3.2 Install react-dropzone if needed
- [ ] 3.3 Create ImagePreview component (`apps/web/components/upload/ImagePreview.tsx`)

## 4. Upload Page
- [ ] 4.1 Create upload page (`apps/web/app/(dashboard)/upload/page.tsx`)
- [ ] 4.2 Integrate DropZone and ImagePreview components
- [ ] 4.3 Connect upload store to page
- [ ] 4.4 Add upload button and state display
- [ ] 4.5 Test single photo upload on web

