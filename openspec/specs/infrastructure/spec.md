# infrastructure Specification

## Purpose
TBD - created by archiving change deploy-authentication. Update Purpose after archive.
## Requirements
### Requirement: Production Deployment
The system SHALL provide production deployment infrastructure for API and web applications.

#### Scenario: API deployment
- **WHEN** the API is deployed to Railway
- **THEN** it is accessible via a production URL and connects to the production database

#### Scenario: Web deployment
- **WHEN** the web application is deployed to Railway
- **THEN** it is accessible via a production URL and connects to the production API

#### Scenario: Database migrations in production
- **WHEN** the API is deployed
- **THEN** database migrations are applied automatically or manually as part of the deployment process

### Requirement: Production Environment Configuration
The system SHALL use production environment variables for configuration.

#### Scenario: API environment variables
- **WHEN** the API is deployed
- **THEN** it uses production environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV, PORT)

#### Scenario: Web environment variables
- **WHEN** the web application is deployed
- **THEN** it uses production environment variables (NEXT_PUBLIC_API_URL)

#### Scenario: Mobile environment variables
- **WHEN** the mobile application is configured
- **THEN** it uses production API URL (EXPO_PUBLIC_API_URL)

### Requirement: Production Authentication
The system SHALL provide authentication functionality in the production environment.

#### Scenario: Web registration in production
- **WHEN** a user registers on the production web application
- **THEN** a new account is created in the production database

#### Scenario: Web login in production
- **WHEN** a user logs in on the production web application
- **THEN** they are authenticated and can access protected routes

#### Scenario: Mobile registration in production
- **WHEN** a user registers on the mobile application
- **THEN** a new account is created in the production database

#### Scenario: Mobile login in production
- **WHEN** a user logs in on the mobile application
- **THEN** they are authenticated and can access protected screens

### Requirement: Session Persistence in Production
The system SHALL maintain user sessions across requests in the production environment.

#### Scenario: Session persistence
- **WHEN** a user is authenticated in production
- **THEN** their session persists across requests and page navigations

#### Scenario: Session validation
- **WHEN** a user makes a request with a valid session
- **THEN** the session is validated and the request is processed

### Requirement: Gallery API Deployment
The gallery API endpoints SHALL be deployed and accessible in the production environment.

#### Scenario: Gallery API endpoints accessible
- **WHEN** the API is deployed to Railway
- **THEN** the gallery endpoints (`GET /api/photos`, `GET /api/photos/:id`, `DELETE /api/photos/:id`, `GET /api/upload-jobs/:id`) are accessible in production

#### Scenario: Gallery API authentication works
- **WHEN** gallery endpoints are accessed in production
- **THEN** authentication middleware correctly protects the endpoints

### Requirement: Gallery Web Deployment
The web gallery functionality SHALL be deployed and accessible in the production environment.

#### Scenario: Gallery page accessible
- **WHEN** the web application is deployed to Railway
- **THEN** the gallery page is accessible at the production URL

#### Scenario: Gallery images load from R2
- **WHEN** users view photos in the gallery
- **THEN** images load correctly from R2 storage using the R2 public URLs

### Requirement: Gallery Mobile Deployment
The mobile gallery functionality SHALL work correctly with the production API.

#### Scenario: Mobile gallery connects to production API
- **WHEN** the mobile app is configured with the production API URL
- **THEN** the gallery screen successfully loads photos from the production API

#### Scenario: Mobile gallery images load from R2
- **WHEN** users view photos in the mobile gallery
- **THEN** images load correctly from R2 storage using the R2 public URLs

### Requirement: Production Gallery Testing
The gallery functionality SHALL be tested and verified in the production environment.

#### Scenario: Web gallery works in production
- **WHEN** users access the gallery page in production
- **THEN** they can view photos, navigate pagination, and open photo modals

#### Scenario: Mobile gallery works in production
- **WHEN** users access the gallery screen in production
- **THEN** they can view photos, use pull-to-refresh, and open photo viewer

#### Scenario: Images load from R2 in production
- **WHEN** users view photos in production
- **THEN** images load correctly from R2 storage with proper URLs

### Requirement: Suggested Tags Database Field
The photo table SHALL support storing AI-generated tag suggestions.

#### Scenario: Store suggested tags
- **GIVEN** the photo schema
- **WHEN** a photo is created or updated
- **THEN** the system SHALL support a `suggested_tags` field as a PostgreSQL text array
- **AND** SHALL allow null values (photos without AI suggestions)

### Requirement: Tag Search Indexes
The system SHALL provide efficient tag search using GIN indexes.

#### Scenario: Index user and AI tags
- **GIVEN** the photo table has `tags` and `suggested_tags` arrays
- **WHEN** creating database indexes
- **THEN** the system SHALL create a GIN index on `tags` for user-confirmed tag search
- **AND** SHALL create a GIN index on `suggested_tags` for AI suggestion search
- **AND** SHALL support array containment queries (@>, &&) efficiently

### Requirement: AWS Rekognition Integration
The system SHALL integrate with AWS Rekognition for image analysis.

#### Scenario: Configure Rekognition client
- **GIVEN** AWS credentials are provided via environment variables
- **WHEN** initializing the Rekognition service
- **THEN** the system SHALL create an AWS Rekognition client with the provided credentials
- **AND** SHALL configure the client with the specified AWS region
- **AND** SHALL handle authentication errors gracefully

#### Scenario: Detect labels in image
- **GIVEN** a photo with a valid R2 URL
- **WHEN** analyzing the image
- **THEN** the system SHALL download the image from R2
- **AND** SHALL call AWS Rekognition DetectLabels API
- **AND** SHALL return labels with confidence scores
- **AND** SHALL handle API rate limits and errors

### Requirement: AI Tagging Worker
The system SHALL process AI tagging jobs asynchronously using the job queue.

#### Scenario: Process AI tagging job
- **GIVEN** a completed photo upload
- **WHEN** the AI tagging job is processed
- **THEN** the system SHALL retrieve the photo from the database
- **AND** SHALL download the image from R2 using the photo's R2 key
- **AND** SHALL analyze the image with AWS Rekognition
- **AND** SHALL filter labels by confidence (≥70%)
- **AND** SHALL store filtered labels in `suggested_tags`
- **AND** SHALL mark the job as complete

#### Scenario: Handle AI tagging failures
- **GIVEN** an AI tagging job encounters an error
- **WHEN** processing the job
- **THEN** the system SHALL retry up to 3 times with exponential backoff
- **AND** SHALL log detailed error information
- **AND** SHALL not block photo upload completion
- **AND** SHALL allow photos to be used even if AI tagging fails

### Requirement: Job Queue Integration
AI tagging jobs SHALL be queued automatically after photo upload completion.

#### Scenario: Queue AI tagging job
- **GIVEN** a photo upload has completed successfully
- **WHEN** marking the photo as completed
- **THEN** the system SHALL queue an AI tagging job with the photo ID and R2 key
- **AND** SHALL queue the job asynchronously (fire-and-forget)
- **AND** SHALL not wait for job completion
- **AND** SHALL queue thumbnail generation and AI tagging in parallel

