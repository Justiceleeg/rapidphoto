## 1. Backend - Job Queue & Thumbnail Generation
- [ ] 1.1 Setup Redis on Railway (add Redis service, copy connection URL to `.env`, test connection)
- [ ] 1.2 Install BullMQ dependencies (`pnpm add bullmq ioredis`)
- [ ] 1.3 Create queue infrastructure (`apps/api/src/infrastructure/queue/photo-queue.ts`, `queue.config.ts`)
- [ ] 1.4 Create base worker structure (`apps/api/src/infrastructure/queue/workers/base.worker.ts`)
- [ ] 1.5 Add `thumbnail_key` field to photo schema (`apps/api/src/infrastructure/database/schema.ts`)
- [ ] 1.6 Generate and apply migration (`pnpm db:generate && pnpm db:migrate`)
- [ ] 1.7 Update Photo entity interface (`apps/api/src/domain/photo/photo.entity.ts` - add `thumbnailKey?: string`)
- [ ] 1.8 Install Sharp for image processing (`pnpm add sharp`)
- [ ] 1.9 Create thumbnail generation worker (`apps/api/src/infrastructure/queue/workers/thumbnail-generation.worker.ts`)
- [ ] 1.10 Register thumbnail generation worker (`apps/api/src/infrastructure/queue/workers/index.ts`)
- [ ] 1.11 Queue thumbnail job after photo completion (`apps/api/src/application/commands/complete-photo/complete-photo.handler.ts`)
- [ ] 1.12 Test thumbnail generation (upload photo, verify job queued, verify thumbnail generated and stored in R2, verify `thumbnail_key` updated)

## 2. Web Frontend - Display Thumbnails
- [ ] 2.1 Update PhotoGrid to show thumbnails (`apps/web/components/gallery/PhotoGrid.tsx` - use `thumbnail_key` with fallback, lazy load)
- [ ] 2.2 Update PhotoModal to show full image (`apps/web/components/gallery/PhotoModal.tsx` - use full `r2Url`)
- [ ] 2.3 Test thumbnail display on web (verify thumbnails load in gallery, verify full image in modal, verify fallback works)

## 3. Mobile Frontend - Display Thumbnails
- [ ] 3.1 Update mobile PhotoGrid to use thumbnails (`apps/mobile/components/gallery/PhotoGrid.tsx` - use thumbnails in grid, full images in viewer)
- [ ] 3.2 Test thumbnails on mobile (verify thumbnails load, verify full image in viewer, test on iOS and Android)

## 4. Deploy Thumbnail Generation
- [ ] 4.1 Deploy Redis to Railway (ensure service running and accessible)
- [ ] 4.2 Update API environment variables (`REDIS_URL` from Railway)
- [ ] 4.3 Redeploy with thumbnail generation (upload photo in production, verify thumbnail job runs, verify thumbnail generated, verify accessible via URL on web and mobile)

