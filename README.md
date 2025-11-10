# RapidPhoto

A high-performance photo upload and management system with web and mobile clients. RapidPhoto enables users to upload photos (single or batch), view their photo gallery, and manage their uploaded content through a modern, responsive interface.

## Features

- ✅ **High-Performance Uploads**: Supports up to 100 concurrent photo uploads per session
- ✅ **Direct-to-Cloud Upload**: Photos upload directly to Cloudflare R2, bypassing the backend server
- ✅ **Real-Time Progress**: Server-Sent Events (SSE) provide real-time upload progress updates
- ✅ **Multi-Platform**: Web (Next.js) and mobile (React Native + Expo) clients
- ✅ **AI-Powered Tagging**: Automatic photo tagging using AWS Rekognition
- ✅ **Tag-Based Search**: Search photos by tags with autocomplete support
- ✅ **Secure Authentication**: Better-Auth with session-based authentication
- ✅ **Clean Architecture**: DDD/CQRS/Vertical Slice Architecture for maintainability

## Tech Stack

### Backend
- **Framework**: Hono (TypeScript)
- **Runtime**: Node.js 20.9.0+
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth
- **Storage**: Cloudflare R2 (S3-compatible)
- **Real-time**: Server-Sent Events (SSE)
- **Queue**: BullMQ + Redis (for background jobs)
- **AI**: AWS Rekognition (for photo tagging)

### Frontend Web
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **UI Framework**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (server state), Zustand (client state)

### Mobile App
- **Framework**: React Native + Expo SDK 54
- **Router**: Expo Router (file-based routing)
- **UI Framework**: BNA UI
- **State Management**: React Query (server state), Zustand (client state)

### Monorepo
- **Package Manager**: pnpm
- **Workspaces**: pnpm workspaces
- **Packages**: 
  - `apps/api` - Backend API
  - `apps/web` - Web frontend
  - `apps/mobile` - Mobile app
  - `packages/api-client` - Shared API client library

### Deployment
- **Platform**: Railway
- **Build System**: Railpack (custom configurations)
- **Services**: Separate Railway services for API, web, and mobile builds

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- pnpm 10.14.0 or higher
- PostgreSQL database (local or Railway)
- Cloudflare R2 account (for photo storage)
- Redis (for job queues - optional for MVP)
- AWS account (for AI tagging - optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rapidphoto
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files based on the `.env.example` files:
   
   - Root `.env.example` - General configuration
   - `apps/api/.env.example` - Backend API configuration
   - `apps/web/.env.example` - Web frontend configuration (if exists)
   - `apps/mobile/.env.example` - Mobile app configuration (if exists)

   See [Environment Variables](#environment-variables) section for details.

4. **Set up the database**

   ```bash
   cd apps/api
   pnpm db:push  # Push schema to database
   # or
   pnpm db:migrate  # Run migrations
   ```

5. **Start development servers**

   ```bash
   # From root directory
   pnpm dev  # Runs all apps in parallel
   
   # Or run individually:
   pnpm dev:api    # Backend API (port 4000)
   pnpm dev:web    # Web frontend (port 3000)
   pnpm dev:mobile # Mobile app (Expo)
   ```

6. **Access the applications**

   - Web: http://localhost:3000
   - API: http://localhost:4000
   - Mobile: Use Expo Go app to scan QR code

## Architecture Overview

RapidPhoto uses a **Domain-Driven Design (DDD)** architecture with **CQRS** (Command Query Responsibility Segregation) and **Vertical Slice** patterns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
├─────────────────────────┬───────────────────────────────┤
│   Web (Next.js)         │   Mobile (React Native)       │
└───────────┬─────────────┴───────────────┬───────────────┘
            │                             │
            │ HTTPS (REST + SSE)           │
            │                             │
            └──────────────┬──────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    API LAYER                           │
│              Hono API Server (Railway)                 │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         HTTP Routes Layer                        │  │
│  │  - /api/auth/* (Better-Auth)                     │  │
│  │  - /api/upload/init (Generate presigned URLs)   │  │
│  │  - /api/photos/* (CRUD operations)              │  │
│  │  - /api/upload-progress/:jobId (SSE endpoint)   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Application Layer (CQRS)                    │  │
│  │  Commands: InitUpload, CompletePhoto, etc.      │  │
│  │  Queries: GetPhotos, GetUploadJob, etc.         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Domain Layer (DDD)                       │  │
│  │  Entities: Photo, UploadJob, User                │  │
│  │  Repositories: PhotoRepository, etc.              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Infrastructure Layer                        │  │
│  │  - Database (Drizzle ORM + PostgreSQL)           │  │
│  │  - Storage (R2 Service)                          │  │
│  │  - Auth (Better-Auth)                             │  │
│  │  - SSE (Progress Service)                         │  │
│  │  - Queue (BullMQ + Redis)                        │  │
│  │  - AI (AWS Rekognition)                          │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
│  PostgreSQL DB  │ │ Cloudflare │ │  Redis (Queue)   │
│   (Railway)     │ │     R2      │ │   (Railway)      │
└─────────────────┘ └─────────────┘ └──────────────────┘
```

### Upload Flow

The upload flow uses a **direct upload pattern** with presigned URLs:

1. **Client** selects photos (1-100 photos)
2. **Client** sends metadata to `/api/upload/init`
3. **Backend** creates database records and generates presigned URLs
4. **Client** uploads photos **directly to R2** (bypassing backend)
5. **Client** notifies backend when each upload completes
6. **Backend** updates database and publishes SSE progress events
7. **Client** receives real-time progress updates via SSE

This approach enables:
- ✅ True parallel uploads (limited only by browser/network)
- ✅ No backend bandwidth usage for file transfer
- ✅ Faster uploads (direct to CDN edge)
- ✅ Reduced server load

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Environment Variables

### Backend API (`apps/api/.env.example`)

```bash
# API Configuration
PORT=4000                    # API server port
NODE_ENV=development         # Environment (development/production)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rapidphoto
                             # PostgreSQL connection string

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
                             # Secret key for Better-Auth (generate secure random string)
BETTER_AUTH_URL=http://localhost:4000
                             # Base URL for Better-Auth callbacks

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
                             # Cloudflare account ID
R2_ACCESS_KEY_ID=your_access_key_id_here
                             # R2 API access key
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
                             # R2 API secret key
R2_BUCKET_NAME=rapidphoto-uploads
                             # R2 bucket name for photo storage
R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com
                             # Public URL for R2 bucket (optional)

# Redis Configuration (for job queues)
REDIS_URL=redis://localhost:6379
                             # Redis connection string for BullMQ

# AWS Rekognition Configuration (for AI tagging)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
                             # AWS access key for Rekognition
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
                             # AWS secret key for Rekognition
AWS_REGION=us-east-1
                             # AWS region for Rekognition

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-web-domain.com
                             # Comma-separated list of allowed origins
```

### Web Frontend (`apps/web`)

The web app uses Next.js environment variables (prefixed with `NEXT_PUBLIC_`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
                     # Backend API URL
```

### Mobile App (`apps/mobile`)

The mobile app uses Expo environment variables (prefixed with `EXPO_PUBLIC_`):

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
                     # Backend API URL
```

Or configure in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:4000"
    }
  }
}
```

## Deployment

### Railway Deployment

RapidPhoto is deployed on Railway with separate services for API, web, and mobile builds.

#### 1. Set up Railway Project

1. Create a new Railway project
2. Add PostgreSQL database service
3. Add Redis service (for job queues)
4. Add API service (connect to `apps/api`)
5. Add Web service (connect to `apps/web`)

#### 2. Configure Environment Variables

Set all required environment variables in Railway dashboard for each service:

**API Service:**
- `DATABASE_URL` (auto-injected from PostgreSQL service)
- `REDIS_URL` (auto-injected from Redis service)
- `BETTER_AUTH_SECRET` (generate secure random string)
- `BETTER_AUTH_URL` (your API Railway URL)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- `ALLOWED_ORIGINS` (comma-separated list of your web/mobile URLs)

**Web Service:**
- `NEXT_PUBLIC_API_URL` (your API Railway URL)

#### 3. Deploy

Railway automatically deploys on git push to the connected branch.

#### 4. Run Database Migrations

After first deployment, run migrations:

```bash
# Connect to Railway CLI or use Railway dashboard
railway run pnpm db:push
```

For detailed deployment instructions, see [docs/RAILWAY.md](docs/RAILWAY.md).

## Usage Examples

### Upload Photos

**Web:**
1. Navigate to the gallery page
2. Click "Upload" or drag and drop photos
3. Select 1-100 photos
4. Watch real-time progress updates
5. Photos appear in gallery when complete

**Mobile:**
1. Open the app
2. Tap "Upload" button
3. Select photos from device
4. Monitor progress
5. View photos in gallery

### Search Photos by Tags

1. Use the search bar in the gallery
2. Type tag names (autocomplete suggestions appear)
3. Filter by multiple tags (AND logic)
4. Optionally include AI-suggested tags

### Manage Tags

1. View AI-suggested tags on photos
2. Accept or reject suggestions
3. Manually add custom tags
4. Tags are normalized (lowercase, trimmed, deduplicated)

## Common Commands

```bash
# Development
pnpm dev              # Run all apps in parallel
pnpm dev:api          # Run API only
pnpm dev:web          # Run web only
pnpm dev:mobile       # Run mobile only

# Building
pnpm build            # Build all apps and packages

# Database
cd apps/api
pnpm db:generate       # Generate migration files
pnpm db:push          # Push schema changes (dev)
pnpm db:migrate        # Run migrations (production)

# Testing
pnpm test             # Run all tests
cd apps/api
pnpm test             # Run API tests

# Linting
pnpm lint             # Lint all apps and packages

# Type Checking
pnpm typecheck        # Type check all TypeScript code
```

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL database

**Solutions**:
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure database exists: `CREATE DATABASE rapidphoto;`
- Check network/firewall settings

### R2 Upload Failures

**Problem**: Photos fail to upload to R2

**Solutions**:
- Verify R2 credentials are correct
- Check R2 bucket exists and is accessible
- Verify CORS settings on R2 bucket
- Check presigned URL expiration (default: 1 hour)

### Authentication Issues

**Problem**: Cannot login or session expires

**Solutions**:
- Verify `BETTER_AUTH_SECRET` is set and consistent
- Check `BETTER_AUTH_URL` matches your API URL
- Clear browser cookies/localStorage
- Check CORS settings allow your frontend origin

### SSE Connection Issues

**Problem**: Real-time progress updates not working

**Solutions**:
- Verify SSE endpoint is accessible: `/api/upload-progress/:jobId`
- Check browser supports EventSource API
- Verify authentication token is valid
- Check network doesn't block SSE connections

### Mobile App Issues

**Problem**: Mobile app cannot connect to API

**Solutions**:
- Verify `EXPO_PUBLIC_API_URL` or `app.json` extra.apiUrl is set
- Check API URL is accessible from mobile device
- Ensure CORS allows mobile app origin
- Check network connectivity

### Build Issues

**Problem**: Build fails with dependency errors

**Solutions**:
- Run `pnpm install` to ensure dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version: `node --version` (must be >= 20.9.0)
- Verify pnpm version: `pnpm --version` (must be >= 10.14.0)

## Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - Detailed system architecture
- [API Documentation](docs/API.md) - API endpoints and usage
- [Technical Writeup](docs/TECHNICAL_WRITEUP.md) - Architecture decisions and challenges
- [Styling Guide](docs/STYLING.md) - UI styling conventions
- [Railway Deployment](docs/RAILWAY.md) - Deployment guide

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section above

