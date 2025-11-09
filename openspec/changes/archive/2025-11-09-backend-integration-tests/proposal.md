# Change: Backend Integration Tests

## Why
Add comprehensive end-to-end integration tests that validate the complete upload process from simulated client requests through backend services to successful persistent storage in cloud object store (R2). These tests MUST validate the full flow: client → API → database → R2 storage, ensuring the system handles concurrent uploads correctly and maintains data integrity throughout the process.

## What Changes
- Setup integration testing framework with test server, test database, and test R2 bucket configuration
- Create end-to-end integration tests for complete upload flow:
  - Simulate client authentication (signup, signin, session)
  - Simulate client upload initialization request
  - Actually upload files to test R2 bucket using presigned URLs
  - Verify files are stored correctly in R2
  - Simulate client completion notification
  - Verify database state and job progress updates
  - Test SSE progress events during upload
- Create test utilities for:
  - Starting test server with actual Hono app
  - Test database setup/teardown with migrations
  - Test R2 bucket operations (upload, verify, cleanup)
  - Client request simulation helpers
- Configure test scripts in package.json

## Impact
- Affected specs: `api`
- Affected code:
  - `apps/api/tests/integration/` (new directory)
  - `apps/api/tests/integration/upload-flow.test.ts` (new - end-to-end upload tests)
  - `apps/api/tests/integration/auth-flow.test.ts` (new - authentication flow tests)
  - `apps/api/tests/setup/` (new directory)
  - `apps/api/tests/setup/test-server.ts` (new - test server setup)
  - `apps/api/tests/setup/test-database.ts` (new - test database utilities)
  - `apps/api/tests/setup/test-r2.ts` (new - test R2 bucket utilities)
  - `apps/api/tests/setup/test-client.ts` (new - client simulation helpers)
  - `apps/api/package.json` (modified - add test scripts and dependencies)

