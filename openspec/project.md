# Project Context

## Purpose
RapidPhoto is a high-performance photo upload and management system with web and mobile clients. The application enables users to upload photos (single or batch), view their photo gallery, and manage their uploaded content through a modern, responsive interface.

## Tech Stack

### Backend
- **Runtime**: Node.js 20.9.0+
- **Framework**: Hono (lightweight web framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth
- **Storage**: Cloudflare R2 (S3-compatible object storage)
- **Real-time**: Server-Sent Events (SSE)
- **Testing**: Vitest

### Frontend Web
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **UI Framework**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (server state), Zustand (client state)
- **HTTP Client**: Fetch API
- **Package Manager**: pnpm

### Mobile App
- **Framework**: React Native + Expo SDK 54
- **Router**: Expo Router (file-based routing)
- **UI Framework**: BNA UI
- **State Management**: React Query (server state), Zustand (client state)
- **File System**: expo-file-system
- **Image Picker**: expo-image-picker
- **Package Manager**: pnpm

### Monorepo Structure
- **Tool**: pnpm workspaces
- **Packages**: 
  - `apps/api` - Backend API
  - `apps/web` - Web frontend
  - `apps/mobile` - Mobile app
  - `packages/shared` - Shared types and utilities
  - `packages/api-client` - API client library

### Deployment
- **Platform**: Railway
- **Build System**: Railpack (custom configurations)
- **Services**: Separate Railway services for API, web, and mobile builds
- **Environment**: All services configured with root directory at `/`

## Project Conventions

### Code Style
- **Language**: TypeScript (strict mode enabled)
- **Formatting**: Prettier (inherited from workspace)
- **Linting**: ESLint v9 with Next.js config
- **File Naming**: 
  - Components: PascalCase (`Button.tsx`, `ImagePreview.tsx`)
  - Utils/libs: camelCase (`auth-client.ts`, `upload-store.ts`)
  - Routes: lowercase with hyphens (`login/page.tsx`, `(auth)/layout.tsx`)
- **Import Aliases**: Use `@/` for imports within each app

### Architecture Patterns
- **Monorepo**: Shared code in packages, apps are independent
- **API**: RESTful endpoints with Hono
- **File-based Routing**: Next.js App Router (web), Expo Router (mobile)
- **State Management**:
  - Server state → React Query (caching, refetching, optimistic updates)
  - Client state → Zustand (upload state, UI state)
- **Data Flow**: 
  - Client → API Client → Backend → Database/R2
  - SSE for real-time upload progress updates
- **Authentication**: Better-Auth with JWT tokens, cookie-based sessions

### Styling Conventions
- **Web**: 
  - Use shadcn/ui components from `@/components/ui`
  - Style with Tailwind utility classes
  - Theme variables defined in `globals.css`
  - NO custom CSS files
- **Mobile**:
  - Use BNA UI components from `@/components/ui`
  - Style with React Native StyleSheet
  - Access theme colors via `useColor()` hook
  - NO inline styles (use StyleSheet.create())

### Testing Strategy
- **Backend**: Unit tests with Vitest
- **Frontend**: Component tests with React Testing Library (planned)
- **Integration**: API endpoint tests (planned)
- **E2E**: Manual testing for MVP, automated E2E tests post-MVP
- **Testing Priority**: Core upload functionality > Auth > Gallery

### Git Workflow
- **Branch Strategy**: Main branch for all development (small team)
- **Commit Convention**: Conventional Commits
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `refactor:` - Code refactoring
  - `docs:` - Documentation changes
  - `chore:` - Maintenance tasks
- **Pre-commit**: No hooks currently (add linting pre-commit post-MVP)
- **Review**: Not required for MVP (single developer)

## Domain Context

### Photo Upload Flow
1. User authenticates (login/register)
2. User selects photo(s) from device/computer
3. Client uploads to API endpoint
4. API validates, stores in R2, creates DB record
5. Client receives upload confirmation
6. Photo appears in user's gallery

### Upload Modes
- **Single Upload**: One photo at a time with preview
- **Batch Upload**: Multiple photos with progress tracking
- **Progress**: Real-time progress updates via SSE

### Storage Strategy
- **Original Photos**: Stored in Cloudflare R2
- **Metadata**: Stored in PostgreSQL (filename, size, upload date, user ID)
- **Thumbnails**: Generated post-MVP (future enhancement)
- **CDN**: R2 public URLs (no CDN for MVP)

### User Roles
- **Authenticated User**: Can upload and view own photos
- **Unauthenticated**: Can only access login/register pages
- No admin role for MVP

## Important Constraints

### Technical Constraints
- **Node Version**: >=20.9.0 (required for all apps)
- **Package Manager**: Must use pnpm (workspace dependencies)
- **Expo Go Compatibility**: Mobile app must work in Expo Go (no custom native modules requiring dev builds)
- **No react-native-reanimated**: Use simple animations for Expo Go compatibility
- **Monorepo Build Order**: Must build shared packages before apps
- **Railway Deployment**: Root directory must be `/` for all services

### Performance Constraints
- **Upload Size**: No explicit limit for MVP (handle in post-MVP)
- **Concurrent Uploads**: Batch uploads handled sequentially for simplicity
- **Database**: PostgreSQL connection pooling enabled
- **API Response Time**: Target <500ms for non-upload endpoints

### Business Constraints
- **MVP Scope**: Auth + Upload + Basic Gallery only
- **No Payment**: Free tier for MVP (monetization post-MVP)
- **Single Tenant**: No multi-tenancy (each user owns their photos)
- **Data Privacy**: User photos are private (not shared publicly)

### Security Constraints
- **Authentication**: JWT tokens with 7-day expiry
- **Authorization**: Users can only access their own photos
- **File Validation**: Accept only image files (MIME type checking)
- **SQL Injection**: Prevented by Drizzle ORM parameterization
- **XSS**: React/Next.js default escaping

## External Dependencies

### Required Services
1. **PostgreSQL Database** (Railway-managed)
   - Connection string in `DATABASE_URL` env var
   - Drizzle ORM for schema management

2. **Cloudflare R2** (Object Storage)
   - `R2_ACCOUNT_ID` - Cloudflare account ID
   - `R2_ACCESS_KEY_ID` - R2 API access key
   - `R2_SECRET_ACCESS_KEY` - R2 API secret key
   - `R2_BUCKET_NAME` - Bucket name for photo storage
   - `R2_PUBLIC_URL` - Public URL for accessing photos

3. **Railway** (Deployment Platform)
   - API service: `apps/api`
   - Web service: `apps/web`
   - Database: Managed PostgreSQL
   - Environment variables: Configured per service

### API Endpoints (Backend)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session
- `POST /api/upload/single` - Single photo upload
- `POST /api/upload/batch` - Batch photo upload
- `GET /api/upload/progress/:jobId` - SSE progress stream
- `GET /api/photos` - Get user's photos
- `DELETE /api/photos/:id` - Delete photo

### Environment Variables

#### Backend (`apps/api`)
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=<api-url>
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<r2-key>
R2_SECRET_ACCESS_KEY=<r2-secret>
R2_BUCKET_NAME=<bucket-name>
R2_PUBLIC_URL=<r2-public-url>
```

#### Web (`apps/web`)
```
NEXT_PUBLIC_API_URL=<backend-api-url>
```

#### Mobile (`apps/mobile`)
```
EXPO_PUBLIC_API_URL=<backend-api-url>
```

## Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Run database migrations
cd apps/api
pnpm db:push

# Start development servers
pnpm dev  # Runs all apps in parallel
```

### OpenSpec Workflow
1. **Creating Changes**: Use `openspec list` to see active changes
2. **Implementation**: Follow `tasks.md` in each change directory
3. **Validation**: Run `openspec validate <change-id> --strict`
4. **Archiving**: After deployment, use `openspec archive <change-id> --yes`

### Common Commands
```bash
# Development
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm lint         # Lint all apps

# Backend
cd apps/api
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio

# Testing
pnpm test         # Run tests (when implemented)
```

## Project-Specific Terms

- **SSE**: Server-Sent Events (one-way server → client streaming)
- **Drizzle ORM**: Type-safe SQL ORM for TypeScript
- **Better-Auth**: Authentication library with JWT support
- **R2**: Cloudflare's S3-compatible object storage
- **Expo Router**: File-based routing for React Native
- **shadcn/ui**: Copy-paste React component library
- **BNA UI**: React Native component library inspired by shadcn/ui
- **Railpack**: Railway's build system (alternative to Nixpacks)

## Future Enhancements (Post-MVP)
- AI-powered photo tagging
- Thumbnail generation
- Photo search by tags
- Photo sharing (public links)
- Photo albums/collections
- Mobile photo editing
- Dark mode
- Progressive Web App (PWA)
