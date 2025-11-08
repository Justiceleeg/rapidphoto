## ADDED Requirements

### Requirement: R2 Storage Configuration
The production environment SHALL be configured with Cloudflare R2 storage credentials.

#### Scenario: R2 environment variables
- **WHEN** the API is deployed to production
- **THEN** it has access to R2 credentials via environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### Requirement: Production Upload API
The production API SHALL provide upload endpoints for single photo uploads.

#### Scenario: Upload endpoints available
- **WHEN** the API is deployed to production
- **THEN** the endpoints `POST /api/upload/init` and `POST /api/photos/:id/complete` are available and functional

#### Scenario: Production upload flow
- **WHEN** a photo upload is initiated in production
- **THEN** the API generates presigned URLs, accepts upload completion notifications, and stores photo metadata in the database

### Requirement: Production Web Upload
The production web application SHALL provide upload functionality.

#### Scenario: Web upload page available
- **WHEN** the web application is deployed to production
- **THEN** users can access the upload page and upload photos

#### Scenario: Web upload to production API
- **WHEN** a user uploads a photo from the web application
- **THEN** it connects to the production API and successfully uploads to R2

### Requirement: Production Mobile Upload
The production mobile application SHALL provide upload functionality.

#### Scenario: Mobile upload screen available
- **WHEN** the mobile application is configured for production
- **THEN** users can access the upload screen and upload photos

#### Scenario: Mobile upload to production API
- **WHEN** a user uploads a photo from the mobile application
- **THEN** it connects to the production API and successfully uploads to R2

### Requirement: Production Upload Verification
The production system SHALL store uploaded photos correctly.

#### Scenario: Photo stored in R2
- **WHEN** a photo is uploaded in production
- **THEN** the photo file is stored in the R2 bucket

#### Scenario: Photo metadata in database
- **WHEN** a photo is uploaded in production
- **THEN** the photo metadata is stored in the database with correct status and URLs

