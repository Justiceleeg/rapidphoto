# Change: Thumbnail Generation (Slice 6A)

## Why
Improve gallery loading performance by generating and serving optimized thumbnails for photos. Currently, the gallery displays full-size images which causes slow loading times, especially with many photos. This change adds automatic thumbnail generation on upload using a job queue system.

## What Changes
- Setup Redis and BullMQ job queue infrastructure
- Add `thumbnail_key` field to photo schema
- Create thumbnail generation worker using Sharp for image processing
- Queue thumbnail generation jobs after photo upload completion
- Update PhotoGrid components (web and mobile) to display thumbnails with fallback to full images
- Deploy Redis to Railway and configure production environment

## Impact
- Affected specs: `api`, `infrastructure`, `web`, `mobile`
- Affected code:
  - `apps/api/package.json` (add BullMQ, ioredis, sharp dependencies)
  - `apps/api/src/infrastructure/queue/` (new - job queue infrastructure)
  - `apps/api/src/infrastructure/database/schema.ts` (add thumbnail_key field)
  - `apps/api/src/domain/photo/photo.entity.ts` (add thumbnailKey field)
  - `apps/api/src/application/commands/complete-photo/complete-photo.handler.ts` (queue thumbnail job)
  - `apps/web/components/gallery/PhotoGrid.tsx` (display thumbnails)
  - `apps/web/components/gallery/PhotoModal.tsx` (show full image)
  - `apps/mobile/components/gallery/PhotoGrid.tsx` (display thumbnails)
  - Railway configuration (add Redis service, env vars)

