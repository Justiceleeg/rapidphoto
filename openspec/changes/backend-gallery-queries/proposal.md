# Change: Backend Gallery Queries

## Why
Enable users to query and view their uploaded photos through a gallery interface. This adds query endpoints to retrieve photos with pagination, get individual photo details, and retrieve upload job information for tracking batch upload status.

## What Changes
- Create GetPhotosQuery DTO and handler for listing photos with pagination
- Create GetPhotoQuery DTO and handler for retrieving a single photo
- Create GetUploadJobQuery DTO and handler for retrieving upload job details
- Create photo routes with endpoints: `GET /api/photos`, `GET /api/photos/:id`, `DELETE /api/photos/:id`
- Mount photo routes in main app

## Impact
- Affected specs: `api`
- Affected code:
  - `apps/api/src/application/queries/get-photos/` (new)
  - `apps/api/src/application/queries/get-photo/` (new)
  - `apps/api/src/application/queries/get-upload-job/` (new)
  - `apps/api/src/infrastructure/http/routes/photo.routes.ts` (new)
  - `apps/api/src/index.ts` (modified)

