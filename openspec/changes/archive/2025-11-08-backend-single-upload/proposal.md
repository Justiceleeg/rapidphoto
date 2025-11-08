# Change: Backend Single Photo Upload

## Why
Enable users to upload a single photo to the system. This is the foundation for photo upload functionality, implementing the backend infrastructure for Cloudflare R2 storage, photo entity management, and upload endpoints.

## What Changes
- Setup Cloudflare R2 storage service with presigned URL generation
- Create Photo domain entity and repository
- Add photos table to database schema
- Implement upload initialization and completion handlers
- Create upload API endpoints (`POST /api/upload/init`, `POST /api/photos/:id/complete`)
- Add R2 service for direct client uploads

## Impact
- Affected specs: `api`
- Affected code: 
  - `apps/api/src/infrastructure/storage/r2.service.ts` (new)
  - `apps/api/src/domain/photo/` (new)
  - `apps/api/src/infrastructure/database/schema.ts` (modified)
  - `apps/api/src/application/commands/init-upload/` (new)
  - `apps/api/src/application/commands/complete-photo/` (new)
  - `apps/api/src/infrastructure/http/routes/upload.routes.ts` (new)
  - `apps/api/src/index.ts` (modified)

