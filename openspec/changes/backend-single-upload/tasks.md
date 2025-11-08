## 1. Setup Cloudflare R2
- [ ] 1.1 Create Cloudflare account and R2 bucket (`rapidphoto-uploads`)
- [ ] 1.2 Generate API tokens and add credentials to `.env`
- [ ] 1.3 Create R2 service (`apps/api/src/infrastructure/storage/r2.service.ts`)
- [ ] 1.4 Test presigned URL generation

## 2. Photo Domain
- [ ] 2.1 Create Photo entity (`apps/api/src/domain/photo/photo.entity.ts`)
- [ ] 2.2 Create Photo repository interface (`apps/api/src/domain/photo/photo.repository.ts`)
- [ ] 2.3 Update Drizzle schema with photos table
- [ ] 2.4 Generate and apply photos migration
- [ ] 2.5 Implement Photo repository (`apps/api/src/infrastructure/database/repositories/photo.repository.impl.ts`)

## 3. Upload Commands
- [ ] 3.1 Create InitUploadCommand DTO
- [ ] 3.2 Create InitUploadHandler (single photo)
- [ ] 3.3 Create CompletePhotoCommand DTO
- [ ] 3.4 Create CompletePhotoHandler

## 4. Upload Routes
- [ ] 4.1 Create upload routes (`apps/api/src/infrastructure/http/routes/upload.routes.ts`)
- [ ] 4.2 Mount upload routes in main app
- [ ] 4.3 Test single photo upload flow

