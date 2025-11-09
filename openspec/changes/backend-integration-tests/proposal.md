# Change: Backend Integration Tests

## Why
Add comprehensive integration tests for authentication, upload, and SSE functionality to ensure API reliability and catch regressions before adding new features in Slice 6. Integration tests validate end-to-end behavior including database interactions and external service integrations.

## What Changes
- Setup Vitest testing framework with test database configuration
- Create integration tests for authentication flow (signup, signin, signout, session)
- Create integration tests for upload flow (init upload, complete photo, fail photo)
- Create integration tests for SSE progress updates
- Add test database setup and teardown utilities
- Configure test scripts in package.json

## Impact
- Affected specs: `api`
- Affected code:
  - `apps/api/vitest.config.ts` (new)
  - `apps/api/tests/integration/` (new directory)
  - `apps/api/tests/integration/auth.test.ts` (new)
  - `apps/api/tests/integration/upload.test.ts` (new)
  - `apps/api/tests/integration/sse.test.ts` (new)
  - `apps/api/tests/setup/` (new directory)
  - `apps/api/tests/setup/database.ts` (new)
  - `apps/api/package.json` (modified - add test scripts)

