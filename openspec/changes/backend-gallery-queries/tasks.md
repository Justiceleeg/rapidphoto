## 1. Photo Queries
- [ ] 1.1 Create GetPhotosQuery DTO (`apps/api/src/application/queries/get-photos/get-photos.query.ts`)
- [ ] 1.2 Create GetPhotosHandler with pagination and user filtering (`apps/api/src/application/queries/get-photos/get-photos.handler.ts`)
- [ ] 1.3 Create GetPhotoQuery DTO (`apps/api/src/application/queries/get-photo/get-photo.query.ts`)
- [ ] 1.4 Create GetPhotoHandler (`apps/api/src/application/queries/get-photo/get-photo.handler.ts`)

## 2. Upload Job Query
- [ ] 2.1 Create GetUploadJobQuery DTO (`apps/api/src/application/queries/get-upload-job/get-upload-job.query.ts`)
- [ ] 2.2 Create GetUploadJobHandler (`apps/api/src/application/queries/get-upload-job/get-upload-job.handler.ts`)

## 3. Photo Routes
- [ ] 3.1 Create photo routes (`apps/api/src/infrastructure/http/routes/photo.routes.ts`)
  - `GET /api/photos` - List photos with pagination
  - `GET /api/photos/:id` - Get single photo
  - `DELETE /api/photos/:id` - Delete photo
- [ ] 3.2 Mount photo routes in main app (`apps/api/src/index.ts`)

## 4. Testing
- [ ] 4.1 Test gallery endpoints (list photos, get photo, pagination, authentication)

