## ADDED Requirements

### Requirement: Thumbnail Generation Job Queue
The API SHALL provide a job queue system using BullMQ and Redis for processing asynchronous tasks.

#### Scenario: Queue infrastructure setup
- **WHEN** the API starts
- **THEN** it connects to Redis and initializes BullMQ queues for photo processing

#### Scenario: Worker registration
- **WHEN** workers are registered with the queue
- **THEN** they process jobs from their respective queues with error handling and retry logic

### Requirement: Thumbnail Generation Worker
The API SHALL provide a worker to generate thumbnails for uploaded photos.

#### Scenario: Thumbnail generation
- **WHEN** a thumbnail generation job is processed
- **THEN** the worker downloads the photo from R2, resizes it to 300x300 pixels using Sharp, compresses and optimizes the image, uploads the thumbnail to R2, and updates the photo record with the thumbnail_key

#### Scenario: Thumbnail job failure handling
- **WHEN** a thumbnail generation job fails
- **THEN** the worker logs the error, retries according to the retry policy, and marks the job as failed after max retries

### Requirement: Automatic Thumbnail Queue on Upload
The API SHALL automatically queue thumbnail generation jobs after photo upload completion.

#### Scenario: Queue thumbnail on completion
- **WHEN** a photo upload is completed via `/api/photos/:id/complete`
- **THEN** the API queues a thumbnail generation job for that photo

#### Scenario: Thumbnail generation is asynchronous
- **WHEN** a thumbnail generation job is queued
- **THEN** the API responds immediately without waiting for thumbnail generation to complete

## MODIFIED Requirements

### Requirement: Photo Entity
The Photo domain entity SHALL contain all necessary metadata for stored photos including thumbnail information.

#### Scenario: Photo entity structure
- **WHEN** a photo entity is created or retrieved
- **THEN** it contains fields for id, uploadJobId, userId, fileName, fileSize, mimeType, r2Key, r2Url, thumbnailKey, status, tags, uploadedAt, createdAt

### Requirement: Photo Database Schema
The database SHALL contain a photos table with fields for storing photo metadata including thumbnail references.

#### Scenario: Photos table structure
- **WHEN** migrations are applied
- **THEN** the photos table includes a thumbnail_key column for storing the R2 key of the generated thumbnail

### Requirement: Photo Upload Completion
The API SHALL provide an endpoint to notify when a photo upload to R2 is complete.

#### Scenario: Complete photo upload
- **WHEN** a POST request is made to `/api/photos/:id/complete` after the file is uploaded to R2
- **THEN** the API updates the photo status to "completed", sets the R2 URL, updates the upload job progress if applicable, publishes a progress event, queues a thumbnail generation job, checks if the upload job is complete, and returns success

#### Scenario: Complete upload requires authentication
- **WHEN** a POST request is made to `/api/photos/:id/complete` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Complete upload for non-existent photo
- **WHEN** a POST request is made to `/api/photos/:id/complete` with an invalid photo ID
- **THEN** the API returns a 404 Not Found error

