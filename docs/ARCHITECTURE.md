# RapidPhotoUpload - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack](#technology-stack)
4. [Upload Flow Architecture](#upload-flow-architecture)
5. [Backend Architecture (DDD/CQRS)](#backend-architecture-dddcqrs)
6. [Database Schema](#database-schema)
7. [Real-Time Progress (SSE)](#real-time-progress-sse)
8. [Authentication Flow](#authentication-flow)
9. [Frontend Architecture](#frontend-architecture)
10. [Mobile Architecture](#mobile-architecture)
11. [Deployment Architecture](#deployment-architecture)
12. [Security Architecture](#security-architecture)
13. [Scalability Considerations](#scalability-considerations)

---

## System Overview

RapidPhotoUpload is a high-performance photo upload system designed to handle up to 100 concurrent uploads per user session. The system consists of three main components:

1. **Backend API** (Hono + TypeScript) - Handles business logic, authentication, and metadata
2. **Web Frontend** (Next.js 15) - Browser-based upload and gallery interface
3. **Mobile App** (React Native + Expo) - Native mobile upload and gallery experience

### Key Features
- ✅ 100 concurrent photo uploads
- ✅ Direct-to-cloud upload (no proxy through backend)
- ✅ Real-time progress tracking via SSE
- ✅ DDD/CQRS/Vertical Slice Architecture
- ✅ Responsive web and native mobile interfaces
- ✅ Secure authentication with Better-Auth

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
├─────────────────────────────────┬───────────────────────────────────────┤
│                                 │                                       │
│   ┌─────────────────────────┐   │   ┌─────────────────────────────┐   │
│   │   Web Frontend          │   │   │   Mobile App                │   │
│   │   (Next.js 15)          │   │   │   (React Native + Expo)     │   │
│   │                         │   │   │                             │   │
│   │   - Upload Interface    │   │   │   - Image Picker            │   │
│   │   - Gallery             │   │   │   - Upload Progress         │   │
│   │   - Authentication      │   │   │   - Gallery                 │   │
│   │   - Real-time Progress  │   │   │   - Authentication          │   │
│   └────────────┬────────────┘   │   └────────────┬────────────────┘   │
│                │                 │                │                    │
└────────────────┼─────────────────┴────────────────┼────────────────────┘
                 │                                  │
                 │ HTTPS (REST + SSE)               │ HTTPS (REST + SSE)
                 │                                  │
                 └──────────────┬───────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│                         API LAYER (Railway)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     Hono API Server                             │   │
│   │                     (TypeScript + Node.js)                      │   │
│   │                                                                 │   │
│   │   ┌─────────────────────────────────────────────────────────┐   │   │
│   │   │                  HTTP Routes Layer                      │   │   │
│   │   │  - /api/auth/* (Better-Auth)                           │   │   │
│   │   │  - /api/upload/init (Generate presigned URLs)          │   │   │
│   │   │  - /api/photos/* (CRUD operations)                     │   │   │
│   │   │  - /api/upload-progress/:jobId (SSE endpoint)          │   │   │
│   │   └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │   ┌─────────────────────────────────────────────────────────┐   │   │
│   │   │              Application Layer (CQRS)                   │   │   │
│   │   │                                                         │   │   │
│   │   │  Commands:                  Queries:                   │   │   │
│   │   │  - InitUploadHandler        - GetPhotosHandler         │   │   │
│   │   │  - CompletePhotoHandler     - GetUploadJobHandler      │   │   │
│   │   │  - FailPhotoHandler                                    │   │   │
│   │   └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │   ┌─────────────────────────────────────────────────────────┐   │   │
│   │   │                 Domain Layer (DDD)                      │   │   │
│   │   │                                                         │   │   │
│   │   │  Entities:                  Value Objects:             │   │   │
│   │   │  - Photo                    - UploadStatus             │   │   │
│   │   │  - UploadJob                - JobStatus                │   │   │
│   │   │  - User                                                │   │   │
│   │   │                                                         │   │   │
│   │   │  Repository Interfaces:                                │   │   │
│   │   │  - PhotoRepository                                     │   │   │
│   │   │  - UploadJobRepository                                 │   │   │
│   │   │  - UserRepository                                      │   │   │
│   │   └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │   ┌─────────────────────────────────────────────────────────┐   │   │
│   │   │            Infrastructure Layer                         │   │   │
│   │   │                                                         │   │   │
│   │   │  - Database (Drizzle ORM + PostgreSQL)                 │   │   │
│   │   │  - Storage (R2 Service)                                │   │   │
│   │   │  - Auth (Better-Auth)                                  │   │   │
│   │   │  - SSE (Progress Service)                              │   │   │
│   │   │  - Queue (BullMQ + Redis) [Post-MVP]                   │   │   │
│   │   │  - AI (AWS Rekognition) [Post-MVP]                     │   │   │
│   │   └─────────────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────┬────────────────────────┬──────────────────────────┘
                      │                        │
                      │                        │
         ┌────────────▼──────────┐  ┌──────────▼─────────────┐
         │   PostgreSQL DB       │  │   Cloudflare R2        │
         │   (Railway)           │  │   (Object Storage)     │
         │                       │  │                        │
         │   - Users             │  │   - Photo Files        │
         │   - Photos            │  │   - Thumbnails         │
         │   - Upload Jobs       │  │   - Direct Upload      │
         │   - Sessions          │  │   - Presigned URLs     │
         └───────────────────────┘  └────────────────────────┘
                      │
                      │
         ┌────────────▼──────────┐
         │   Redis (Railway)     │ [Post-MVP]
         │   (Job Queue)         │
         │                       │
         │   - AI Tagging Jobs   │
         │   - Thumbnail Jobs    │
         └───────────────────────┘
```

---

## Technology Stack

### Backend
```yaml
Framework: Hono (TypeScript)
Runtime: Node.js
ORM: Drizzle
Database: PostgreSQL (Railway)
Authentication: Better-Auth
Storage: Cloudflare R2 (S3-compatible)
Real-time: Server-Sent Events (SSE)
Testing: Vitest
```

### Frontend Web
```yaml
Framework: Next.js 16 (App Router)
Language: TypeScript
UI: React 19 + shadcn/ui + Tailwind CSS v4
State Management:
  - React Query (server state)
  - Zustand (client state)
HTTP Client: Fetch API
Real-time: EventSource (SSE)
```

### Mobile
```yaml
Framework: React Native + Expo
Language: TypeScript
UI: BNA UI
Router: Expo Router (file-based)
State Management:
  - React Query (server state)
  - Zustand (client state)
File System: expo-file-system
Image Picker: expo-image-picker
```

### Shared
```yaml
Monorepo: pnpm workspace
Type System: TypeScript (shared types)
Validation: Zod schemas
API Client: Custom type-safe client
```

### Deployment
```yaml
Platform: Railway
Services:
  - API (Hono)
  - Web (Next.js)
  - PostgreSQL
Database: Railway PostgreSQL
Storage: Cloudflare R2
CI/CD: GitHub Actions (optional)
```

---

## Upload Flow Architecture

### Overview
The upload flow uses a **direct upload pattern** with presigned URLs to avoid proxying large files through the backend server. This enables true parallel uploads and reduces server load.

### Sequence Diagram

```
┌────────┐          ┌─────────┐          ┌──────────┐          ┌─────────┐
│ Client │          │ Hono API│          │PostgreSQL│          │   R2    │
└───┬────┘          └────┬────┘          └────┬─────┘          └────┬────┘
    │                    │                    │                     │
    │ 1. Select 100      │                    │                     │
    │    photos          │                    │                     │
    │────────────────────▶                    │                     │
    │                    │                    │                     │
    │ 2. POST /upload/init                    │                     │
    │    {photos: [...]} │                    │                     │
    │────────────────────▶                    │                     │
    │                    │                    │                     │
    │                    │ 3. Create upload   │                     │
    │                    │    job & photos    │                     │
    │                    │────────────────────▶                     │
    │                    │                    │                     │
    │                    │ 4. Generate 100    │                     │
    │                    │    presigned URLs  │                     │
    │                    │────────────────────────────────────────▶ │
    │                    │                    │                     │
    │                    │ 5. Return URLs     │                     │
    │                    │◀────────────────────────────────────────┤
    │                    │                    │                     │
    │ 6. Return jobId    │                    │                     │
    │    + URLs array    │                    │                     │
    │◀────────────────────                    │                     │
    │                    │                    │                     │
    │ 7. Upload 100 photos DIRECTLY (parallel)│                     │
    │──────────────────────────────────────────────────────────────▶│
    │    PUT presignedURL│                    │                     │
    │    with file bytes │                    │                     │
    │                    │                    │                     │
    │ 8. For each completed upload:           │                     │
    │    POST /photos/:id/complete            │                     │
    │────────────────────▶                    │                     │
    │                    │                    │                     │
    │                    │ 9. Update photo    │                     │
    │                    │    status          │                     │
    │                    │────────────────────▶                     │
    │                    │                    │                     │
    │                    │ 10. Update job     │                     │
    │                    │     progress       │                     │
    │                    │────────────────────▶                     │
    │                    │                    │                     │
    │                    │ 11. Publish SSE    │                     │
    │                    │     event          │                     │
    │                    │                    │                     │
    │ 12. Receive SSE    │                    │                     │
    │     progress       │                    │                     │
    │◀────────────────────                    │                     │
    │                    │                    │                     │
    │ (Repeat steps 8-12 for all 100 photos) │                     │
    │                    │                    │                     │
    │ 13. GET /photos    │                    │                     │
    │     (view gallery) │                    │                     │
    │────────────────────▶                    │                     │
    │                    │                    │                     │
    │                    │ 14. Query photos   │                     │
    │                    │────────────────────▶                     │
    │                    │                    │                     │
    │ 15. Return photos  │                    │                     │
    │     with R2 URLs   │                    │                     │
    │◀────────────────────                    │                     │
    │                    │                    │                     │
```

### Detailed Flow Steps

#### Phase 1: Initialization (Steps 1-6)
1. **User selects 100 photos** in the client (web or mobile)
2. **Client sends metadata** to backend:
   ```json
   POST /api/upload/init
   {
     "photos": [
       {
         "fileName": "photo1.jpg",
         "fileSize": 2048576,
         "mimeType": "image/jpeg"
       },
       // ... 99 more
     ]
   }
   ```
3. **Backend creates database records**:
   - 1 `UploadJob` record (status: pending, totalPhotos: 100)
   - 100 `Photo` records (status: pending)
4. **Backend generates 100 presigned URLs** from R2:
   ```typescript
   const presignedUrl = await r2Service.generatePresignedUrl(
     'uploads/user123/photo-uuid',
     'image/jpeg'
   );
   ```
5. **Backend returns response**:
   ```json
   {
     "jobId": "job-uuid",
     "uploads": [
       {
         "photoId": "photo1-uuid",
         "presignedUrl": "https://r2.cloudflarestorage.com/...",
         "r2Key": "uploads/user123/photo1-uuid"
       },
       // ... 99 more
     ]
   }
   ```

#### Phase 2: Parallel Upload (Step 7)
Client uploads all 100 photos **in parallel** directly to R2:
```typescript
const uploadPromises = uploads.map(upload => 
  fetch(upload.presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  })
);

await Promise.allSettled(uploadPromises);
```

**Key Benefits:**
- ✅ No backend bandwidth used
- ✅ Maximum parallelism (limited only by browser/network)
- ✅ Faster uploads (direct to CDN edge)
- ✅ Server remains lightweight

#### Phase 3: Completion Notification (Steps 8-11)
For each successful upload:
1. **Client notifies backend**:
   ```
   POST /api/photos/:photoId/complete
   ```
2. **Backend updates database**:
   - Photo status: `pending` → `complete`
   - Upload job progress: `completedPhotos++`
3. **Backend publishes SSE event**:
   ```typescript
   progressService.publishProgress(jobId, {
     photoId,
     completedCount: 45,
     totalCount: 100,
     status: 'complete'
   });
   ```

#### Phase 4: Real-time Updates (Step 12)
Client maintains SSE connection:
```typescript
const eventSource = new EventSource(`/api/upload-progress/${jobId}`);

eventSource.onmessage = (event) => {
  const { completedCount, totalCount } = JSON.parse(event.data);
  updateProgressBar(completedCount / totalCount * 100);
};
```

### Concurrency Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Side (Browser)                    │
│                                                             │
│   100 Files Selected                                        │
│         │                                                   │
│         ▼                                                   │
│   ┌─────────────────────────────────────────────────┐      │
│   │   Promise.allSettled() - Parallel Execution    │      │
│   │                                                 │      │
│   │   ┌──────┐ ┌──────┐ ┌──────┐     ┌──────┐     │      │
│   │   │File 1│ │File 2│ │File 3│ ... │File  │     │      │
│   │   │Upload│ │Upload│ │Upload│     │100   │     │      │
│   │   └───┬──┘ └───┬──┘ └───┬──┘     └───┬──┘     │      │
│   │       │        │        │            │        │      │
│   │       └────────┴────────┴────────────┘        │      │
│   │                    │                           │      │
│   │                    ▼                           │      │
│   │          Browser Connection Pool              │      │
│   │          (6-8 concurrent connections)         │      │
│   └─────────────────────────────────────────────────┘      │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare R2 (Storage)                   │
│                                                             │
│   Receives uploads on multiple edge nodes                  │
│   No single bottleneck                                     │
└─────────────────────────────────────────────────────────────┘
```

**Browser Limitations:**
- HTTP/1.1: 6 concurrent connections per domain
- HTTP/2: Multiplexing allows more parallelism
- R2 uses HTTP/2, so ~100 concurrent uploads work well

**Backend Role:**
- ✅ Lightweight metadata tracking
- ✅ No file bytes proxying
- ✅ Async notification handling
- ✅ Real-time progress broadcasting

---

## Backend Architecture (DDD/CQRS)

### Domain-Driven Design Structure

```
apps/api/src/
│
├── domain/                          # Domain Layer (Pure Business Logic)
│   ├── photo/
│   │   ├── photo.entity.ts          # Photo aggregate root
│   │   │   └── Photo {
│   │   │       id, uploadJobId, userId,
│   │   │       fileName, fileSize, mimeType,
│   │   │       r2Key, status, uploadedAt
│   │   │   }
│   │   ├── photo.repository.ts      # Repository interface (port)
│   │   │   └── Interface: PhotoRepository {
│   │   │       create(), findById(), findByUserId(),
│   │   │       updateStatus(), delete()
│   │   │   }
│   │   └── upload-status.value-object.ts
│   │       └── Enum: UploadStatus {
│   │           PENDING, UPLOADING, COMPLETE, FAILED
│   │       }
│   │
│   ├── upload-job/
│   │   ├── upload-job.entity.ts     # UploadJob aggregate root
│   │   ├── upload-job.repository.ts
│   │   └── job-status.value-object.ts
│   │
│   └── user/
│       ├── user.entity.ts
│       └── user.repository.ts
│
├── application/                     # Application Layer (Use Cases)
│   ├── commands/                    # CQRS Commands (Write Operations)
│   │   ├── init-upload/
│   │   │   ├── init-upload.command.ts
│   │   │   │   └── Interface: InitUploadCommand {
│   │   │       userId, photos[]
│   │   │   }
│   │   │   └── init-upload.handler.ts
│   │   │       └── Class: InitUploadHandler {
│   │   │           handle(command): Promise<InitUploadResult>
│   │   │           - Creates UploadJob
│   │   │           - Creates Photo records
│   │   │           - Generates presigned URLs
│   │   │       }
│   │   │
│   │   ├── complete-photo/
│   │   │   ├── complete-photo.command.ts
│   │   │   └── complete-photo.handler.ts
│   │   │       └── Class: CompletePhotoHandler {
│   │   │           - Updates photo status
│   │   │           - Updates job progress
│   │   │           - Publishes SSE event
│   │   │       }
│   │   │
│   │   └── fail-photo/
│   │       ├── fail-photo.command.ts
│   │       └── fail-photo.handler.ts
│   │
│   └── queries/                     # CQRS Queries (Read Operations)
│       ├── get-photos/
│       │   ├── get-photos.query.ts
│       │   │   └── Interface: GetPhotosQuery {
│       │       userId, page, limit
│       │   }
│       │   └── get-photos.handler.ts
│       │       └── Class: GetPhotosHandler {
│       │           handle(query): Promise<GetPhotosResult>
│       │           - Queries photos with pagination
│       │           - Returns formatted results
│       │       }
│       │
│       └── get-upload-job/
│           ├── get-upload-job.query.ts
│           └── get-upload-job.handler.ts
│
└── infrastructure/                  # Infrastructure Layer (External Adapters)
    ├── database/
    │   ├── schema.ts                # Drizzle schema definitions
    │   ├── connection.ts            # Database connection
    │   ├── migrations/              # SQL migrations
    │   └── repositories/            # Repository implementations
    │       ├── photo.repository.impl.ts
    │       ├── upload-job.repository.impl.ts
    │       └── user.repository.impl.ts
    │
    ├── storage/
    │   ├── r2.service.ts            # R2 adapter implementation
    │   │   └── Class: R2Service {
    │   │       generatePresignedUrl(key, contentType)
    │   │       deleteObject(key)
    │   │       getObjectUrl(key)
    │   │   }
    │   └── storage.interface.ts     # Storage port
    │
    ├── auth/
    │   ├── better-auth.ts           # Better-Auth configuration
    │   └── auth.middleware.ts       # Auth middleware
    │
    ├── sse/
    │   └── progress.service.ts      # SSE pub/sub service
    │       └── Class: ProgressService {
    │           subscribe(jobId, callback)
    │           publishProgress(jobId, data)
    │       }
    │
    ├── queue/                        # Job Queue [Post-MVP]
    │   ├── photo-queue.ts           # BullMQ queue setup
    │   ├── queue.config.ts           # Queue configuration
    │   └── workers/
    │       ├── base.worker.ts        # Base worker class
    │       ├── ai-tagging.worker.ts  # AI tagging worker
    │       └── thumbnail-generation.worker.ts # Thumbnail worker
    │
    ├── ai/                           # AI Services [Post-MVP]
    │   ├── rekognition.service.ts    # AWS Rekognition client
    │   └── rekognition.config.ts     # AWS configuration
    │
    └── http/                        # HTTP layer
        ├── routes/
        │   ├── auth.routes.ts       # Auth endpoints
        │   ├── upload.routes.ts     # Upload endpoints
        │   ├── photo.routes.ts      # Photo CRUD
        │   └── sse.routes.ts        # SSE endpoint
        │
        └── middlewares/
            ├── cors.middleware.ts
            ├── error.middleware.ts
            └── validation.middleware.ts
```

### CQRS Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                         HTTP Request                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Route Handler      │
              │   (Infrastructure)   │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐     ┌─────────┐     ┌────────┐
    │Command │     │  Query  │     │  Auth  │
    │Handler │     │ Handler │     │        │
    └────┬───┘     └────┬────┘     └────────┘
         │              │
         │ Write        │ Read
         │              │
         ▼              ▼
    ┌─────────────────────────────┐
    │      Domain Layer           │
    │   (Business Logic)          │
    │                             │
    │   - Entities                │
    │   - Value Objects           │
    │   - Repository Interfaces   │
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │  Infrastructure Layer       │
    │                             │
    │   - Repository Impls        │
    │   - Database (Drizzle)      │
    │   - Storage (R2)            │
    │   - Cache (Redis)           │
    └─────────────────────────────┘
```

### Vertical Slice Architecture

Each feature is organized as a vertical slice containing all layers:

```
Feature: Upload Photo
│
├── HTTP Route (/api/upload/init)
│       │
│       ▼
├── Command Handler (InitUploadHandler)
│       │
│       ▼
├── Domain Entities (Photo, UploadJob)
│       │
│       ▼
├── Repository Interface (PhotoRepository)
│       │
│       ▼
└── Repository Implementation (PhotoRepositoryImpl)
        │
        ▼
    Database (PostgreSQL)
```

**Benefits:**
- ✅ Feature-focused organization
- ✅ Easy to understand and modify
- ✅ Clear separation of concerns
- ✅ Testable at each layer

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────────────┐
│         users            │
├──────────────────────────┤
│ id (PK)          UUID    │
│ email            VARCHAR │
│ name             VARCHAR │
│ password_hash    TEXT    │
│ created_at       TIMESTAMP│
│ updated_at       TIMESTAMP│
└────────┬─────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────┐
│      upload_jobs         │
├──────────────────────────┤
│ id (PK)          UUID    │
│ user_id (FK)     UUID    │◀────┐
│ total_photos     INT     │     │
│ completed_photos INT     │     │
│ failed_photos    INT     │     │
│ status           VARCHAR │     │
│ created_at       TIMESTAMP│     │
│ completed_at     TIMESTAMP│     │
└────────┬─────────────────┘     │
         │                       │
         │ 1:N                   │
         │                       │
         ▼                       │
┌──────────────────────────┐     │
│         photos           │     │
├──────────────────────────┤     │
│ id (PK)          UUID    │     │
│ upload_job_id (FK) UUID  │─────┘
│ user_id (FK)     UUID    │
│ file_name        VARCHAR │
│ file_size        INT     │
│ mime_type        VARCHAR │
│ r2_key           TEXT    │
│ r2_url           TEXT    │
│ thumbnail_key    TEXT    │
│ status           VARCHAR │
│ tags             TEXT[]  │
│ suggested_tags   TEXT[]  │ [Post-MVP]
│ uploaded_at      TIMESTAMP│
│ created_at       TIMESTAMP│
└──────────────────────────┘

┌──────────────────────────┐
│   Better-Auth Tables     │
├──────────────────────────┤
│ - sessions               │
│ - accounts               │
│ - verifications          │
└──────────────────────────┘
```

### Table Definitions

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### upload_jobs
```sql
CREATE TABLE upload_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_photos INT NOT NULL,
    completed_photos INT DEFAULT 0,
    failed_photos INT DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- 'pending', 'in_progress', 'complete', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_upload_jobs_user_id ON upload_jobs(user_id);
CREATE INDEX idx_upload_jobs_status ON upload_jobs(status);
CREATE INDEX idx_upload_jobs_created_at ON upload_jobs(created_at DESC);
```

#### photos
```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_job_id UUID NOT NULL REFERENCES upload_jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    r2_key TEXT NOT NULL UNIQUE,
    r2_url TEXT,
    thumbnail_key TEXT,
    status VARCHAR(50) NOT NULL, -- 'pending', 'uploading', 'complete', 'failed'
    tags TEXT[], -- User-confirmed tags
    suggested_tags TEXT[], -- AI-suggested tags (Post-MVP)
    uploaded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_upload_job_id ON photos(upload_job_id);
CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_r2_key ON photos(r2_key);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags); -- [Post-MVP]
CREATE INDEX idx_photos_suggested_tags ON photos USING GIN(suggested_tags); -- [Post-MVP]
```

### Data Flow

```
Upload Job Creation:
1. User initiates upload → Create upload_jobs record (status: 'pending')
2. For each photo → Create photos record (status: 'pending')
3. Generate presigned URLs
4. Return to client

Upload Progress:
1. Client uploads to R2
2. Client notifies backend → Update photos.status = 'complete'
3. Update upload_jobs.completed_photos++
4. If completed + failed = total → upload_jobs.status = 'complete'

Gallery Query:
1. Client requests photos → Query photos WHERE user_id = ? ORDER BY created_at DESC
2. Return with pagination
```

---

## Real-Time Progress (SSE)

### Server-Sent Events Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   const eventSource = new EventSource(                         │
│     '/api/upload-progress/job-123'                             │
│   );                                                            │
│                                                                 │
│   eventSource.onmessage = (event) => {                         │
│     const data = JSON.parse(event.data);                       │
│     updateProgressUI(data);                                    │
│   };                                                            │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Connection
                             │ (Long-lived)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Hono API Server                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   GET /api/upload-progress/:jobId                              │
│                                                                 │
│   app.get('/upload-progress/:jobId', async (c) => {           │
│     return streamSSE(c, async (stream) => {                   │
│       // Send initial state                                    │
│       const job = await getUploadJob(jobId);                  │
│       await stream.writeSSE({                                 │
│         data: JSON.stringify(job)                             │
│       });                                                      │
│                                                                │
│       // Subscribe to updates                                  │
│       const unsubscribe = progressService.subscribe(          │
│         jobId,                                                │
│         async (update) => {                                   │
│           await stream.writeSSE({                             │
│             data: JSON.stringify(update)                      │
│           });                                                 │
│         }                                                     │
│       );                                                      │
│                                                                │
│       // Cleanup on disconnect                                 │
│       stream.onAbort(() => unsubscribe());                    │
│     });                                                        │
│   });                                                          │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Progress Service (In-Memory)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   class ProgressService {                                      │
│     private subscribers:                                       │
│       Map<jobId, Set<callback>>                               │
│                                                                │
│     subscribe(jobId, callback) {                              │
│       this.subscribers.get(jobId).add(callback);              │
│       return () => this.subscribers.get(jobId).delete(cb);    │
│     }                                                          │
│                                                                │
│     publishProgress(jobId, data) {                            │
│       const callbacks = this.subscribers.get(jobId);          │
│       callbacks.forEach(cb => cb(data));                      │
│     }                                                          │
│   }                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │
                             │ Called by CompletePhotoHandler
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                  Complete Photo Handler                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   async handle(command: CompletePhotoCommand) {                │
│     // 1. Update database                                      │
│     await photoRepo.updateStatus(photoId, 'complete');        │
│     await uploadJobRepo.updateProgress(jobId, ...);           │
│                                                                │
│     // 2. Publish SSE event                                    │
│     await progressService.publishProgress(jobId, {            │
│       photoId,                                                │
│       completedCount: 45,                                     │
│       totalCount: 100,                                        │
│       status: 'complete'                                      │
│     });                                                        │
│   }                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SSE vs WebSocket

**Why SSE over WebSocket?**

| Feature | SSE | WebSocket |
|---------|-----|-----------|
| **Direction** | Server → Client (one-way) | Bidirectional |
| **Protocol** | HTTP | WS protocol |
| **Reconnection** | Automatic | Manual |
| **Simplicity** | Simple to implement | More complex |
| **Use Case** | Progress updates, notifications | Real-time chat, gaming |

**For this project, SSE is perfect because:**
- ✅ We only need server → client updates (progress)
- ✅ Automatic reconnection if connection drops
- ✅ Simpler to implement than WebSocket
- ✅ Works over HTTP (no special protocol)
- ✅ Built-in browser support (EventSource API)

### Progress Event Format

```typescript
// Event data sent via SSE
interface ProgressEvent {
  jobId: string;
  photoId: string;
  fileName: string;
  status: 'pending' | 'uploading' | 'complete' | 'failed';
  completedCount: number;
  totalCount: number;
  failedCount: number;
  timestamp: string;
}

// Example SSE message
data: {
  "jobId": "job-123",
  "photoId": "photo-456",
  "fileName": "vacation.jpg",
  "status": "complete",
  "completedCount": 45,
  "totalCount": 100,
  "failedCount": 2,
  "timestamp": "2025-11-07T10:30:00Z"
}
```

---

## Authentication Flow

### Better-Auth Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                     Authentication Flow                         │
└─────────────────────────────────────────────────────────────────┘

Registration:
┌────────┐     POST /api/auth/signup     ┌──────────────┐
│ Client │ ──────────────────────────────▶│   Hono API   │
│        │  { email, password, name }     │              │
└────────┘                                │  Better-Auth │
                                          │              │
                                          │  1. Hash pwd │
                                          │  2. Create   │
                                          │     user     │
                                          │  3. Create   │
                                          │     session  │
                                          └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  PostgreSQL  │
                                          │              │
                                          │  - users     │
                                          │  - sessions  │
                                          └──────────────┘

Login:
┌────────┐     POST /api/auth/signin     ┌──────────────┐
│ Client │ ──────────────────────────────▶│   Hono API   │
│        │  { email, password }           │              │
└────┬───┘                                │  Better-Auth │
     │                                    │              │
     │  ◀──────────────────────────────────  1. Verify   │
     │  Set-Cookie: session=xyz           │     password │
     │  { user, token }                   │  2. Create   │
     │                                    │     session  │
     │                                    │  3. Return   │
     │                                    │     cookie   │
     │                                    └──────────────┘

Protected Request:
┌────────┐     GET /api/photos            ┌──────────────┐
│ Client │ ──────────────────────────────▶│   Hono API   │
│        │  Cookie: session=xyz           │              │
└────────┘                                │  Auth MW     │
                                          │              │
                                          │  1. Extract  │
                                          │     session  │
                                          │  2. Verify   │
                                          │     valid    │
                                          │  3. Load     │
                                          │     user     │
                                          │  4. Attach   │
                                          │     to ctx   │
                                          └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   Handler    │
                                          │              │
                                          │  c.get('user')│
                                          └──────────────┘
```

### Session Management

```typescript
// Better-Auth Configuration
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // For MVP
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  
  advanced: {
    generateId: () => crypto.randomUUID()
  }
});
```

### Authentication Middleware

```typescript
// Infrastructure layer
export async function authMiddleware(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });

  if (!session || !session.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Attach user to context
  c.set('user', session.user);
  
  await next();
}

// Usage in routes
app.use('/api/upload/*', authMiddleware);
app.use('/api/photos/*', authMiddleware);
```

---

## Frontend Architecture

### Web (Next.js 15)

```
apps/web/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── providers.tsx                 # React Query + Auth providers
│   │
│   ├── (auth)/                       # Auth route group
│   │   ├── layout.tsx                # Auth layout (centered form)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── register/
│   │       └── page.tsx              # Register page
│   │
│   └── (dashboard)/                  # Protected route group
│       ├── layout.tsx                # Dashboard layout (nav, protected)
│       ├── upload/
│       │   └── page.tsx              # Upload interface
│       └── gallery/
│           └── page.tsx              # Photo gallery
│
├── components/
│   ├── upload/
│   │   ├── DropZone.tsx              # Drag & drop area
│   │   ├── ImagePreview.tsx          # Selected images grid
│   │   ├── UploadProgress.tsx        # Progress bars + SSE
│   │   └── UploadButton.tsx
│   │
│   ├── gallery/
│   │   ├── PhotoGrid.tsx             # Responsive grid layout
│   │   ├── PhotoCard.tsx             # Individual photo card
│   │   └── PhotoModal.tsx            # Full-size viewer
│   │
│   └── shared/
│       ├── Button.tsx
│       ├── Spinner.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── auth-client.ts                # Better-Auth client
│   ├── hooks/
│   │   ├── use-auth.ts               # Auth hook
│   │   ├── use-upload.ts             # Upload hook
│   │   └── use-photos.ts             # Photos query hook
│   │
│   └── stores/
│       └── upload-store.ts           # Zustand upload state
│
└── app/
    └── globals.css                   # Tailwind CSS + theme variables
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     State Management                            │
└─────────────────────────────────────────────────────────────────┘

Server State (React Query):
┌────────────────────────────────────────────┐
│  - Photo gallery data                      │
│  - Upload job status                       │
│  - User profile                            │
│                                            │
│  Managed by @tanstack/react-query          │
│  - Automatic caching                       │
│  - Background refetching                   │
│  - Optimistic updates                      │
│  - Deduplication                           │
└────────────────────────────────────────────┘

Client State (Zustand):
┌────────────────────────────────────────────┐
│  - Selected files                          │
│  - Upload progress per file                │
│  - Upload job ID                           │
│  - UI state (modals, dropdowns)           │
│                                            │
│  Managed by zustand                        │
│  - Simple, lightweight                     │
│  - No boilerplate                          │
│  - TypeScript-first                        │
└────────────────────────────────────────────┘

Integration:
┌────────────────────────────────────────────┐
│                                            │
│   Upload Complete (Zustand)                │
│           │                                │
│           ▼                                │
│   queryClient.invalidateQueries(['photos'])│
│           │                                │
│           ▼                                │
│   React Query Refetches Gallery           │
│                                            │
└────────────────────────────────────────────┘
```

### React Query Configuration

```typescript
// app/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Usage in components
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['photos', page],
  queryFn: () => photoClient.getPhotos(page, 20),
  staleTime: 2 * 60 * 1000, // Override: 2 minutes for photos
});
```

---

## Mobile Architecture

### React Native + Expo Structure

```
apps/mobile/
│
├── app/                              # Expo Router (file-based)
│   ├── _layout.tsx                   # Root layout
│   │
│   ├── (auth)/                       # Auth stack
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   └── (tabs)/                       # Tab navigation
│       ├── _layout.tsx               # Tab bar setup
│       ├── index.tsx                 # Upload tab
│       └── gallery.tsx               # Gallery tab
│
├── components/
│   ├── upload/
│   │   ├── ImagePicker.tsx           # expo-image-picker wrapper
│   │   ├── ImagePreview.tsx          # Grid of selected images
│   │   └── UploadProgress.tsx        # Progress indicators
│   │
│   └── gallery/
│       ├── PhotoGrid.tsx             # FlatList grid
│       ├── PhotoCard.tsx
│       └── PhotoViewer.tsx           # Full-screen viewer
│
├── lib/
│   ├── auth-client.ts                # Better-Auth React Native client
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-upload.ts
│   │
│   └── stores/
│       └── upload-store.ts           # Shared with web (Zustand)
│
├── app.json                          # Expo configuration
└── eas.json                          # Expo Application Services
```

### Platform-Specific Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                 Mobile-Specific Implementations                 │
└─────────────────────────────────────────────────────────────────┘

File Upload:
┌────────────────────────────────────────────┐
│  Web:                                      │
│    fetch(presignedUrl, { body: file })     │
│                                            │
│  Mobile:                                   │
│    FileSystem.uploadAsync(                 │
│      presignedUrl,                         │
│      fileUri,                              │
│      { uploadType: BINARY_CONTENT }        │
│    )                                       │
└────────────────────────────────────────────┘

Image Selection:
┌────────────────────────────────────────────┐
│  Web:                                      │
│    <input type="file" multiple />          │
│    react-dropzone                          │
│                                            │
│  Mobile:                                   │
│    ImagePicker.launchImageLibraryAsync({   │
│      allowsMultipleSelection: true         │
│    })                                      │
└────────────────────────────────────────────┘

Storage:
┌────────────────────────────────────────────┐
│  Web:                                      │
│    localStorage / sessionStorage           │
│                                            │
│  Mobile:                                   │
│    expo-secure-store (for auth tokens)    │
│    AsyncStorage (for app data)            │
└────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Railway Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                         Railway Project                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                     API Service                       │    │
│   │   Source: GitHub (apps/api)                          │    │
│   │   Build: pnpm install && pnpm --filter api build     │    │
│   │   Start: pnpm --filter api start                     │    │
│   │   Port: 4000                                         │    │
│   │   URL: https://api-production-xxxx.railway.app      │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                    Web Service                        │    │
│   │   Source: GitHub (apps/web)                          │    │
│   │   Build: pnpm install && pnpm --filter web build     │    │
│   │   Start: pnpm --filter web start                     │    │
│   │   Port: 3000                                         │    │
│   │   URL: https://web-production-xxxx.railway.app       │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │                  PostgreSQL Database                  │    │
│   │   Type: Managed PostgreSQL                           │    │
│   │   Version: 14                                        │    │
│   │   Storage: 10GB                                      │    │
│   │   Backups: Daily                                     │    │
│   │   URL: Auto-injected as DATABASE_URL                │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare R2                              │
├─────────────────────────────────────────────────────────────────┤
│   Bucket: rapidphoto-uploads                                    │
│   Region: Auto (global edge network)                            │
│   Public Access: Enabled (for photo viewing)                    │
│   CORS: Configured for presigned URLs                           │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variables

```
API Service (Railway):
┌────────────────────────────────────────────┐
│  DATABASE_URL          (from Railway)      │
│  R2_ACCOUNT_ID         (from Cloudflare)   │
│  R2_ACCESS_KEY_ID      (from Cloudflare)   │
│  R2_SECRET_ACCESS_KEY  (from Cloudflare)   │
│  R2_BUCKET_NAME        rapidphoto-uploads  │
│  R2_PUBLIC_URL         https://...r2.dev   │
│  JWT_SECRET            (generate secure)   │
│  NODE_ENV              production          │
│  PORT                  4000                │
└────────────────────────────────────────────┘

Web Service (Railway):
┌────────────────────────────────────────────┐
│  NEXT_PUBLIC_API_URL                       │
│    → https://api-production-xxxx.railway.app│
└────────────────────────────────────────────┘

Mobile App (Expo):
┌────────────────────────────────────────────┐
│  EXPO_PUBLIC_API_URL                       │
│    → https://api-production-xxxx.railway.app│
└────────────────────────────────────────────┘
```

### Continuous Deployment

```
┌──────────────┐
│   GitHub     │
│  Repository  │
└──────┬───────┘
       │
       │ git push
       │
       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Railway    │────▶  │     Build    │────▶  │    Deploy    │
│   Webhook    │       │   & Test     │       │   Services   │
└──────────────┘       └──────────────┘       └──────────────┘
                             │
                             ├─ Run migrations
                             ├─ Run tests (optional)
                             └─ Deploy on success

Deployment Triggers:
- Push to main branch → Deploy to production
- Push to dev branch → Deploy to staging (optional)
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
┌────────────────────────────────────────────┐
│  - HTTPS only (enforced)                   │
│  - TLS 1.3                                 │
│  - HSTS headers                            │
└────────────────────────────────────────────┘

Layer 2: Authentication
┌────────────────────────────────────────────┐
│  - Better-Auth (session-based)             │
│  - Secure password hashing (bcrypt)        │
│  - HttpOnly cookies for session            │
│  - CSRF protection                         │
└────────────────────────────────────────────┘

Layer 3: Authorization
┌────────────────────────────────────────────┐
│  - Middleware checks on all routes         │
│  - User can only access own photos         │
│  - Presigned URLs expire in 1 hour         │
└────────────────────────────────────────────┘

Layer 4: Input Validation
┌────────────────────────────────────────────┐
│  - Zod schema validation                   │
│  - File type validation                    │
│  - File size limits (10MB)                 │
│  - SQL injection prevention (ORM)          │
└────────────────────────────────────────────┘

Layer 5: Rate Limiting (Optional)
┌────────────────────────────────────────────┐
│  - Per-user upload limits                  │
│  - API rate limiting                       │
│  - DDoS protection (Railway)               │
└────────────────────────────────────────────┘
```

### Data Security

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data at Rest                             │
├─────────────────────────────────────────────────────────────────┤
│  Database:                                                      │
│    - Encrypted by Railway                                       │
│    - Backups encrypted                                          │
│    - Password hashing with bcrypt                               │
│                                                                 │
│  Storage (R2):                                                  │
│    - Optional server-side encryption                            │
│    - Access via presigned URLs only                             │
│    - No public listing of buckets                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Data in Transit                          │
├─────────────────────────────────────────────────────────────────┤
│  - HTTPS for all API calls                                      │
│  - Presigned URLs use HTTPS                                     │
│  - Secure WebSocket/SSE connections                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Scalability Considerations

### Current Architecture (MVP)

```
Concurrent Users: ~10-50
Uploads per User: 100 photos
Database: Single PostgreSQL instance
Storage: Cloudflare R2 (globally distributed)
API: Single Railway container

Bottlenecks:
- Single API instance
- In-memory SSE pub/sub (doesn't scale across instances)
- No caching layer
```

### Future Scalability (Phase 2)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Horizontal Scaling                           │
└─────────────────────────────────────────────────────────────────┘

Multiple API Instances:
┌────────────┐   ┌────────────┐   ┌────────────┐
│  API Pod 1 │   │  API Pod 2 │   │  API Pod 3 │
└─────┬──────┘   └─────┬──────┘   └─────┬──────┘
      │                │                │
      └────────────────┴────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              └────────────────┘

Redis for SSE Pub/Sub:
┌────────────────────────────────────────────┐
│           Redis Pub/Sub                    │
│                                            │
│  API Pod 1 ──▶ Redis ──▶ API Pod 2        │
│  (publishes)          (subscribes)         │
│                                            │
│  Enables cross-instance SSE broadcasts    │
└────────────────────────────────────────────┘

Database Optimizations:
┌────────────────────────────────────────────┐
│  - Read replicas for queries               │
│  - Connection pooling (pgBouncer)          │
│  - Indexed columns for fast lookups        │
│  - Partitioning by user_id (sharding)     │
└────────────────────────────────────────────┘

Caching Layer:
┌────────────────────────────────────────────┐
│  Redis Cache                               │
│  - Photo metadata (TTL: 5 minutes)         │
│  - User sessions                           │
│  - Upload job status                       │
└────────────────────────────────────────────┘

CDN:
┌────────────────────────────────────────────┐
│  Cloudflare CDN                            │
│  - Cache R2 photos at edge                 │
│  - Reduce latency globally                 │
└────────────────────────────────────────────┘
```

### Performance Benchmarks

```
Target Performance (100 concurrent uploads):

Upload Time:
- 100 photos × 2MB = 200MB total
- On 50 Mbps connection: ~32 seconds theoretical
- With overhead: ~60-90 seconds actual
✅ Target: < 90 seconds

UI Responsiveness:
- Upload operations non-blocking
- Progress updates < 100ms latency
- Gallery load < 2 seconds
✅ Target: Smooth 60fps UI

Database Queries:
- Photo listing: < 100ms
- Upload job creation: < 50ms
- Status updates: < 50ms
✅ Target: < 200ms for all queries

Storage:
- Presigned URL generation: < 50ms
- Direct upload to R2: Limited by user bandwidth
- Global edge network ensures low latency
✅ Target: < 100ms URL generation
```

---

## Summary

### Key Architectural Decisions

1. **Direct Upload with Presigned URLs**
   - Bypasses backend for file transfer
   - Enables true parallel uploads
   - Reduces server load and cost

2. **DDD/CQRS/Vertical Slice Architecture**
   - Clean separation of concerns
   - Testable and maintainable
   - Scalable design patterns

3. **Server-Sent Events for Real-time Updates**
   - Simpler than WebSocket
   - Perfect for one-way updates
   - Automatic reconnection

4. **Monorepo with Shared Code**
   - Type-safe API client
   - Shared validation schemas
   - Consistent business logic

5. **Railway + Cloudflare R2**
   - Simple deployment
   - Cost-effective
   - Global edge network for storage

### Architecture Strengths

✅ Scalable from day one
✅ Type-safe end-to-end
✅ Fast uploads (parallel, direct-to-cloud)
✅ Real-time progress tracking
✅ Clean, maintainable codebase
✅ Production-ready patterns
✅ Cost-effective infrastructure

### Post-MVP Enhancements (Slice 6)

- [x] Job queue (BullMQ + Redis) - **Implemented in Slice 6**
- [x] Thumbnail generation - **Implemented in Slice 6**
- [x] AI tagging (AWS Rekognition) - **Implemented in Slice 6**
- [x] Tag-based search - **Implemented in Slice 6**

### Future Enhancements

- [ ] Image optimization
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] HEIC format support

---

---

## Post-MVP Architecture: AI Tagging, Thumbnails & Search (Slice 6)

### Job Queue Architecture

The post-MVP enhancement adds a job queue system using BullMQ and Redis for background processing of AI tagging and thumbnail generation.

```
Photo Upload Complete
        ↓
Queue Multiple Jobs (parallel)
        ├─→ AI Tagging Job
        └─→ Thumbnail Generation Job
        ↓
Workers Process Independently
        ├─→ AI Tagging: 1-3 seconds per photo
        └─→ Thumbnail: 0.5-2 seconds per photo
        ↓
Update Photo Record
        ├─→ suggested_tags (AI suggestions)
        └─→ thumbnail_key (thumbnail URL)
```

### AWS Rekognition Integration

**Configuration:**
- Service: AWS Rekognition DetectLabels
- Cost: ~$1.00 per 1,000 images
- Response Time: 1-2 seconds per image
- Confidence Threshold: ≥70%

**Flow:**
1. Photo upload completes
2. AI tagging job queued
3. Worker calls AWS Rekognition with R2 URL
4. Filter tags by confidence (≥70%)
5. Store in `suggested_tags` array
6. User can accept/reject suggestions

### Tag Management Architecture

**Tag States:**
- **User-Confirmed Tags** (`tags` array): Tags manually added or accepted from AI suggestions
- **AI-Suggested Tags** (`suggested_tags` array): Tags generated by AI (≥70% confidence), pending user acceptance

**Tag Flow:**
```
AI Tagging → suggested_tags (pending)
        ↓
User Accepts → tags (confirmed)
User Rejects → removed from suggested_tags
```

**Search Options:**
- **User Tags Only**: Search only `tags` array (default)
- **Include AI Suggestions**: Search both `tags` and `suggested_tags` arrays
- **Multi-Tag Search**: AND logic (all tags must match)

### Thumbnail Generation Architecture

**Processing:**
- Library: Sharp (image processing)
- Size: 300x300 pixels (configurable)
- Format: JPEG (optimized)
- Storage: R2 (separate from full images)

**Flow:**
1. Photo upload completes
2. Thumbnail generation job queued
3. Worker downloads image from R2
4. Resize and compress with Sharp
5. Upload thumbnail to R2
6. Update photo record with `thumbnail_key`

**Performance:**
- Processing Time: 0.5-2 seconds per photo
- Storage Overhead: ~50-200KB per thumbnail
- Cost: Negligible (local CPU processing)

### Tag Search Architecture

**Query Logic:**
```sql
-- User tags only (includeSuggested=false)
WHERE tags @> ARRAY['beach', 'sunset']

-- Include AI suggestions (includeSuggested=true)
WHERE (
  tags @> ARRAY['beach', 'sunset'] OR
  suggested_tags @> ARRAY['beach', 'sunset']
)
```

**Indexes:**
- GIN indexes on both `tags` and `suggested_tags` arrays
- Fast array containment queries
- Supports multi-tag AND logic

**Autocomplete:**
- Endpoint: `GET /api/tags?prefix=bea`
- Returns: Distinct user-confirmed tags only
- Use Case: TagInput component suggestions

---

**Architecture designed for RapidPhotoUpload MVP - Ready for implementation! 🚀**
