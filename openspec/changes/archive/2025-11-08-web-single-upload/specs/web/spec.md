## ADDED Requirements

### Requirement: Upload API Client
The web application SHALL provide client methods for interacting with the upload API endpoints.

#### Scenario: Initialize upload
- **WHEN** initUpload is called with photo metadata (filename, fileSize, mimeType)
- **THEN** it makes a POST request to `/api/upload/init` and returns the photo ID and presigned URL

#### Scenario: Complete upload
- **WHEN** completePhoto is called with a photo ID
- **THEN** it makes a POST request to `/api/photos/:id/complete` to notify upload completion

### Requirement: Upload Store
The web application SHALL provide a store for managing photo upload state.

#### Scenario: Upload state management
- **WHEN** a file is selected for upload
- **THEN** the store tracks the selected file and upload state (pending, uploading, completed, error)

#### Scenario: Upload flow
- **WHEN** an upload is initiated
- **THEN** the store calls initUpload, uploads the file to R2 using the presigned URL, then calls completePhoto

### Requirement: File Drop Zone
The web application SHALL provide a drag-and-drop zone for selecting photo files.

#### Scenario: File selection via drag and drop
- **WHEN** a user drags a photo file over the drop zone
- **THEN** the file is accepted and ready for upload

#### Scenario: File selection via click
- **WHEN** a user clicks the drop zone
- **THEN** a file picker dialog opens to select a photo file

#### Scenario: File validation
- **WHEN** a file is selected
- **THEN** the drop zone validates it is an image file (jpg, png, etc.) and within size limits

### Requirement: Image Preview
The web application SHALL display a preview of the selected photo before upload.

#### Scenario: Display preview
- **WHEN** a photo file is selected
- **THEN** a preview of the image is displayed showing the file name and thumbnail

### Requirement: Upload Page
The web application SHALL provide an upload page where users can upload photos.

#### Scenario: Upload page access
- **WHEN** an authenticated user navigates to `/upload`
- **THEN** the upload page is displayed with drop zone and upload controls

#### Scenario: Single photo upload
- **WHEN** a user selects a photo and clicks upload
- **THEN** the photo is uploaded to R2, the upload state is tracked, and success/error feedback is shown

#### Scenario: Upload requires authentication
- **WHEN** an unauthenticated user navigates to `/upload`
- **THEN** they are redirected to the login page

