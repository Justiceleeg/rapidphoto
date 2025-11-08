## 1. Setup Cloudflare R2
- [x] 1.1 Create Cloudflare account and R2 bucket (`rapidphoto-uploads`)
- [x] 1.2 Generate API tokens and add credentials to `.env`
- [x] 1.3 Create R2 service (`apps/api/src/infrastructure/storage/r2.service.ts`)
- [x] 1.4 Test presigned URL generation

## 2. Photo Domain
- [x] 2.1 Create Photo entity (`apps/api/src/domain/photo/photo.entity.ts`)
- [x] 2.2 Create Photo repository interface (`apps/api/src/domain/photo/photo.repository.ts`)
- [x] 2.3 Update Drizzle schema with photos table
- [x] 2.4 Generate and apply photos migration
- [x] 2.5 Implement Photo repository (`apps/api/src/infrastructure/database/repositories/photo.repository.impl.ts`)

## 3. Upload Commands
- [x] 3.1 Create InitUploadCommand DTO
- [x] 3.2 Create InitUploadHandler (single photo)
- [x] 3.3 Create CompletePhotoCommand DTO
- [x] 3.4 Create CompletePhotoHandler

## 4. Upload Routes
- [x] 4.1 Create upload routes (`apps/api/src/infrastructure/http/routes/upload.routes.ts`)
- [x] 4.2 Mount upload routes in main app
- [ ] 4.3 Test single photo upload flow

