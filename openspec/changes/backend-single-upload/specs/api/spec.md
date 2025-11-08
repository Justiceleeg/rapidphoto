## ADDED Requirements

### Requirement: Cloudflare R2 Storage Service
The API SHALL provide a service for interacting with Cloudflare R2 storage, including generating presigned URLs for direct client uploads.

#### Scenario: Generate presigned URL
- **WHEN** a presigned URL is requested for a photo upload
- **THEN** the service generates a presigned URL that allows direct upload to R2 bucket

#### Scenario: R2 configuration
- **WHEN** the API starts
- **THEN** it reads R2 credentials from environment variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`)

### Requirement: Photo Entity
The system SHALL provide a Photo domain entity representing uploaded photos.

#### Scenario: Photo entity structure
- **WHEN** a photo is created
- **THEN** it contains fields for id, userId, filename, fileSize, mimeType, r2Key, r2Url, status, createdAt, updatedAt

### Requirement: Photo Repository
The API SHALL provide a repository interface and implementation for managing Photo entities in the database.

#### Scenario: Create photo
- **WHEN** a new photo is created via repository
- **THEN** it is persisted to the photos table in the database

#### Scenario: Get photo by ID
- **WHEN** a photo is retrieved by ID
- **THEN** the repository returns the photo entity if it exists

#### Scenario: Update photo
- **WHEN** a photo is updated via repository
- **THEN** the changes are persisted to the database

### Requirement: Photo Database Schema
The database SHALL contain a photos table with fields for storing photo metadata.

#### Scenario: Photos table structure
- **WHEN** migrations are applied
- **THEN** the photos table is created with columns: id, user_id, filename, file_size, mime_type, r2_key, r2_url, status, created_at, updated_at

### Requirement: Upload Initialization
The API SHALL provide an endpoint to initialize a photo upload by generating a presigned URL.

#### Scenario: Initialize single photo upload
- **WHEN** a POST request is made to `/api/upload/init` with photo metadata (filename, fileSize, mimeType)
- **THEN** the API creates a photo record with status "pending", generates a presigned URL, and returns the photo ID and presigned URL

#### Scenario: Upload initialization requires authentication
- **WHEN** a POST request is made to `/api/upload/init` without authentication
- **THEN** the API returns a 401 Unauthorized error

### Requirement: Photo Upload Completion
The API SHALL provide an endpoint to notify when a photo upload to R2 is complete.

#### Scenario: Complete photo upload
- **WHEN** a POST request is made to `/api/photos/:id/complete` after the file is uploaded to R2
- **THEN** the API updates the photo status to "completed" and sets the R2 URL

#### Scenario: Complete upload requires authentication
- **WHEN** a POST request is made to `/api/photos/:id/complete` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Complete upload for non-existent photo
- **WHEN** a POST request is made to `/api/photos/:id/complete` with an invalid photo ID
- **THEN** the API returns a 404 Not Found error

