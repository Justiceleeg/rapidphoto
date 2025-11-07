## 1. API Deployment
- [ ] 1.1 Deploy API to Railway (S1-46)
  - [ ] Add API service to Railway project
  - [ ] Set root directory: `apps/api`
  - [ ] Set build command: `pnpm install && pnpm --filter @rapidphoto/api build`
  - [ ] Set start command: `pnpm --filter @rapidphoto/api start`
  - [ ] Configure environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV)
  - [ ] Run migrations: `pnpm --filter @rapidphoto/api db:migrate`
  - [ ] Test: `https://your-api.railway.app/health`

## 2. Web Deployment
- [ ] 2.1 Deploy Web to Railway (S1-47)
  - [ ] Add web service to Railway project
  - [ ] Set root directory: `apps/web`
  - [ ] Set build command: `pnpm install && pnpm --filter @rapidphoto/web build`
  - [ ] Set start command: `pnpm --filter @rapidphoto/web start`
  - [ ] Configure environment: `NEXT_PUBLIC_API_URL=https://your-api.railway.app`
  - [ ] Test: Visit web URL, test login

## 3. Mobile Configuration
- [ ] 3.1 Update mobile to use production API (S1-48)
  - [ ] Update `apps/mobile/.env`
  - [ ] Set `EXPO_PUBLIC_API_URL` to production API URL

## 4. Production Testing
- [ ] 4.1 Test authentication in production (S1-49)
  - [ ] Register new user on web
  - [ ] Login on web
  - [ ] Register new user on mobile
  - [ ] Login on mobile
  - [ ] Verify sessions persist

## 5. Verification
- [ ] 5.1 Authentication works in production on web
- [ ] 5.2 Authentication works in production on mobile
- [ ] 5.3 Sessions persist across requests
- [ ] 5.4 Protected routes require authentication

