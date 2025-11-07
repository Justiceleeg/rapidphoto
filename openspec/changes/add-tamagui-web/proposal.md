# Change: Add Tamagui to Web Application

## Why
Replace Tailwind CSS with Tamagui as the component library for the web application to enable a unified design system across web and mobile platforms. Tamagui provides a single component library that works seamlessly on both Next.js (web) and React Native (mobile), ensuring consistent UI/UX and reducing maintenance overhead.

## What Changes
- Install and configure Tamagui v1.136.1 (or latest v1.x) for Next.js
- Setup TamaguiProvider in root layout
- Remove Tailwind CSS dependencies and configuration
- Refactor existing authentication pages (login, register) to use Tamagui components
- Refactor dashboard layout to use Tamagui components
- Remove Tailwind CSS imports and classes from existing components

## Impact
- Affected specs: web (MODIFIED - component library requirement)
- Affected code: 
  - `apps/web/` - Tamagui configuration, provider setup, component refactoring
  - `apps/web/tamagui.config.ts` - New Tamagui configuration file
  - `apps/web/next.config.ts` - Updated with Tamagui Vite plugin
  - `apps/web/app/layout.tsx` - Updated with TamaguiProvider
  - `apps/web/app/(auth)/login/page.tsx` - Refactored to use Tamagui
  - `apps/web/app/(auth)/register/page.tsx` - Refactored to use Tamagui
  - `apps/web/app/(dashboard)/layout.tsx` - Refactored to use Tamagui
  - `apps/web/app/globals.css` - Removed Tailwind directives
  - Removed: `tailwind.config.js`, Tailwind CSS dependencies

