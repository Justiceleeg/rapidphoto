## 1. Research and Setup
- [ ] 1.1 Confirm BNA UI library details (package name, installation, documentation)
- [ ] 1.2 Research shadcn/ui setup for Next.js 16 with App Router
- [ ] 1.3 Plan component migration strategy (incremental vs big bang)

## 2. Web Frontend - shadcn/ui Setup
- [ ] 2.1 Install Tailwind CSS and configure for Next.js
- [ ] 2.2 Initialize shadcn/ui (`npx shadcn@latest init`)
- [ ] 2.3 Configure `components.json` for project structure
- [ ] 2.4 Add required shadcn/ui base components (Button, Input, Label, Card, etc.)
- [ ] 2.5 Remove Tamagui dependencies from `apps/web/package.json`
- [ ] 2.6 Remove Tamagui config files (`tamagui.config.ts`)
- [ ] 2.7 Update `next.config.ts` to remove Tamagui plugin
- [ ] 2.8 Update `apps/web/app/providers.tsx` to remove TamaguiProvider

## 3. Web Frontend - Component Migration
- [ ] 3.1 Refactor auth pages (`login/page.tsx`, `register/page.tsx`)
- [ ] 3.2 Refactor dashboard pages (`dashboard/page.tsx`, `dashboard/layout.tsx`)
- [ ] 3.3 Refactor upload page (`(dashboard)/upload/page.tsx`)
- [ ] 3.4 Refactor upload components (`DropZone.tsx`, `ImagePreview.tsx`, `UploadProgress.tsx`)
- [ ] 3.5 Refactor layout components (`(auth)/layout.tsx`, `page.tsx`)
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

