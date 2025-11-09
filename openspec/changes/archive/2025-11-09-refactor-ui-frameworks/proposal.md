# Change: Refactor UI Frameworks

## Why
The current UI implementation uses Tamagui across both web and mobile platforms. We want to:
- Use shadcn/ui (base styles) on the web frontend for better React/Next.js integration and a more native web component ecosystem
- Use BNA UI on the mobile app for a more React Native-focused design system
- Improve platform-specific UX by using frameworks optimized for each platform

## What Changes
- **BREAKING**: Replace Tamagui with shadcn/ui on web frontend
- **BREAKING**: Replace Tamagui with BNA UI on mobile app
- Remove Tamagui dependencies from both platforms
- Add Tailwind CSS and shadcn/ui dependencies to web
- Add BNA UI dependencies to mobile
- Refactor all components using Tamagui to use new frameworks
- Update build configuration (remove Tamagui Next.js plugin, add Tailwind)
- Update styling documentation

## Impact
- Affected specs: None (UI framework is implementation detail)
- Affected code:
  - Web: All components in `apps/web/` using Tamagui (12+ files)
  - Mobile: All components in `apps/mobile/` using Tamagui (10+ files)
  - Build config: `apps/web/next.config.ts`, `apps/web/tamagui.config.ts`, `apps/mobile/tamagui.config.ts`
  - Providers: `apps/web/app/providers.tsx`, `apps/mobile/app/_layout.tsx`
  - Documentation: `docs/STYLING.md`

## Dependencies on Other Changes
- **web-gallery** and **mobile-gallery** changes should be implemented AFTER this refactor
  - These changes will create new UI components (PhotoGrid, PhotoModal, TagInput, PhotoViewer)
  - These components should be built with the new frameworks (shadcn/ui for web, BNA UI for mobile) from the start
  - If gallery work is done first, those components would need to be migrated from Tamagui to new frameworks
- **backend-gallery-queries** and **deploy-gallery** are not affected (backend/deployment work)

## Questions to Resolve
- What is BNA UI? (Need to confirm the exact library/package name and installation steps)
- Should we maintain visual consistency between web and mobile, or allow platform-specific designs?
- Do we need to migrate existing theme tokens/colors to the new systems?

