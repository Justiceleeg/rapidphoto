## 1. Web Frontend - UI Cleanup
- [x] 1.1 Remove dashboard layout and routing (`apps/web/app/(dashboard)/layout.tsx`, `apps/web/app/(dashboard)/upload/page.tsx`)
- [x] 1.2 Move gallery to root page (`apps/web/app/(dashboard)/gallery/page.tsx` → `apps/web/app/page.tsx`)
- [x] 1.3 Create simplified root layout with header (`apps/web/app/layout.tsx` - add header with username, photo count, upload button, signout button)
- [x] 1.4 Add drag-and-drop upload to gallery (`apps/web/app/page.tsx` - use react-dropzone or native drag-and-drop API)
- [x] 1.5 Add upload button to header (opens file picker, triggers upload flow)
- [x] 1.6 Add signout button to header (calls signout function, redirects to login)
- [x] 1.7 Update auth redirects (`apps/web/app/(auth)/login/page.tsx`, `apps/web/app/(auth)/register/page.tsx` - redirect to `/` instead of `/dashboard`)
- [x] 1.8 Test simplified UI on web (verify gallery is root page, drag-and-drop works, upload button works, signout button works, no dashboard/upload pages accessible)

## 2. Mobile Frontend - UI Cleanup
- [x] 2.1 Remove upload tab and simplify navigation (`apps/mobile/app/(tabs)/_layout.tsx` - remove upload tab, make gallery default)
- [x] 2.2 Add header with username and signout to gallery screen (`apps/mobile/app/(tabs)/gallery.tsx` - add header with username, signout button, photo count, upload button)
- [x] 2.3 Add upload button to gallery header (opens image picker, triggers upload flow)
- [x] 2.4 Add signout button to gallery header (calls signout function, navigates to login)
- [x] 2.5 Update auth navigation (`apps/mobile/app/(auth)/login.tsx`, `apps/mobile/app/(auth)/register.tsx` - navigate to gallery tab after login)
- [x] 2.6 Test simplified UI on mobile (verify gallery is main screen, upload button works, signout button works, no upload tab, test on iOS and Android)

## 3. Deploy UI Cleanup
- [x] 3.1 Redeploy web with simplified UI (push changes, verify Railway auto-deploys)
- [x] 3.2 Test simplified UI in production (web) (verify gallery is root page, drag-and-drop upload, upload button, signout button, header displays correctly)
- [x] 3.3 Test simplified UI in production (mobile) (verify gallery is main screen, upload button, signout button, header displays correctly, test on iOS and Android)

