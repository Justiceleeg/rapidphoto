## 1. Upload Store Updates
- [x] 1.1 Update upload store for batch uploads (handle multiple files, track progress per file)
- [x] 1.2 Add upload job state management to store
- [x] 1.3 Add progress tracking per photo to store

## 2. Upload Client Updates
- [x] 2.1 Update upload client to support batch initialization (accept array of photos)
- [x] 2.2 Add failPhoto method to upload client

## 3. Upload Progress Component
- [x] 3.1 Create UploadProgress component (`apps/web/components/upload/UploadProgress.tsx`)
- [x] 3.2 Setup SSE connection in UploadProgress using EventSource
- [x] 3.3 Display real-time progress updates (completed, failed, total)
- [x] 3.4 Display progress per photo with status indicators

## 4. Upload Page Updates
- [x] 4.1 Update upload page to support batch uploads
- [x] 4.2 Integrate UploadProgress component
- [x] 4.3 Update DropZone to accept multiple files

## 5. Testing
- [x] 5.1 Test batch upload on web (10 photos)
- [x] 5.2 Test batch upload on web (100 photos)
- [x] 5.3 Verify real-time progress updates work correctly

