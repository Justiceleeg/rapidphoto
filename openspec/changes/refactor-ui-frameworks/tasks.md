## 1. Research and Setup
- [x] 1.1 Confirm BNA UI library details (package name, installation, documentation)
  - BNA UI: Expo React Native UI library (https://ui.ahmedbna.com)
  - Installation: `pnpm dlx bna-ui init`
  - Documentation: https://ui.ahmedbna.com/docs
- [x] 1.2 Research shadcn/ui setup for Next.js 16 with App Router
  - shadcn/ui is compatible with Next.js 16 and App Router
  - Installation: `npx shadcn@latest init`
  - Tailwind CSS v4.1.17 already installed (may need compatibility check)
  - Path aliases already configured in tsconfig.json
  - PostCSS and autoprefixer already installed
  - Will need to create Tailwind config and update globals.css
- [x] 1.3 Plan component migration strategy (incremental vs big bang)
  - Decision: Incremental migration (page-by-page)
  - Rationale: Reduce risk, test independently, easier rollback
  - Order: Auth pages → Upload functionality → Remaining pages

## 2. Web Frontend - shadcn/ui Setup
- [x] 2.1 Install Tailwind CSS and configure for Next.js
  - Tailwind CSS v4.1.17 already installed
  - PostCSS config created (`postcss.config.mjs`)
  - `globals.css` updated with Tailwind import and theme variables
  - Verified working with test page at `/test`
- [x] 2.2 Initialize shadcn/ui (`npx shadcn@latest init`)
  - `components.json` created with "new-york" style, neutral base color
  - `lib/utils.ts` created with cn utility function
  - `globals.css` updated with shadcn/ui theme variables
- [x] 2.3 Configure `components.json` for project structure
  - Already configured correctly for Next.js App Router
  - Component aliases set to `@/components/ui`
  - Utils alias set to `@/lib/utils`
- [x] 2.4 Add required shadcn/ui base components (Button, Input, Label, Card, etc.)
  - Added Button, Input, Label, and Card components
  - Components added to test page at `/test` for verification
  - All components working correctly
- [x] 2.5 Remove Tamagui dependencies from `apps/web/package.json`
  - Temporarily disabled Tamagui in providers.tsx (commented out)
  - Will remove dependencies after component migration
- [x] 2.6 Remove Tamagui config files (`tamagui.config.ts`)
  - Deleted tamagui.config.ts file
  - No longer needed after migration to shadcn/ui
- [x] 2.7 Update `next.config.ts` to remove Tamagui plugin
  - Removed Tamagui plugin from next.config.ts
  - Switched from webpack to Turbopack (--turbo flag)
  - Updated dev and build scripts to use --turbo
- [x] 2.8 Update `apps/web/app/providers.tsx` to remove TamaguiProvider
  - Temporarily disabled Tamagui provider
  - Replaced with simple div wrapper using Tailwind classes
  - shadcn/ui styles now working correctly

## 3. Web Frontend - Component Migration
- [x] 3.1 Refactor auth pages (`login/page.tsx`, `register/page.tsx`)
  - Migrated login page from Tamagui to shadcn/ui
  - Migrated register page from Tamagui to shadcn/ui
  - Migrated auth layout from Tamagui to Tailwind classes
  - Replaced YStack/XStack with div + flexbox classes
  - Replaced Tamagui Input/Button/Label with shadcn/ui components
  - Updated event handlers (onChangeText → onChange, onPress → onClick)
  - Used Card component for better structure
- [x] 3.2 Refactor dashboard pages (`dashboard/page.tsx`, `dashboard/layout.tsx`)
  - Migrated dashboard page to shadcn/ui Card component
  - Migrated dashboard layout to Tailwind classes with header
  - Replaced YStack/XStack with div + flexbox classes
  - Updated Button components to shadcn/ui
  - Added proper header navigation
- [x] 3.3 Refactor upload page (`(dashboard)/upload/page.tsx`)
  - Migrated upload page from Tamagui to shadcn/ui
  - Replaced YStack with div + Tailwind classes
  - Updated Button components to shadcn/ui
  - Updated event handlers (onPress → onClick)
  - Maintained all upload functionality
- [x] 3.4 Refactor upload components (`DropZone.tsx`, `ImagePreview.tsx`, `UploadProgress.tsx`)
  - Migrated DropZone from Tamagui to Tailwind classes
  - Migrated ImagePreview to shadcn/ui Card and Progress components
  - Migrated UploadProgress to shadcn/ui Card and Progress components
  - Replaced YStack/XStack with div + flexbox classes
  - Replaced Tamagui Image with regular img tag
  - Replaced Tamagui Progress with shadcn/ui Progress component
  - Added Progress component from shadcn/ui
- [x] 3.5 Refactor layout components (`(auth)/layout.tsx`, `page.tsx`)
  - Auth layout already migrated (Task 3.1)
  - Migrated root page.tsx to Tailwind classes
- [ ] 3.6 Test all web pages for visual consistency and functionality

## 4. Mobile App - BNA UI Setup
- [ ] 4.1 Install BNA UI package (confirm exact package name)
- [ ] 4.2 Configure BNA UI theme/provider
- [ ] 4.3 Remove Tamagui dependencies from `apps/mobile/package.json`
- [ ] 4.4 Remove Tamagui config files (`tamagui.config.ts`)
- [ ] 4.5 Update `apps/mobile/app/_layout.tsx` to use BNA UI provider
- [ ] 4.6 Update `babel.config.js` to remove Tamagui babel plugin if needed

## 5. Mobile App - Component Migration
- [ ] 5.1 Refactor auth screens (`(auth)/login/index.tsx`, `(auth)/register/index.tsx`)
- [ ] 5.2 Refactor home screen (`(tabs)/index.tsx`)
- [ ] 5.3 Refactor upload components (`ImagePicker.tsx`, `ImagePreview.tsx`, `UploadProgress.tsx`)
- [ ] 5.4 Refactor layout components (`(tabs)/_layout.tsx`, `(auth)/_layout.tsx`, `index.tsx`)
- [ ] 5.5 Test all mobile screens for visual consistency and functionality

## 6. Documentation and Cleanup
- [ ] 6.1 Update `docs/STYLING.md` with new framework guidelines
- [ ] 6.2 Document shadcn/ui component usage patterns
- [ ] 6.3 Document BNA UI component usage patterns
- [ ] 6.4 Remove any remaining Tamagui references
- [ ] 6.5 Update any README files if they mention Tamagui

## 7. Testing and Validation
- [ ] 7.1 Test web app on multiple browsers
- [ ] 7.2 Test mobile app on iOS and Android
- [ ] 7.3 Verify all existing functionality still works
- [ ] 7.4 Check for any visual regressions
- [ ] 7.5 Verify responsive design on web
- [ ] 7.6 Test dark mode if applicable

