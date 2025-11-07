# RapidPhotoUpload - Implementation Task List (Vertical Slices)

## Quick Reference

**Project**: High-performance photo upload system with web and mobile clients  
**Timeline**: 5 days  
**Approach**: Vertical development (end-to-end features)  
**Status**: Not Started (0/325 tasks)

### Tech Stack Summary
- **Backend**: Hono + TypeScript, PostgreSQL, Drizzle ORM, Better-Auth, Cloudflare R2
- **Web**: Next.js 15, React Query, Zustand, Tamagui
- **Mobile**: React Native + Expo, React Query, Zustand, Tamagui
- **Deployment**: Railway (Full stack)
- **Monorepo**: pnpm workspace

### Vertical Slices Overview
- **Slice 0**: Foundation & Infrastructure (2-3 hours) - 18 tasks
- **Slice 1**: Authentication (Backend + Web + Mobile + Deploy) (4-5 hours) - 54 tasks
- **Slice 2**: Single Photo Upload (Backend + Web + Mobile + Deploy) (6-7 hours) - 65 tasks
- **Slice 3**: Multiple Photo Upload with Progress (Backend + Web + Mobile + Deploy) (6-7 hours) - 75 tasks
- **Slice 4**: Gallery (Backend + Web + Mobile + Deploy) (4-5 hours) - 50 tasks
- **Slice 5**: Polish, Testing & Optimization (4-5 hours) - 72 tasks

---

## Slice 0: Foundation & Infrastructure

**Goal**: Setup monorepo, shared packages, and basic infrastructure  
**Time**: 2-3 hours  
**Verification**: All packages build, monorepo scripts work

### Chunk 0.1: Monorepo Setup

**Prerequisites**: None

- **[S0-01]** Create GitHub repository
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: None

- **[S0-02]** Initialize monorepo structure
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-01]
  - **Commands**: `mkdir rapidphoto && cd rapidphoto && pnpm init`
  - **File**: `package.json`

- **[S0-03]** Create `pnpm-workspace.yaml`
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **File**: `pnpm-workspace.yaml`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#pnpm-workspace)

- **[S0-04]** Setup root folder structure
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Structure**:
    ```
    rapidphoto/
    ├── apps/
    ├── packages/
    ├── .github/
    └── package.json
    ```

- **[S0-05]** Create root `package.json` with workspace scripts
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **File**: `package.json`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#root-package-json)

- **[S0-06]** Setup comprehensive `.gitignore`
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **File**: `.gitignore`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#gitignore)

- **[S0-07]** Create `.env.example` file
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **File**: `.env.example`

**Verification**: Run `pnpm install` and verify workspace structure

### Chunk 0.2: Shared Package

**Prerequisites**: [S0-02]

- **[S0-08]** Initialize `packages/shared`
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Commands**: `cd packages/shared && pnpm init`

- **[S0-09]** Install shared dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-08]
  - **Commands**: `pnpm add zod && pnpm add -D typescript @types/node`

- **[S0-10]** Setup `tsconfig.json` for shared
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-09]
  - **File**: `packages/shared/tsconfig.json`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#shared-tsconfig)

- **[S0-11]** Create shared folder structure
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-08]
  - **Structure**:
    ```
    packages/shared/
    ├── src/
    │   ├── types/
    │   ├── validation/
    │   ├── constants/
    │   └── utils/
    └── package.json
    ```

- **[S0-12]** Create initial type definitions
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S0-11]
  - **Files**:
    - `src/types/user.types.ts`
    - `src/types/photo.types.ts`
    - `src/types/upload.types.ts`

- **[S0-13]** Create validation schemas
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S0-12]
  - **Files**:
    - `src/validation/photo.validation.ts`
    - `src/validation/upload.validation.ts`

- **[S0-14]** Create constants
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S0-11]
  - **Files**:
    - `src/constants/upload.constants.ts` (max file size, allowed types)
    - `src/constants/api.constants.ts` (API routes)

**Verification**: Build shared package: `pnpm --filter @rapidphoto/shared build`

### Chunk 0.3: API Client Package

**Prerequisites**: [S0-02], [S0-12]

- **[S0-15]** Initialize `packages/api-client`
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Commands**: `cd packages/api-client && pnpm init`

- **[S0-16]** Install api-client dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-15]
  - **Commands**: `pnpm add @rapidphoto/shared && pnpm add -D typescript @types/node`

- **[S0-17]** Setup `tsconfig.json` for api-client
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-16]
  - **File**: `packages/api-client/tsconfig.json`

- **[S0-18]** Create base client structure
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S0-17]
  - **Structure**:
    ```
    packages/api-client/
    ├── src/
    │   ├── client.ts (base fetch wrapper)
    │   ├── auth.client.ts
    │   ├── upload.client.ts
    │   └── photo.client.ts
    └── package.json
    ```

**Verification**: Build api-client package: `pnpm --filter @rapidphoto/api-client build`

---

## Slice 1: Authentication (Backend + Web + Mobile + Deploy)

**Goal**: Complete authentication flow across all platforms, deploy to production  
**Time**: 4-5 hours  
**Verification**: Users can register/login on web and mobile, deployed and accessible

### Chunk 1.1: Backend API Setup

**Prerequisites**: [S0-02]

- **[S1-01]** Initialize Hono project
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Commands**: `cd apps/api && pnpm init`

- **[S1-02]** Install core dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **Commands**: `pnpm add hono @hono/node-server drizzle-orm postgres better-auth @rapidphoto/shared`

- **[S1-03]** Install dev dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **Commands**: `pnpm add -D drizzle-kit tsx @types/node typescript`

- **[S1-04]** Create basic Hono app
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-02]
  - **File**: `apps/api/src/index.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#basic-hono-app)

- **[S1-05]** Setup DDD folder structure
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **Structure**:
    ```
    apps/api/src/
    ├── domain/
    ├── application/
    ├── infrastructure/
    │   ├── database/
    │   ├── auth/
    │   └── http/
    └── index.ts
    ```

- **[S1-06]** Configure environment variables
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **File**: `apps/api/.env`
  - **Variables**: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`

- **[S1-07]** Setup `package.json` scripts
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **File**: `apps/api/package.json`
  - **Scripts**: `dev`, `build`, `start`, `db:generate`, `db:migrate`

**Verification**: API runs: `pnpm dev:api` → `http://localhost:4000/health` returns `{status: 'ok'}`

### Chunk 1.2: Database & Auth Setup

**Prerequisites**: [S1-04]

- **[S1-08]** Create Railway account and project
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: None
  - **URL**: [railway.app](https://railway.app)

- **[S1-09]** Add PostgreSQL database to Railway
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-08]
  - **Action**: Click "New" → "Database" → "Add PostgreSQL"

- **[S1-10]** Copy `DATABASE_URL` from Railway to `.env`
  - **Time**: 2 min | **Complexity**: Low
  - **Dependencies**: [S1-09]

- **[S1-11]** Create Drizzle schema with users table
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-05]
  - **File**: `apps/api/src/infrastructure/database/schema.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#drizzle-schema) (users table only)

- **[S1-12]** Create database connection
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-11]
  - **File**: `apps/api/src/infrastructure/database/connection.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#database-connection)

- **[S1-13]** Create `drizzle.config.ts`
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-11]
  - **File**: `apps/api/drizzle.config.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#drizzle-config)

- **[S1-14]** Generate and apply initial migration
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-13]
  - **Commands**: `pnpm db:generate && pnpm db:migrate`

- **[S1-15]** Verify tables created in Railway dashboard
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-14]

- **[S1-16]** Configure Better-Auth
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-12]
  - **File**: `apps/api/src/infrastructure/auth/better-auth.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#better-auth-setup)

- **[S1-17]** Create auth routes
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-16]
  - **File**: `apps/api/src/infrastructure/http/routes/auth.routes.ts`
  - **Endpoints**: `/signup`, `/signin`, `/signout`, `/session`

- **[S1-18]** Create auth middleware
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-16]
  - **File**: `apps/api/src/infrastructure/auth/auth.middleware.ts`

- **[S1-19]** Mount auth routes in main app
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-17], [S1-04]
  - **File**: `apps/api/src/index.ts`
  - **Action**: Add `app.route('/api/auth', authRoutes)`

- **[S1-20]** Test auth endpoints
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-19]
  - **Tests**: Signup, signin, protected route

**Verification**: Can register/login via API, session works

### Chunk 1.3: Web Frontend - Auth

**Prerequisites**: [S1-19], [S0-18]

- **[S1-21]** Initialize Next.js 15 project
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Commands**: `cd apps && pnpx create-next-app@latest web --typescript --tailwind --app --no-src-dir`

- **[S1-22]** Configure for monorepo
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-21]
  - **Actions**: Update `package.json` name to `@rapidphoto/web`, add workspace deps

- **[S1-23]** Install web dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-22]
  - **Commands**: `pnpm add @tanstack/react-query zustand better-auth @rapidphoto/shared @rapidphoto/api-client sonner`

- **[S1-24]** Setup environment variables
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-21]
  - **File**: `apps/web/.env.local`
  - **Variables**: `NEXT_PUBLIC_API_URL=http://localhost:4000`

- **[S1-25]** Update `next.config.js` for monorepo
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-22]
  - **File**: `apps/web/next.config.js`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#next-config)

- **[S1-26]** Create React Query providers
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-23]
  - **File**: `apps/web/app/providers.tsx`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#react-query-providers)

- **[S1-27]** Wrap root layout with providers
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-26]
  - **File**: `apps/web/app/layout.tsx`

- **[S1-28]** Create auth client
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-23]
  - **File**: `apps/web/lib/auth-client.ts`

- **[S1-29]** Create auth hooks
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-28]
  - **File**: `apps/web/lib/hooks/use-auth.ts`

- **[S1-30]** Implement base API client
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S0-18]
  - **File**: `packages/api-client/src/client.ts`

- **[S1-31]** Implement auth client methods
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-30]
  - **File**: `packages/api-client/src/auth.client.ts`

- **[S1-32]** Create auth layout
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-21]
  - **File**: `apps/web/app/(auth)/layout.tsx`

- **[S1-33]** Create login page
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-29], [S1-32]
  - **File**: `apps/web/app/(auth)/login/page.tsx`

- **[S1-34]** Create register page
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-29], [S1-32]
  - **File**: `apps/web/app/(auth)/register/page.tsx`

- **[S1-35]** Create dashboard layout with auth guard
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-29]
  - **File**: `apps/web/app/(dashboard)/layout.tsx`

**Verification**: Can register/login on web, redirects to dashboard

### Chunk 1.3.5: Web Frontend - Tamagui Setup

**Prerequisites**: [S1-35]

- **[S1-36]** Install Tamagui dependencies for web
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-22]
  - **Commands**: `pnpm add @tamagui/core @tamagui/config @tamagui/vite-plugin @tamagui/animations-react-native`
  - **Note**: Use Tamagui v1.136.1 or latest v1.x

- **[S1-37]** Configure Tamagui for Next.js
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-36]
  - **Files**: 
    - `apps/web/tamagui.config.ts`
    - `apps/web/next.config.ts` (update to include Tamagui plugin)
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#tamagui-config)

- **[S1-38]** Setup Tamagui provider in root layout
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-37]
  - **File**: `apps/web/app/layout.tsx`
  - **Note**: Wrap app with TamaguiProvider

- **[S1-39]** Remove Tailwind CSS dependencies
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-37]
  - **Commands**: `pnpm remove tailwindcss postcss autoprefixer`
  - **Files**: Remove `tailwind.config.js`, `postcss.config.mjs` (or update to remove Tailwind)

- **[S1-40]** Remove Tailwind CSS imports and classes
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-39]
  - **Files**: 
    - `apps/web/app/globals.css` (remove Tailwind directives)
    - Update any existing components with Tailwind classes

- **[S1-41]** Refactor login page to use Tamagui components
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-38]
  - **File**: `apps/web/app/(auth)/login/page.tsx`
  - **Note**: Replace HTML/Tailwind with Tamagui components (Button, Input, YStack, etc.)

- **[S1-42]** Refactor register page to use Tamagui components
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-38]
  - **File**: `apps/web/app/(auth)/register/page.tsx`
  - **Note**: Replace HTML/Tailwind with Tamagui components

- **[S1-43]** Refactor dashboard layout to use Tamagui components
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-38]
  - **File**: `apps/web/app/(dashboard)/layout.tsx`
  - **Note**: Replace HTML/Tailwind with Tamagui components

**Verification**: Web app uses Tamagui, Tailwind removed, auth pages styled with Tamagui

### Chunk 1.4: Mobile Frontend - Auth

**Prerequisites**: [S1-19], [S0-18]

- **[S1-44]** Initialize Expo project
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S0-02]
  - **Commands**: `cd apps && pnpx create-expo-app@latest mobile --template blank-typescript`

- **[S1-45]** Configure for monorepo
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-44]
  - **Actions**: Update `package.json` name to `@rapidphoto/mobile`

- **[S1-46]** Install mobile dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-45]
  - **Commands**: `pnpm add expo-router @tanstack/react-query zustand better-auth @rapidphoto/shared @rapidphoto/api-client`

- **[S1-47]** Install and configure Tamagui for mobile
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-46]
  - **Commands**: `pnpm add @tamagui/core @tamagui/config @tamagui/animations-react-native react-native-reanimated`
  - **Files**: 
    - `apps/mobile/tamagui.config.ts` (can share config with web)
    - `apps/mobile/app/_layout.tsx` (add TamaguiProvider)
  - **Note**: Use Tamagui v1.136.1 or latest v1.x, configure for React Native

- **[S1-48]** Configure Expo Router
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-47]
  - **File**: `apps/mobile/app.json`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#expo-config)

- **[S1-49]** Setup environment variables
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-44]
  - **File**: `apps/mobile/.env`
  - **Variables**: `EXPO_PUBLIC_API_URL=http://localhost:4000`

- **[S1-50]** Create root layout with React Query and Tamagui
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-47]
  - **File**: `apps/mobile/app/_layout.tsx`
  - **Note**: Ensure TamaguiProvider wraps React Query provider

- **[S1-51]** Create auth stack layout
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-48]
  - **File**: `apps/mobile/app/(auth)/_layout.tsx`

- **[S1-52]** Create auth client for mobile
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-46]
  - **File**: `apps/mobile/lib/auth-client.ts`

- **[S1-53]** Create login screen with Tamagui
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-52], [S1-51]
  - **File**: `apps/mobile/app/(auth)/login.tsx`
  - **Note**: Use Tamagui components for unified experience with web

- **[S1-54]** Create register screen with Tamagui
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-52], [S1-51]
  - **File**: `apps/mobile/app/(auth)/register.tsx`
  - **Note**: Use Tamagui components for unified experience with web

**Verification**: Can register/login on mobile, navigates to tabs

### Chunk 1.5: Deploy Authentication

**Prerequisites**: [S1-43], [S1-54]

- **[S1-57]** Deploy API to Railway
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-19]
  - **Steps**:
    1. Add API service to Railway project
    2. Set root directory: `apps/api`
    3. Set build: `pnpm install && pnpm --filter @rapidphoto/api build`
    4. Set start: `pnpm --filter @rapidphoto/api start`
    5. Configure env vars (DATABASE_URL, JWT_SECRET, NODE_ENV)
    6. Run migrations: `pnpm --filter @rapidphoto/api db:migrate`
    7. Test: `https://your-api.railway.app/health`

- **[S1-58]** Deploy Web to Railway
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-43], [S1-57]
  - **Steps**:
    1. Add web service to Railway project
    2. Set root directory: `apps/web`
    3. Set build: `pnpm install && pnpm --filter @rapidphoto/web build`
    4. Set start: `pnpm --filter @rapidphoto/web start`
    5. Configure env: `NEXT_PUBLIC_API_URL=https://your-api.railway.app`
    6. Test: Visit web URL, test login

- **[S1-59]** Update mobile to use production API
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-57]
  - **File**: `apps/mobile/.env`
  - **Action**: Update `EXPO_PUBLIC_API_URL` to production API URL

- **[S1-60]** Test authentication in production
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-58], [S1-59]
  - **Tests**:
    - Register new user on web
    - Login on web
    - Register new user on mobile
    - Login on mobile
    - Verify sessions persist

**Verification**: ✅ Authentication works in production on web and mobile

---

## Slice 2: Single Photo Upload (Backend + Web + Mobile + Deploy)

**Goal**: Upload a single photo end-to-end on all platforms  
**Time**: 6-7 hours  
**Verification**: Can upload one photo from web and mobile, stored in R2, visible in database

### Chunk 2.1: Backend - Single Upload

**Prerequisites**: [S1-19]

- **[S2-01]** Setup Cloudflare R2
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: None
  - **Steps**:
    1. Create Cloudflare account
    2. Create R2 bucket (`rapidphoto-uploads`)
    3. Generate API tokens
    4. Add credentials to `.env`

- **[S2-02]** Create R2 service
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-01]
  - **File**: `apps/api/src/infrastructure/storage/r2.service.ts`
  - **Content**: See [CODE_REFERENCE.md](./CODE_REFERENCE.md#r2-service)

- **[S2-03]** Test presigned URL generation
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-02]

- **[S2-04]** Create Photo entity
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-05]
  - **File**: `apps/api/src/domain/photo/photo.entity.ts`

- **[S2-05]** Create Photo repository interface
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/domain/photo/photo.repository.ts`

- **[S2-06]** Update Drizzle schema with photos table
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-11]
  - **File**: `apps/api/src/infrastructure/database/schema.ts`

- **[S2-07]** Generate and apply photos migration
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-06]
  - **Commands**: `pnpm db:generate && pnpm db:migrate`

- **[S2-08]** Implement Photo repository
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-05], [S2-06]
  - **File**: `apps/api/src/infrastructure/database/repositories/photo.repository.impl.ts`

- **[S2-09]** Create InitUploadCommand DTO
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/application/commands/init-upload/init-upload.command.ts`

- **[S2-10]** Create InitUploadHandler (single photo)
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S2-08], [S2-02], [S2-09]
  - **File**: `apps/api/src/application/commands/init-upload/init-upload.handler.ts`
  - **Note**: Simplified for single photo initially

- **[S2-11]** Create CompletePhotoCommand DTO
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/application/commands/complete-photo/complete-photo.command.ts`

- **[S2-12]** Create CompletePhotoHandler
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-08], [S2-11]
  - **File**: `apps/api/src/application/commands/complete-photo/complete-photo.handler.ts`

- **[S2-13]** Create upload routes
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-10], [S2-12]
  - **File**: `apps/api/src/infrastructure/http/routes/upload.routes.ts`
  - **Endpoints**: `POST /api/upload/init`, `POST /api/photos/:id/complete`

- **[S2-14]** Mount upload routes in main app
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S2-13]
  - **File**: `apps/api/src/index.ts`

- **[S2-15]** Test single photo upload flow
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S2-14]
  - **Tests**:
    1. Get presigned URL
    2. Upload file to R2
    3. Notify completion
    4. Verify in database

**Verification**: Can upload single photo via API, stored in R2, in database

### Chunk 2.2: Web Frontend - Single Upload

**Prerequisites**: [S2-14], [S1-31]

- **[S2-16]** Implement upload client methods
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-30]
  - **File**: `packages/api-client/src/upload.client.ts`

- **[S2-17]** Create basic upload store
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-16]
  - **File**: `apps/web/lib/stores/upload-store.ts`
  - **Note**: Simplified for single photo

- **[S2-18]** Create DropZone component
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-23]
  - **File**: `apps/web/components/upload/DropZone.tsx`
  - **Note**: Install `react-dropzone` if needed

- **[S2-19]** Create ImagePreview component
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S2-18]
  - **File**: `apps/web/components/upload/ImagePreview.tsx`

- **[S2-20]** Create basic upload page
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S2-17], [S2-18], [S2-19]
  - **File**: `apps/web/app/(dashboard)/upload/page.tsx`

- **[S2-21]** Test single photo upload on web
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-20]

**Verification**: Can upload single photo from web, see it in R2

### Chunk 2.3: Mobile Frontend - Single Upload

**Prerequisites**: [S2-14], [S1-43]

- **[S2-22]** Create tabs layout
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S1-39]
  - **File**: `apps/mobile/app/(tabs)/_layout.tsx`

- **[S2-23]** Install image picker dependencies
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-38]
  - **Commands**: `pnpm add expo-image-picker expo-file-system`

- **[S2-24]** Create ImagePicker component
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-23]
  - **File**: `apps/mobile/components/upload/ImagePicker.tsx`

- **[S2-25]** Create ImagePreview component (mobile)
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S2-24]
  - **File**: `apps/mobile/components/upload/ImagePreview.tsx`

- **[S2-26]** Create basic upload store (mobile)
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-16]
  - **File**: `apps/mobile/lib/stores/upload-store.ts`

- **[S2-27]** Create upload screen
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S2-25], [S2-26]
  - **File**: `apps/mobile/app/(tabs)/index.tsx`

- **[S2-28]** Adapt upload logic for mobile (FileSystem)
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-26]
  - **File**: `apps/mobile/lib/stores/upload-store.ts`
  - **Note**: Use `expo-file-system` for uploads

- **[S2-29]** Test single photo upload on mobile
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-27]

**Verification**: Can upload single photo from mobile, see it in R2

### Chunk 2.4: Deploy Single Upload

**Prerequisites**: [S2-21], [S2-29]

- **[S2-30]** Update Railway env vars with R2 credentials
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-01]
  - **Variables**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

- **[S2-31]** Redeploy API with upload functionality
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-30]
  - **Action**: Push changes, Railway auto-deploys

- **[S2-32]** Update web env to use production API
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S2-31]
  - **File**: Railway web service env vars

- **[S2-33]** Redeploy web with upload functionality
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-32]
  - **Action**: Push changes, Railway auto-deploys

- **[S2-34]** Test single photo upload in production
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S2-33]
  - **Tests**:
    - Upload photo from web
    - Upload photo from mobile
    - Verify in R2 bucket
    - Verify in database

**Verification**: ✅ Single photo upload works in production on web and mobile

---

## Slice 3: Multiple Photo Upload with Progress (Backend + Web + Mobile + Deploy)

**Goal**: Upload multiple photos (up to 100) with real-time progress tracking  
**Time**: 6-7 hours  
**Verification**: Can upload 100 photos simultaneously, see real-time progress, all stored correctly

### Chunk 3.1: Backend - Batch Upload & Progress

**Prerequisites**: [S2-14]

- **[S3-01]** Create Upload Job entity
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/domain/upload-job/upload-job.entity.ts`

- **[S3-02]** Create Upload Job repository interface
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S3-01]
  - **File**: `apps/api/src/domain/upload-job/upload-job.repository.ts`

- **[S3-03]** Update schema with upload_jobs table
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S2-06]
  - **File**: `apps/api/src/infrastructure/database/schema.ts`

- **[S3-04]** Generate and apply upload_jobs migration
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S3-03]

- **[S3-05]** Implement Upload Job repository
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-02], [S3-03]
  - **File**: `apps/api/src/infrastructure/database/repositories/upload-job.repository.impl.ts`

- **[S3-06]** Update InitUploadHandler for batch
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S3-05], [S2-10]
  - **File**: `apps/api/src/application/commands/init-upload/init-upload.handler.ts`
  - **Note**: Handle multiple photos, create upload job

- **[S3-07]** Update CompletePhotoHandler to track progress
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-05], [S2-12]
  - **File**: `apps/api/src/application/commands/complete-photo/complete-photo.handler.ts`
  - **Note**: Update job progress, check completion

- **[S3-08]** Create FailPhotoCommand and handler
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-05]
  - **Files**: 
    - `apps/api/src/application/commands/fail-photo/fail-photo.command.ts`
    - `apps/api/src/application/commands/fail-photo/fail-photo.handler.ts`

- **[S3-09]** Create progress service (in-memory pub/sub)
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: None
  - **File**: `apps/api/src/infrastructure/sse/progress.service.ts`

- **[S3-10]** Update CompletePhotoHandler to publish progress
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S3-09], [S3-07]

- **[S3-11]** Create SSE route for upload progress
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S3-09]
  - **File**: `apps/api/src/infrastructure/http/routes/sse.routes.ts`
  - **Endpoint**: `GET /api/upload-progress/:jobId` (SSE)

- **[S3-12]** Mount SSE routes
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S3-11]

- **[S3-13]** Add fail photo endpoint
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S3-08]
  - **File**: `apps/api/src/infrastructure/http/routes/upload.routes.ts`
  - **Endpoint**: `POST /api/photos/:id/failed`

- **[S3-14]** Test batch upload and SSE
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-12]
  - **Tests**:
    1. Init upload with 10 photos
    2. Connect to SSE endpoint
    3. Upload photos
    4. Verify progress updates
    5. Verify job completion

**Verification**: Can upload multiple photos, see real-time progress via SSE

### Chunk 3.2: Web Frontend - Batch Upload & Progress

**Prerequisites**: [S3-14], [S2-20]

- **[S3-15]** Update upload store for batch uploads
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S2-17]
  - **File**: `apps/web/lib/stores/upload-store.ts`
  - **Note**: Handle multiple files, track progress per file

- **[S3-16]** Update upload client for batch
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-16]
  - **File**: `packages/api-client/src/upload.client.ts`
  - **Note**: Add `failPhoto` method

- **[S3-17]** Create UploadProgress component
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S3-15]
  - **File**: `apps/web/components/upload/UploadProgress.tsx`

- **[S3-18]** Setup SSE connection in UploadProgress
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-17]
  - **File**: `apps/web/components/upload/UploadProgress.tsx`
  - **Note**: Use EventSource to connect to SSE endpoint

- **[S3-19]** Update upload page for batch uploads
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-15], [S3-17]
  - **File**: `apps/web/app/(dashboard)/upload/page.tsx`

- **[S3-20]** Update DropZone for multiple files
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-18]
  - **File**: `apps/web/components/upload/DropZone.tsx`

- **[S3-21]** Test batch upload on web (10 photos)
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S3-19]

- **[S3-22]** Test batch upload on web (100 photos)
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S3-21]

**Verification**: Can upload 100 photos from web, see real-time progress

### Chunk 3.3: Mobile Frontend - Batch Upload & Progress

**Prerequisites**: [S3-14], [S2-27]

- **[S3-23]** Update upload store for batch (mobile)
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S2-26]
  - **File**: `apps/mobile/lib/stores/upload-store.ts`

- **[S3-24]** Update ImagePicker for multiple selection
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-24]
  - **File**: `apps/mobile/components/upload/ImagePicker.tsx`
  - **Note**: Enable `allowsMultipleSelection: true`

- **[S3-25]** Create UploadProgress component (mobile)
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S3-23]
  - **File**: `apps/mobile/components/upload/UploadProgress.tsx`

- **[S3-26]** Setup SSE connection (mobile)
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-25]
  - **Note**: React Native EventSource polyfill or fetch-based SSE

- **[S3-27]** Update upload screen for batch
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-23], [S3-25]
  - **File**: `apps/mobile/app/(tabs)/index.tsx`

- **[S3-28]** Test batch upload on mobile (10 photos)
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S3-27]

- **[S3-29]** Test batch upload on mobile (100 photos)
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S3-28]

**Verification**: Can upload 100 photos from mobile, see real-time progress

### Chunk 3.4: Deploy Batch Upload

**Prerequisites**: [S3-22], [S3-29]

- **[S3-30]** Redeploy API with batch upload and SSE
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S3-14]
  - **Action**: Push changes, Railway auto-deploys

- **[S3-31]** Redeploy web with batch upload
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S3-22]
  - **Action**: Push changes, Railway auto-deploys

- **[S3-32]** Test batch upload in production
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S3-31]
  - **Tests**:
    - Upload 50 photos from web
    - Verify real-time progress
    - Upload 50 photos from mobile
    - Verify all stored in R2
    - Verify job completion

**Verification**: ✅ Batch upload with progress works in production

---

## Slice 4: Gallery (Backend + Web + Mobile + Deploy)

**Goal**: View uploaded photos in a gallery on all platforms  
**Time**: 4-5 hours  
**Verification**: Can view all uploaded photos, pagination works, photo details visible

### Chunk 4.1: Backend - Gallery Queries

**Prerequisites**: [S3-14]

- **[S4-01]** Create GetPhotosQuery DTO
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/application/queries/get-photos/get-photos.query.ts`

- **[S4-02]** Create GetPhotosHandler
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S2-08], [S4-01]
  - **File**: `apps/api/src/application/queries/get-photos/get-photos.handler.ts`
  - **Note**: Pagination, filter by user

- **[S4-03]** Create GetPhotoQuery DTO (single photo)
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S2-04]
  - **File**: `apps/api/src/application/queries/get-photo/get-photo.query.ts`

- **[S4-04]** Create GetPhotoHandler
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S2-08], [S4-03]
  - **File**: `apps/api/src/application/queries/get-photo/get-photo.handler.ts`

- **[S4-05]** Create GetUploadJobQuery DTO
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S3-01]
  - **File**: `apps/api/src/application/queries/get-upload-job/get-upload-job.query.ts`

- **[S4-06]** Create GetUploadJobHandler
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S3-05], [S4-05]
  - **File**: `apps/api/src/application/queries/get-upload-job/get-upload-job.handler.ts`

- **[S4-07]** Create photo routes
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S4-02], [S4-04]
  - **File**: `apps/api/src/infrastructure/http/routes/photo.routes.ts`
  - **Endpoints**: `GET /api/photos`, `GET /api/photos/:id`, `DELETE /api/photos/:id`

- **[S4-08]** Mount photo routes
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S4-07]

- **[S4-09]** Test gallery endpoints
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S4-08]

**Verification**: Can query photos via API, pagination works

### Chunk 4.2: Web Frontend - Gallery

**Prerequisites**: [S4-09], [S1-31]

- **[S4-10]** Implement photo client methods
  - **Time**: 20 min | **Complexity**: Medium
  - **Dependencies**: [S1-30]
  - **File**: `packages/api-client/src/photo.client.ts`

- **[S4-11]** Create PhotoGrid component
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S4-10]
  - **File**: `apps/web/components/gallery/PhotoGrid.tsx`

- **[S4-12]** Create PhotoModal component
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S4-11]
  - **File**: `apps/web/components/gallery/PhotoModal.tsx`

- **[S4-13]** Create gallery page
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S4-11], [S4-12]
  - **File**: `apps/web/app/(dashboard)/gallery/page.tsx`
  - **Note**: Use React Query for data fetching

- **[S4-14]** Add pagination to gallery
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S4-13]

- **[S4-15]** Add navigation link to gallery
  - **Time**: 5 min | **Complexity**: Low
  - **Dependencies**: [S1-35]
  - **File**: `apps/web/app/(dashboard)/layout.tsx`

- **[S4-16]** Test gallery on web
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S4-13]

**Verification**: Can view all photos in gallery, pagination works, modal opens

### Chunk 4.3: Mobile Frontend - Gallery

**Prerequisites**: [S4-09], [S1-43]

- **[S4-17]** Create PhotoGrid component (mobile)
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S4-10]
  - **File**: `apps/mobile/components/gallery/PhotoGrid.tsx`
  - **Note**: Use FlatList with 3 columns

- **[S4-18]** Create PhotoViewer modal (mobile)
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S4-17]
  - **File**: `apps/mobile/components/gallery/PhotoViewer.tsx`

- **[S4-19]** Create gallery screen
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S4-17], [S4-18]
  - **File**: `apps/mobile/app/(tabs)/gallery.tsx`

- **[S4-20]** Add pull-to-refresh
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S4-19]

- **[S4-21]** Test gallery on mobile
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S4-19]

**Verification**: Can view all photos in gallery on mobile, modal works

### Chunk 4.4: Deploy Gallery

**Prerequisites**: [S4-16], [S4-21]

- **[S4-22]** Redeploy API with gallery endpoints
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S4-09]
  - **Action**: Push changes, Railway auto-deploys

- **[S4-23]** Redeploy web with gallery
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S4-16]
  - **Action**: Push changes, Railway auto-deploys

- **[S4-24]** Test gallery in production
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S4-23]
  - **Tests**:
    - View gallery on web
    - View gallery on mobile
    - Test pagination
    - Test photo modal/viewer
    - Verify images load from R2

**Verification**: ✅ Gallery works in production on web and mobile

---

## Slice 5: Polish, Testing & Optimization

**Goal**: Add tests, optimize performance, improve UX, finalize documentation  
**Time**: 4-5 hours  
**Verification**: All tests pass, performance benchmarks met, documentation complete

### Chunk 5.1: Backend Polish

**Prerequisites**: [S4-24]

- **[S5-01]** Add comprehensive error handling middleware
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-04]
  - **File**: `apps/api/src/infrastructure/http/middleware/error.middleware.ts`

- **[S5-02]** Add request validation using Zod
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S0-13]
  - **Note**: Add validation to all endpoints

- **[S5-03]** Add comprehensive logging
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S1-04]
  - **Note**: Use Hono logger middleware

- **[S5-04]** Add CORS configuration
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S1-04]
  - **File**: `apps/api/src/index.ts`

- **[S5-05]** Code cleanup and refactoring
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S4-24]

- **[S5-06]** Add JSDoc comments
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S5-05]

**Verification**: API has proper error handling, validation, logging

### Chunk 5.2: Integration Tests

**Prerequisites**: [S5-06]

- **[S5-07]** Install testing dependencies
  - **Time**: 10 min | **Complexity**: Low
  - **Dependencies**: [S1-01]
  - **Commands**: `pnpm add -D vitest @vitest/ui`

- **[S5-08]** Configure Vitest
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S5-07]
  - **File**: `apps/api/vitest.config.ts`

- **[S5-09]** Create test database setup
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S5-08]

- **[S5-10]** Create integration test for auth flow
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S5-09]
  - **File**: `apps/api/tests/integration/auth.test.ts`

- **[S5-11]** Create integration test for upload flow
  - **Time**: 1 hour | **Complexity**: High
  - **Dependencies**: [S5-09]
  - **File**: `apps/api/tests/integration/upload.test.ts`

- **[S5-12]** Create integration test for SSE
  - **Time**: 45 min | **Complexity**: High
  - **Dependencies**: [S5-09]
  - **File**: `apps/api/tests/integration/sse.test.ts`

- **[S5-13]** Run all tests and fix failures
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S5-12]
  - **Command**: `pnpm test`

**Verification**: All integration tests pass

### Chunk 5.3: Frontend Polish (Web)

**Prerequisites**: [S4-16]

- **[S5-14]** Add loading skeletons
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S4-13]
  - **Files**: Gallery, upload pages

- **[S5-15]** Add error boundaries
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S1-27]
  - **File**: `apps/web/app/error-boundary.tsx`

- **[S5-16]** Improve responsive design
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S4-13], [S2-20]
  - **Note**: Test on mobile/tablet viewports

- **[S5-17]** Add toast notifications for all actions
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S1-23]
  - **Note**: Already using Sonner, add more notifications

- **[S5-18]** Accessibility improvements
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S4-13], [S2-20]
  - **Note**: ARIA labels, keyboard navigation, focus indicators

- **[S5-19]** Performance optimization
  - **Time**: 1 hour | **Complexity**: High
  - **Dependencies**: [S4-13]
  - **Note**: React.memo, image lazy loading, code splitting

- **[S5-20]** Add empty states
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S4-13]

**Verification**: Web app is polished, accessible, performant

### Chunk 5.4: Frontend Polish (Mobile)

**Prerequisites**: [S4-21]

- **[S5-21]** Add haptic feedback
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S4-19]
  - **Commands**: `pnpm add expo-haptics`

- **[S5-22]** Add proper loading indicators
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S4-19]

- **[S5-23]** Handle offline state gracefully
  - **Time**: 45 min | **Complexity**: Medium
  - **Dependencies**: [S4-19]

- **[S5-24]** Optimize image loading and caching
  - **Time**: 1 hour | **Complexity**: High
  - **Dependencies**: [S4-19]

- **[S5-25]** Test on both iOS and Android
  - **Time**: 1 hour | **Complexity**: Low
  - **Dependencies**: [S5-24]

- **[S5-26]** Fix platform-specific issues
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S5-25]

**Verification**: Mobile app is polished, works on both platforms

### Chunk 5.5: Documentation

**Prerequisites**: [S5-13]

- **[S5-27]** Write comprehensive README.md
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: None
  - **File**: `README.md`
  - **Content**: Setup, architecture, deployment, usage

- **[S5-28]** Create API documentation (optional)
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S4-24]
  - **Note**: OpenAPI/Swagger or simple markdown

- **[S5-29]** Write technical writeup (1-2 pages)
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: None
  - **File**: `docs/TECHNICAL_WRITEUP.md`
  - **Content**: Architecture, decisions, challenges, benchmarks

- **[S5-30]** Add inline code comments
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S5-05]

- **[S5-31]** Document environment variables
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S0-07]
  - **File**: `.env.example`

**Verification**: Documentation is complete and helpful

### Chunk 5.6: Final Testing & Deployment

**Prerequisites**: [S5-26], [S5-31]

- **[S5-32]** Final production deployment
  - **Time**: 20 min | **Complexity**: Low
  - **Dependencies**: [S5-26]
  - **Action**: Push all changes, verify deployments

- **[S5-33]** Test authentication flow in production
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S5-32]

- **[S5-34]** Test upload flow in production (100 photos)
  - **Time**: 30 min | **Complexity**: Low
  - **Dependencies**: [S5-32]

- **[S5-35]** Test gallery in production
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S5-32]

- **[S5-36]** Verify performance benchmarks
  - **Time**: 30 min | **Complexity**: Medium
  - **Dependencies**: [S5-34]
  - **Targets**:
    - 100 photos upload in < 90 seconds
    - UI remains responsive
    - SSE updates < 100ms latency

- **[S5-37]** Record demo video
  - **Time**: 1 hour | **Complexity**: Low
  - **Dependencies**: [S5-35]
  - **Content**: Overview, architecture, demo web/mobile, highlights

- **[S5-38]** Final code review and cleanup
  - **Time**: 1 hour | **Complexity**: Medium
  - **Dependencies**: [S5-36]

- **[S5-39]** Push final code to GitHub
  - **Time**: 15 min | **Complexity**: Low
  - **Dependencies**: [S5-38]
  - **Note**: Clean commit history, descriptive messages

**Verification**: ✅ All requirements met, production working, documentation complete

---

## Verification Checklist

### Slice 0: Foundation
- ✅ Monorepo structure works
- ✅ Shared package builds
- ✅ API client package builds

### Slice 1: Authentication
- ✅ Users can register/login on web
- ✅ Users can register/login on mobile
- ✅ Authentication deployed and working in production

### Slice 2: Single Photo Upload
- ✅ Can upload single photo from web
- ✅ Can upload single photo from mobile
- ✅ Photo stored in R2
- ✅ Photo visible in database
- ✅ Single upload deployed and working

### Slice 3: Multiple Photo Upload
- ✅ Can upload 100 photos simultaneously
- ✅ Real-time progress tracking works (SSE)
- ✅ All photos stored correctly
- ✅ Batch upload deployed and working

### Slice 4: Gallery
- ✅ Gallery displays all photos
- ✅ Pagination works
- ✅ Photo modal/viewer works
- ✅ Gallery deployed and working

### Slice 5: Polish & Testing
- ✅ All integration tests pass
- ✅ Performance benchmarks met
- ✅ Documentation complete
- ✅ Production deployment successful

---

## Notes

- All code examples are in [CODE_REFERENCE.md](./CODE_REFERENCE.md)
- Architecture details in [ARCHITECTURE.md](./ARCHITECTURE.md)
- Task IDs follow format: [S{slice}-{number}]
- Prerequisites must be completed before starting a task
- Time estimates are approximate
- Each slice is deployable and verifiable independently

---

## Success Criteria

✅ **Functional Requirements:**
- Users can register and login
- Users can upload up to 100 photos concurrently
- Real-time progress tracking works
- Photos are stored in R2
- Gallery displays all uploaded photos
- Both web and mobile apps work

✅ **Technical Requirements:**
- Backend follows DDD/CQRS patterns
- Direct upload with presigned URLs
- SSE for real-time updates
- Integration tests pass
- Clean, documented code
- Production deployment successful

✅ **Documentation:**
- Comprehensive README
- Technical writeup (1-2 pages)
- Demo video or presentation

---

**Good luck with your implementation! 🚀**
