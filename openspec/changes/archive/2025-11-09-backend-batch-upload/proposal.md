# Change: Backend Batch Upload & Progress Tracking

## Why
Enable users to upload multiple photos (up to 100) simultaneously with real-time progress tracking. This extends the single photo upload functionality to support batch operations, including upload job management, progress tracking via Server-Sent Events (SSE), and error handling for failed uploads.

## What Changes
- Create Upload Job entity and repository for tracking batch uploads
- Add upload_jobs table to database schema
- Update InitUploadHandler to support multiple photos and create upload jobs
- Update CompletePhotoHandler to track progress and check job completion
- Create FailPhotoCommand and handler for handling upload failures
- Create progress service with in-memory pub/sub for real-time updates
- Create SSE route for streaming upload progress (`GET /api/upload-progress/:jobId`)
- Add fail photo endpoint (`POST /api/photos/:id/failed`)

## Impact
- Affected specs: `api`
- Affected code:
  - `apps/api/src/domain/upload-job/` (new)
  - `apps/api/src/infrastructure/database/schema.ts` (modified)
  - `apps/api/src/infrastructure/database/repositories/upload-job.repository.impl.ts` (new)
  - `apps/api/src/application/commands/init-upload/init-upload.handler.ts` (modified)
  - `apps/api/src/application/commands/complete-photo/complete-photo.handler.ts` (modified)
  - `apps/api/src/application/commands/fail-photo/` (new)
  - `apps/api/src/infrastructure/sse/progress.service.ts` (new)
  - `apps/api/src/infrastructure/http/routes/sse.routes.ts` (new)
  - `apps/api/src/infrastructure/http/routes/upload.routes.ts` (modified)
  - `apps/api/src/index.ts` (modified)

