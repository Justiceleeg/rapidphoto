## 1. Backend - Database Schema & AWS Rekognition
- [x] 1.1 Add `suggested_tags` field to photo schema (`apps/api/src/infrastructure/database/schema.ts` - add `suggestedTags: text('suggested_tags').array()`)
- [x] 1.2 Add GIN indexes for tag search (create migration with indexes on `tags` and `suggested_tags`)
- [x] 1.3 Generate and apply migration (`pnpm db:generate && pnpm db:migrate`)
- [x] 1.4 Update Photo entity interface (`apps/api/src/domain/photo/photo.entity.ts` - add `suggestedTags?: string[]`)
- [x] 1.5 Update PhotoRepository interface (`apps/api/src/domain/photo/photo.repository.ts` - ensure update method supports new fields)
- [x] 1.6 Setup AWS Rekognition client (`pnpm add @aws-sdk/client-rekognition`, create `apps/api/src/infrastructure/ai/rekognition.service.ts` and `rekognition.config.ts`)
- [x] 1.7 Create AI tagging worker (`apps/api/src/infrastructure/queue/workers/ai-tagging.worker.ts` - download image, call Rekognition DetectLabels, filter ≥70% confidence, store in `suggested_tags`)
- [x] 1.8 Register AI tagging worker (`apps/api/src/infrastructure/queue/workers/index.ts`)
- [x] 1.9 Queue tagging job after photo completion (`apps/api/src/application/commands/complete-photo/complete-photo.handler.ts` - queue AI tagging job alongside thumbnail job)
- [ ] 1.10 Test AI tagging worker (upload photo, verify job queued, verify tags generated with ≥70% confidence, verify stored in `suggested_tags`)

## 2. Backend - AI Tag Acceptance/Rejection
- [x] 2.1 Create AcceptTagCommand DTO (`apps/api/src/application/commands/accept-tag/accept-tag.command.ts`)
- [x] 2.2 Create AcceptTagHandler (`apps/api/src/application/commands/accept-tag/accept-tag.handler.ts` - move tag from `suggested_tags` to `tags`, validate tag exists)
- [x] 2.3 Create RejectTagCommand DTO (`apps/api/src/application/commands/reject-tag/reject-tag.command.ts`)
- [x] 2.4 Create RejectTagHandler (`apps/api/src/application/commands/reject-tag/reject-tag.handler.ts` - remove tag from `suggested_tags`)
- [x] 2.5 Add accept/reject endpoints (`apps/api/src/infrastructure/http/routes/photo.routes.ts` - `POST /api/photos/:id/tags/accept` and `POST /api/photos/:id/tags/reject`)
- [x] 2.6 Test accept/reject endpoints (verify accept moves tag to `tags`, verify reject removes from `suggested_tags`, verify authorization)

## 3. Web Frontend - AI Suggestions
- [x] 3.1 Update photo client with accept/reject methods (`packages/api-client/src/photo.client.ts` - add `acceptTag(photoId, tag)` and `rejectTag(photoId, tag)`)
- [x] 3.2 Update PhotoModal to display AI suggestions (`apps/web/components/gallery/PhotoModal.tsx` - show `suggested_tags` separately with different styling, add Accept/Reject buttons)
- [x] 3.3 Add accept/reject handlers (`apps/web/components/gallery/PhotoModal.tsx` - handle accept/reject actions, update UI optimistically)
- [ ] 3.4 Test AI suggestions in PhotoModal (verify AI suggestions display, verify accept moves to tags, verify reject removes)

## 4. Mobile Frontend - AI Suggestions
- [ ] 4.1 Update PhotoViewer to show AI suggestions (`apps/mobile/components/gallery/PhotoViewer.tsx` - display `suggested_tags` separately with different styling, add Accept/Reject buttons)
- [ ] 4.2 Test mobile AI suggestions (verify display, verify accept/reject actions, test on iOS and Android)

## 5. Deploy AI Tagging
- [ ] 5.1 Update API environment variables with AWS credentials (set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` on Railway)
- [ ] 5.2 Redeploy API with AI tagging (push changes, verify Railway auto-deploys)
- [ ] 5.3 Test AI tagging in production (upload photo, verify AI tagging job runs, verify tags generated with ≥70% confidence, verify accept/reject works on web and mobile)

