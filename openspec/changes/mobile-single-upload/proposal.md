# Change: Mobile Single Photo Upload

## Why
Enable users to upload a single photo from the mobile application. This provides the mobile interface for photo uploads, including image picker functionality, preview, and upload state management using React Native and Expo.

## What Changes
- Create tabs layout for mobile navigation
- Install and configure image picker dependencies
- Create ImagePicker component for selecting photos from device
- Create ImagePreview component for mobile
- Create upload store for mobile with FileSystem integration
- Create upload screen with upload functionality
- Adapt upload logic for mobile using expo-file-system

## Impact
- Affected specs: `mobile`
- Affected code:
  - `apps/mobile/app/(tabs)/_layout.tsx` (new)
  - `apps/mobile/components/upload/ImagePicker.tsx` (new)
  - `apps/mobile/components/upload/ImagePreview.tsx` (new)
  - `apps/mobile/lib/stores/upload-store.ts` (new)
  - `apps/mobile/app/(tabs)/index.tsx` (modified)

