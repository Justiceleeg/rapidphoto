## ADDED Requirements

### Requirement: Upload Job Entity
The system SHALL provide an Upload Job domain entity for tracking batch photo uploads.

#### Scenario: Upload Job structure
- **WHEN** an upload job is created
- **THEN** it contains fields for id, userId, totalPhotos, completedPhotos, failedPhotos, status (pending|in-progress|completed|failed), createdAt, updatedAt

#### Scenario: Upload Job status tracking
- **WHEN** photos are uploaded in a batch
- **THEN** the upload job tracks the number of completed and failed photos

### Requirement: Upload Job Repository
The API SHALL provide a repository interface and implementation for managing Upload Job entities in the database.

#### Scenario: Create upload job
- **WHEN** a new upload job is created via repository
- **THEN** it is persisted to the upload_jobs table in the database

#### Scenario: Get upload job by ID
- **WHEN** an upload job is retrieved by ID
- **THEN** the repository returns the upload job entity if it exists

#### Scenario: Update upload job progress
- **WHEN** an upload job progress is updated via repository
- **THEN** the changes are persisted to the database

### Requirement: Upload Job Database Schema
The database SHALL contain an upload_jobs table with fields for storing batch upload metadata.

#### Scenario: Upload jobs table structure
- **WHEN** migrations are applied
- **THEN** the upload_jobs table is created with columns: id, user_id, total_photos, completed_photos, failed_photos, status, created_at, updated_at

### Requirement: Batch Upload Initialization
The API SHALL support initializing uploads for multiple photos in a single request.

#### Scenario: Initialize batch upload
- **WHEN** a POST request is made to `/api/upload/init` with an array of photo metadata (filename, fileSize, mimeType)
- **THEN** the API creates photo records with status "pending", creates an upload job, generates presigned URLs for each photo, and returns the job ID, photo IDs, and presigned URLs

#### Scenario: Batch upload creates upload job
- **WHEN** a batch upload is initialized with multiple photos
- **THEN** an upload job is created with totalPhotos set to the number of photos

### Requirement: Upload Progress Tracking
The API SHALL track the progress of batch uploads and update the upload job status accordingly.

#### Scenario: Track photo completion
- **WHEN** a photo upload is completed via `/api/photos/:id/complete`
- **THEN** the API updates the photo status to "completed", increments the upload job's completedPhotos count, and checks if the job is complete

#### Scenario: Upload job completion
- **WHEN** all photos in an upload job are completed
- **THEN** the upload job status is updated to "completed"

### Requirement: Upload Failure Handling
The API SHALL provide an endpoint to report failed photo uploads.

#### Scenario: Report failed upload
- **WHEN** a POST request is made to `/api/photos/:id/failed` after an upload fails
- **THEN** the API updates the photo status to "failed", increments the upload job's failedPhotos count, and checks if the job should be marked as failed

#### Scenario: Fail upload requires authentication
- **WHEN** a POST request is made to `/api/photos/:id/failed` without authentication
- **THEN** the API returns a 401 Unauthorized error

### Requirement: Progress Service
The API SHALL provide a progress service for publishing real-time upload progress updates.

#### Scenario: Publish progress event
- **WHEN** a photo upload completes or fails
- **THEN** the progress service publishes a progress event with job ID, completed count, failed count, and status

#### Scenario: Subscribe to progress events
- **WHEN** a client subscribes to progress events for a job
- **THEN** the progress service delivers real-time updates as photos are uploaded

### Requirement: Server-Sent Events for Progress
The API SHALL provide an SSE endpoint for streaming real-time upload progress updates.

#### Scenario: Connect to SSE endpoint
- **WHEN** a GET request is made to `/api/upload-progress/:jobId` with authentication
- **THEN** the API establishes an SSE connection and streams progress events as photos are uploaded

#### Scenario: SSE progress events
- **WHEN** progress events are published for an upload job
- **THEN** connected SSE clients receive events with job ID, completedPhotos, failedPhotos, totalPhotos, and status

#### Scenario: SSE requires authentication
- **WHEN** a GET request is made to `/api/upload-progress/:jobId` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: SSE for non-existent job
- **WHEN** a GET request is made to `/api/upload-progress/:jobId` with an invalid job ID
- **THEN** the API returns a 404 Not Found error

## MODIFIED Requirements

### Requirement: Upload Initialization
The API SHALL provide an endpoint to initialize a photo upload by generating a presigned URL.

#### Scenario: Initialize single photo upload
- **WHEN** a POST request is made to `/api/upload/init` with a single photo metadata (filename, fileSize, mimeType)
- **THEN** the API creates a photo record with status "pending", generates a presigned URL, and returns the photo ID and presigned URL

#### Scenario: Initialize batch photo upload
- **WHEN** a POST request is made to `/api/upload/init` with an array of photo metadata
- **THEN** the API creates photo records for each photo, creates an upload job, generates presigned URLs, and returns the job ID, photo IDs, and presigned URLs

#### Scenario: Upload initialization requires authentication
- **WHEN** a POST request is made to `/api/upload/init` without authentication
- **THEN** the API returns a 401 Unauthorized error

### Requirement: Photo Upload Completion
The API SHALL provide an endpoint to notify when a photo upload to R2 is complete.

#### Scenario: Complete photo upload
- **WHEN** a POST request is made to `/api/photos/:id/complete` after the file is uploaded to R2
- **THEN** the API updates the photo status to "completed", sets the R2 URL, updates the upload job progress if applicable, publishes a progress event, and checks if the upload job is complete

#### Scenario: Complete upload requires authentication
- **WHEN** a POST request is made to `/api/photos/:id/complete` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Complete upload for non-existent photo
- **WHEN** a POST request is made to `/api/photos/:id/complete` with an invalid photo ID
- **THEN** the API returns a 404 Not Found error

