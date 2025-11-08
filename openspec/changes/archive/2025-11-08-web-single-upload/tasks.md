## 1. API Client
- [x] 1.1 Implement upload client methods (`packages/api-client/src/upload.client.ts`)
- [x] 1.2 Add initUpload method
- [x] 1.3 Add completePhoto method

## 2. Upload Store
- [x] 2.1 Create basic upload store (`apps/web/lib/stores/upload-store.ts`)
- [x] 2.2 Add state for selected file
- [x] 2.3 Add upload state management (pending, uploading, completed, error)
- [x] 2.4 Add upload methods (initUpload, uploadToR2, completeUpload)

## 3. Upload Components
- [x] 3.1 Create DropZone component (`apps/web/components/upload/DropZone.tsx`)
- [x] 3.2 Install react-dropzone if needed
- [x] 3.3 Create ImagePreview component (`apps/web/components/upload/ImagePreview.tsx`)

## 4. Upload Page
- [x] 4.1 Create upload page (`apps/web/app/dashboard/upload/page.tsx`)
- [x] 4.2 Integrate DropZone and ImagePreview components
- [x] 4.3 Connect upload store to page
- [x] 4.4 Add upload button and state display
- [x] 4.5 Test single photo upload on web

