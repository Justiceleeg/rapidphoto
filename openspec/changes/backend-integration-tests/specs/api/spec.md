## ADDED Requirements

### Requirement: End-to-End Integration Testing Infrastructure
The API SHALL provide integration testing infrastructure that validates the complete upload process from simulated client requests through backend services to successful persistent storage in cloud object store (R2).

#### Scenario: Test server setup
- **WHEN** integration tests run
- **THEN** a test server is started with the actual Hono application and test database/R2 configuration

#### Scenario: Test database setup
- **WHEN** integration tests run
- **THEN** a test database is created/configured with the schema applied via migrations

#### Scenario: Test database teardown
- **WHEN** integration tests complete
- **THEN** test data is cleaned up and the database is reset

#### Scenario: Test R2 bucket setup
- **WHEN** integration tests run
- **THEN** a test R2 bucket is configured (or test bucket is used) for file storage verification

#### Scenario: Test R2 bucket cleanup
- **WHEN** integration tests complete
- **THEN** test files are removed from the R2 bucket

#### Scenario: Client simulation helpers
- **WHEN** integration tests need to simulate client requests
- **THEN** utilities are available to make authenticated HTTP requests, upload files to presigned URLs, and manage session cookies

### Requirement: End-to-End Upload Flow Integration Tests
The API SHALL have integration tests that validate the complete upload process from simulated client (mobile/web) through backend services to successful persistent storage in cloud object store.

#### Scenario: Single photo upload end-to-end test
- **WHEN** integration tests run
- **THEN** tests simulate client authentication, initialize upload, actually upload a file to R2 using presigned URL, verify file exists in R2, complete upload, and verify database state matches R2 state

#### Scenario: Batch photo upload end-to-end test
- **WHEN** integration tests run
- **THEN** tests simulate client authentication, initialize batch upload, actually upload multiple files to R2 using presigned URLs, verify all files exist in R2, complete all uploads, and verify upload job progress and database state match R2 state

#### Scenario: Upload flow with R2 storage verification
- **WHEN** integration tests run
- **THEN** tests verify that files uploaded to presigned URLs are actually stored in the R2 bucket and are accessible

#### Scenario: Upload flow with database verification
- **WHEN** integration tests run
- **THEN** tests verify that photo records, upload jobs, and status updates in the database match the actual upload state and R2 storage state

#### Scenario: Upload failure flow test
- **WHEN** integration tests run
- **THEN** tests simulate upload failure, verify photo status is updated to "failed" in database, and verify upload job progress tracks failed photos correctly

#### Scenario: Concurrent uploads test
- **WHEN** integration tests run
- **THEN** tests simulate multiple concurrent upload requests and verify all uploads are handled correctly, database state is consistent, and all files are stored correctly in R2

#### Scenario: Upload validation test
- **WHEN** integration tests run
- **THEN** tests verify that invalid file count, invalid file size, and unauthenticated requests return appropriate errors

### Requirement: Authentication Flow Integration Tests
The API SHALL have integration tests that validate the complete authentication flow including signup, signin, signout, and session management through simulated client requests.

#### Scenario: User signup flow test
- **WHEN** integration tests run
- **THEN** tests simulate client POST to `/api/auth/sign-up`, verify user is created in database, verify session is established, and verify cookies are returned

#### Scenario: Duplicate email signup test
- **WHEN** integration tests run
- **THEN** tests verify that signup with duplicate email returns an error

#### Scenario: Invalid signup validation test
- **WHEN** integration tests run
- **THEN** tests verify that signup with invalid email or password returns validation errors

#### Scenario: User signin flow test
- **WHEN** integration tests run
- **THEN** tests simulate client POST to `/api/auth/sign-in`, verify session is established, verify cookies are returned, and verify invalid credentials return error

#### Scenario: Session management test
- **WHEN** integration tests run
- **THEN** tests simulate client GET to `/api/me` with session cookies, verify user data is returned, and verify session persists across requests

#### Scenario: Signout test
- **WHEN** integration tests run
- **THEN** tests verify that signout invalidates the session

#### Scenario: Protected route test
- **WHEN** integration tests run
- **THEN** tests verify that unauthenticated requests to protected routes return 401 errors

### Requirement: SSE Progress Updates Integration Tests
The API SHALL have integration tests that validate Server-Sent Events for real-time upload progress updates during the upload flow.

#### Scenario: SSE connection test
- **WHEN** integration tests run
- **THEN** tests simulate client GET to `/api/upload-progress/:jobId` with authentication, verify SSE connection is established, and verify proper content-type headers are returned

#### Scenario: SSE progress updates during upload test
- **WHEN** integration tests run
- **THEN** tests start SSE connection for upload job, simulate photo completions, verify progress events are received via SSE, verify event data format is correct, and verify job status updates are reflected in events

#### Scenario: SSE error handling test
- **WHEN** integration tests run
- **THEN** tests verify that invalid job IDs, non-existent jobs, and unauthorized access return appropriate errors

### Requirement: Test Scripts
The API package.json SHALL provide scripts for running integration tests in different modes.

#### Scenario: Run all integration tests
- **WHEN** a developer runs `pnpm test`
- **THEN** all end-to-end integration tests execute and results are displayed

#### Scenario: Run tests in watch mode
- **WHEN** a developer runs `pnpm test:watch`
- **THEN** tests run in watch mode and re-execute on file changes

#### Scenario: Run integration tests only
- **WHEN** a developer runs `pnpm test:integration`
- **THEN** only integration tests execute
