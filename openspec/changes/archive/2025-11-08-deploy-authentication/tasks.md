## 1. API Deployment
- [x] 1.1 Deploy API to Railway (S1-46)
  - [x] Add API service to Railway project
  - [x] Set root directory: `apps/api`
  - [x] Set build command: `pnpm install && pnpm --filter @rapidphoto/api build`
  - [x] Set start command: `pnpm --filter @rapidphoto/api start:prod` (with auto-migrations)
  - [x] Configure environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV, ALLOWED_ORIGINS)
  - [x] Run migrations: `pnpm --filter @rapidphoto/api db:migrate` (runs automatically on deployment)
  - [x] Test: `https://api-production-18fb.up.railway.app/health`

## 2. Web Deployment
- [x] 2.1 Deploy Web to Railway (S1-47)
  - [x] Add web service to Railway project
  - [x] Set root directory: `apps/web`
  - [x] Set build command: `pnpm install && pnpm --filter @rapidphoto/web build`
  - [x] Set start command: `pnpm --filter @rapidphoto/web start` (with `-H 0.0.0.0 -p $PORT`)
  - [x] Configure environment: `NEXT_PUBLIC_API_URL=https://api-production-18fb.up.railway.app`
  - [x] Configure custom domain port: 8080
  - [x] Test: Visit web URL, test login/register

## 3. Mobile Configuration
- [x] 3.1 Update mobile to use production API (S1-48)
  - [x] Update `apps/mobile/app.json` (using `extra.apiUrl`)
  - [x] Set API URL to production API URL: `https://api-production-18fb.up.railway.app`

## 4. Production Testing
- [x] 4.1 Test authentication in production (S1-49)
  - [x] Register new user on web
  - [x] Login on web
  - [x] Register new user on mobile
  - [x] Login on mobile
  - [x] Verify sessions persist (web)
  - [x] Verify sessions persist (mobile)

## 5. Verification
- [x] 5.1 Authentication works in production on web
- [x] 5.2 Authentication works in production on mobile
- [x] 5.3 Sessions persist across requests (web)
- [x] 5.4 Protected routes require authentication (web)
- [x] 5.5 Protected routes require authentication (mobile)

