## 1. Upload Store Updates
- [ ] 1.1 Update upload store for batch uploads (handle multiple files, track progress per file)
- [ ] 1.2 Add upload job state management to store
- [ ] 1.3 Add progress tracking per photo to store

## 2. Upload Client Updates
- [ ] 2.1 Update upload client to support batch initialization (accept array of photos)
- [ ] 2.2 Add failPhoto method to upload client

## 3. Upload Progress Component
- [ ] 3.1 Create UploadProgress component (`apps/web/components/upload/UploadProgress.tsx`)
- [ ] 3.2 Setup SSE connection in UploadProgress using EventSource
- [ ] 3.3 Display real-time progress updates (completed, failed, total)
- [ ] 3.4 Display progress per photo with status indicators

## 4. Upload Page Updates
- [ ] 4.1 Update upload page to support batch uploads
- [ ] 4.2 Integrate UploadProgress component
- [ ] 4.3 Update DropZone to accept multiple files

## 5. Testing
- [ ] 5.1 Test batch upload on web (10 photos)
- [ ] 5.2 Test batch upload on web (100 photos)
- [ ] 5.3 Verify real-time progress updates work correctly

