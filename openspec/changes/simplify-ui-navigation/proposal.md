# Change: Simplify UI & Navigation

## Why
The current UI has unnecessary complexity with separate dashboard, upload, and gallery pages. Users should be able to access their gallery immediately after login, and upload photos directly from the gallery view. The navigation structure is overly complex for a photo management app. By simplifying the UI to make the gallery the main (and only) page, we reduce cognitive load and make the app more intuitive. Adding drag-and-drop upload and a signout button improves the user experience by making common actions more accessible.

## What Changes
- Remove dashboard layout and separate upload page (web)
- Move gallery to root page (`/`) on web
- Remove upload tab from mobile navigation
- Add header with username, photo count, upload button, and signout button (web and mobile)
- Add drag-and-drop upload functionality to gallery page (web)
- Update auth redirects to navigate to gallery (root) instead of dashboard
- Simplify navigation structure to single-page experience

## Impact
- **Affected specs**: web, mobile
- **Affected code**:
  - Web: Remove `apps/web/app/(dashboard)/layout.tsx`, `apps/web/app/(dashboard)/upload/page.tsx`, move gallery to `apps/web/app/page.tsx`, update `apps/web/app/layout.tsx` with header, add drag-and-drop to gallery
  - Mobile: Update `apps/mobile/app/(tabs)/_layout.tsx` to remove upload tab, update `apps/mobile/app/(tabs)/gallery.tsx` with header
  - Auth: Update login/register redirects in both web and mobile
- **Infrastructure**: No new infrastructure required
- **Performance**: No performance impact (simplified routing may improve initial load)
- **User Experience**: Simplified navigation reduces friction, drag-and-drop makes uploads more intuitive, signout button improves accessibility
- **Breaking Changes**: **BREAKING** - Removes `/dashboard` and `/dashboard/upload` routes on web, removes upload tab on mobile

