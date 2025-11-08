## 1. Upload Job Domain
- [ ] 1.1 Create Upload Job entity (`apps/api/src/domain/upload-job/upload-job.entity.ts`)
- [ ] 1.2 Create Upload Job repository interface (`apps/api/src/domain/upload-job/upload-job.repository.ts`)
- [ ] 1.3 Update Drizzle schema with upload_jobs table
- [ ] 1.4 Generate and apply upload_jobs migration
- [ ] 1.5 Implement Upload Job repository (`apps/api/src/infrastructure/database/repositories/upload-job.repository.impl.ts`)

## 2. Batch Upload Commands
- [ ] 2.1 Update InitUploadHandler for batch uploads (handle multiple photos, create upload job)
- [ ] 2.2 Update CompletePhotoHandler to track progress and check job completion
- [ ] 2.3 Create FailPhotoCommand DTO
- [ ] 2.4 Create FailPhotoHandler

## 3. Progress Tracking
- [ ] 3.1 Create progress service with in-memory pub/sub (`apps/api/src/infrastructure/sse/progress.service.ts`)
- [ ] 3.2 Update CompletePhotoHandler to publish progress events
- [ ] 3.3 Create SSE route for upload progress (`apps/api/src/infrastructure/http/routes/sse.routes.ts`)
- [ ] 3.4 Mount SSE routes in main app

## 4. Upload Routes
- [ ] 4.1 Add fail photo endpoint to upload routes (`POST /api/photos/:id/failed`)
- [ ] 4.2 Test batch upload and SSE (init with 10 photos, connect to SSE, verify progress updates, verify job completion)

