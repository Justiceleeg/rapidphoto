## 1. Upload Store Updates
- [ ] 1.1 Update upload store for batch uploads (handle multiple files, track progress per file)
- [ ] 1.2 Add upload job state management to store
- [ ] 1.3 Add progress tracking per photo to store

## 2. Image Picker Updates
- [ ] 2.1 Update ImagePicker to support multiple selection (enable `allowsMultipleSelection: true`)

## 3. Upload Progress Component
- [ ] 3.1 Create UploadProgress component for mobile (`apps/mobile/components/upload/UploadProgress.tsx`)
- [ ] 3.2 Setup SSE connection (use EventSource polyfill or fetch-based SSE for React Native)
- [ ] 3.3 Display real-time progress updates (completed, failed, total)
- [ ] 3.4 Display progress per photo with status indicators using Tamagui components

## 4. Upload Screen Updates
- [ ] 4.1 Update upload screen to support batch uploads
- [ ] 4.2 Integrate UploadProgress component
- [ ] 4.3 Update UI to handle multiple photo selection and display

## 5. Testing
- [ ] 5.1 Test batch upload on mobile (10 photos)
- [ ] 5.2 Test batch upload on mobile (100 photos)
- [ ] 5.3 Verify real-time progress updates work correctly on both iOS and Android

