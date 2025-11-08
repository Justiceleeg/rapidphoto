# Change: Deploy Single Photo Upload

## Why
Deploy the single photo upload functionality to production. This ensures the upload feature is available in the production environment with proper configuration for R2 storage and API endpoints.

## What Changes
- Update Railway environment variables with R2 credentials
- Redeploy API with upload functionality
- Update web environment to use production API
- Redeploy web with upload functionality
- Test single photo upload in production

## Impact
- Affected specs: `infrastructure`
- Affected code:
  - Railway environment variables (modified)
  - Production deployments (API and Web services)

