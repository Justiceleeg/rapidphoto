# Change: Deploy Batch Upload

## Why
Deploy the batch upload functionality with progress tracking to production. This ensures the batch upload feature is available in the production environment with proper configuration for SSE endpoints and batch upload capabilities.

## What Changes
- Redeploy API with batch upload and SSE functionality
- Redeploy web with batch upload functionality
- Test batch upload in production (50 photos from web, 50 photos from mobile)
- Verify real-time progress updates work in production
- Verify all photos are stored correctly in R2
- Verify job completion tracking works correctly

## Impact
- Affected specs: `infrastructure`
- Affected code:
  - Production deployments (API and Web services)
  - Railway environment configuration

