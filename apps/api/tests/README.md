# Integration Tests

End-to-end integration tests for the RapidPhoto API that validate the complete upload process from simulated client requests through backend services to successful persistent storage in R2.

## Technology Stack

- **Vitest** - Test framework (not Playwright - these are backend API tests)
- **undici** - HTTP client for making requests
- **Real Hono server** - Tests run against actual application server
- **Real PostgreSQL database** - Tests use actual database with migrations
- **Real Cloudflare R2 bucket** - Tests actually upload files to R2

## Quick Start

### 1. Environment Configuration

**Option A: Use `.env` (Recommended for R2)**
- Tests will automatically use your existing `.env` file
- **R2 bucket**: Tests use the **same R2 bucket as production** with `test/` prefix for isolation
- **Database**: You can use the same database or create a test database

**Option B: Create `.env.test` (Optional)**
- Create `.env.test` in `apps/api/` to override specific values
- If `.env.test` exists, it takes precedence over `.env`
- Useful if you want a separate test database

**Minimum required variables:**
```bash
# Database (can use same as production or separate test database)
DATABASE_URL=postgresql://user:password@localhost:5432/rapidphoto

# R2 Configuration (uses same bucket as production)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com

# Auth Configuration
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:4000
```

**Note**: Test files in R2 are automatically prefixed with `test/` and cleaned up after tests.

### 2. Run Tests

```bash
# From apps/api directory
cd apps/api

# Run all tests
pnpm test

# Run only integration tests
pnpm test:integration

# Run tests in watch mode
pnpm test:watch
```

## Test Structure

```
tests/
├── setup/
│   ├── vitest-setup.ts      # Test environment configuration
│   ├── test-server.ts        # Test server utilities
│   ├── test-database.ts      # Database setup/teardown
│   ├── test-r2.ts            # R2 bucket utilities
│   └── test-client.ts        # Client simulation helpers
└── integration/
    ├── auth-flow.test.ts     # Authentication flow tests
    ├── upload-flow.test.ts   # Upload flow tests
    └── sse-flow.test.ts       # SSE progress tests
```

## What Gets Tested

### Authentication Flow (`auth-flow.test.ts`)
- ✅ User signup with validation
- ✅ User signin with credentials
- ✅ Session management and persistence
- ✅ Signout functionality
- ✅ Protected route access control

### Upload Flow (`upload-flow.test.ts`)
- ✅ Single photo upload end-to-end
  - Initialize upload → Get presigned URL
  - **Actually upload file to R2**
  - **Verify file exists in R2**
  - Complete upload → Verify database state
- ✅ Batch photo upload (2 photos)
  - Initialize batch → Get multiple presigned URLs
  - **Upload all files to R2**
  - **Verify all files exist in R2**
  - Complete all uploads → Verify job progress
- ✅ Upload failure handling
- ✅ Concurrent uploads
- ✅ Upload validation (file count, authentication)

### SSE Progress (`sse-flow.test.ts`)
- ✅ SSE connection establishment
- ✅ Progress events during upload
- ✅ Initial state format
- ✅ Error handling (invalid job ID, unauthorized access)

## How Tests Work

1. **Test Server**: Each test suite starts a real Hono server on a random port
2. **Test Database**: Connects to test database and runs migrations
3. **Test R2**: Uses real R2 bucket (files are cleaned up after tests)
4. **Client Simulation**: Makes HTTP requests using `fetch` with cookie management
5. **Verification**: Checks both database state AND R2 bucket state

## Test Isolation

- Each test suite gets a fresh database (cleaned before each test)
- Each test suite gets a clean R2 bucket (test files are cleaned up)
- Each test suite runs on its own server instance
- Tests are independent and can run in parallel

## Important Notes

⚠️ **Database**: Tests clean all data before each test. Use a separate test database or be aware that test data will be wiped.

✅ **R2 Bucket**: Tests use the **same R2 bucket as production** but with `test/` prefix for isolation. Test files are automatically cleaned up after tests.

⚠️ **Test timeout** - Tests have a 30-second timeout to allow for R2 uploads

## Troubleshooting

### Tests fail with "DATABASE_URL not set"
- Create `.env.test` file with `DATABASE_URL` pointing to your test database

### Tests fail with "R2 configuration not set"
- Add R2 configuration variables to `.env.test`

### Tests fail with database connection errors
- Ensure your test database is running
- Verify `DATABASE_URL` is correct in `.env.test`

### Tests fail with R2 upload errors
- Verify R2 credentials are correct
- Check that the bucket exists and is accessible
- Ensure R2 bucket name is correct

### Tests are slow
- This is expected - tests actually upload files to R2
- Consider using a local S3-compatible service for faster tests (minio, localstack)

## Running Specific Tests

```bash
# Run a specific test file
pnpm test tests/integration/auth-flow.test.ts

# Run tests matching a pattern
pnpm test -t "should complete single photo upload"

# Run tests with coverage
pnpm test --coverage
```

