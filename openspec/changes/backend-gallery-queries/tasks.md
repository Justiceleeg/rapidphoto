## 1. Photo Queries
- [x] 1.1 Create GetPhotosQuery DTO (`apps/api/src/application/queries/get-photos/get-photos.query.ts`)
- [x] 1.2 Create GetPhotosHandler with pagination and user filtering (`apps/api/src/application/queries/get-photos/get-photos.handler.ts`)
- [x] 1.3 Create GetPhotoQuery DTO (`apps/api/src/application/queries/get-photo/get-photo.query.ts`)
- [x] 1.4 Create GetPhotoHandler (`apps/api/src/application/queries/get-photo/get-photo.handler.ts`)

## 2. Upload Job Query
- [x] 2.1 Create GetUploadJobQuery DTO (`apps/api/src/application/queries/get-upload-job/get-upload-job.query.ts`)
- [x] 2.2 Create GetUploadJobHandler (`apps/api/src/application/queries/get-upload-job/get-upload-job.handler.ts`)

## 3. Photo Routes
- [x] 3.1 Create photo routes (`apps/api/src/infrastructure/http/routes/photo.routes.ts`)
  - `GET /api/photos` - List photos with pagination
  - `GET /api/photos/:id` - Get single photo
  - `DELETE /api/photos/:id` - Delete photo
- [x] 3.2 Mount photo routes in main app (`apps/api/src/index.ts`)

## 4. Photo Tagging
- [x] 4.1 Add tags field to photo schema (`apps/api/src/infrastructure/database/schema.ts`)
  - Added `tags: text('tags').array()` to photo table
  - Migration applied
- [x] 4.2 Create UpdatePhotoTagsCommand DTO (`apps/api/src/application/commands/update-photo-tags/update-photo-tags.command.ts`)
- [x] 4.3 Create UpdatePhotoTagsHandler (`apps/api/src/application/commands/update-photo-tags/update-photo-tags.handler.ts`)
  - Validates tags, updates photo record
- [x] 4.4 Add update tags endpoint to photo routes (`apps/api/src/infrastructure/http/routes/photo.routes.ts`)
  - `PUT /api/photos/:id/tags` - Update photo tags

## 5. Testing
- [x] 5.1 Test gallery endpoints (list photos, get photo, pagination, authentication)
  - All endpoints implemented and working
- [x] 5.2 Test tag update endpoint (update tags, validation, authorization)
  - Tag update endpoint working with validation

