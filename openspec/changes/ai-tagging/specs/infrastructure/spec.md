## ADDED Requirements

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

