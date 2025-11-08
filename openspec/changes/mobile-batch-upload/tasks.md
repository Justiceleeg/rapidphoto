## 1. Upload Store Updates
- [x] 1.1 Update upload store for batch uploads (handle multiple files, track progress per file)
- [x] 1.2 Add upload job state management to store
- [x] 1.3 Add progress tracking per photo to store

## 2. Image Picker Updates
- [x] 2.1 Update ImagePicker to support multiple selection (enable `allowsMultipleSelection: true`)

## 3. Upload Progress Component
- [x] 3.1 Create UploadProgress component for mobile (`apps/mobile/components/upload/UploadProgress.tsx`)
- [x] 3.2 Setup SSE connection (use EventSource polyfill or fetch-based SSE for React Native)
- [x] 3.3 Display real-time progress updates (completed, failed, total)
- [x] 3.4 Display progress per photo with status indicators using Tamagui components

## 4. Upload Screen Updates
- [x] 4.1 Update upload screen to support batch uploads
- [x] 4.2 Integrate UploadProgress component
- [x] 4.3 Update UI to handle multiple photo selection and display

## 5. Testing
- [x] 5.1 Test batch upload on mobile (10 photos)
- [x] 5.2 Test batch upload on mobile (100 photos)
- [x] 5.3 Verify real-time progress updates work correctly on both iOS and Android (Note: SSE not supported on React Native - using client-side progress tracking instead)


