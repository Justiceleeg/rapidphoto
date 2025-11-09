## ADDED Requirements

### Requirement: Photo List Query
The API SHALL provide an endpoint to retrieve a paginated list of photos for the authenticated user.

#### Scenario: List photos with pagination
- **WHEN** a GET request is made to `/api/photos` with query parameters `page` and `limit`
- **THEN** the API returns a paginated list of photos belonging to the authenticated user

#### Scenario: List photos default pagination
- **WHEN** a GET request is made to `/api/photos` without pagination parameters
- **THEN** the API returns the first page of photos with a default page size

#### Scenario: List photos requires authentication
- **WHEN** a GET request is made to `/api/photos` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: List photos filters by user
- **WHEN** a GET request is made to `/api/photos` by an authenticated user
- **THEN** the API returns only photos belonging to that user

### Requirement: Single Photo Query
The API SHALL provide an endpoint to retrieve details of a single photo by ID.

#### Scenario: Get photo by ID
- **WHEN** a GET request is made to `/api/photos/:id` with a valid photo ID
- **THEN** the API returns the photo details including id, filename, r2Url, status, createdAt, updatedAt

#### Scenario: Get photo requires authentication
- **WHEN** a GET request is made to `/api/photos/:id` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Get photo for non-existent photo
- **WHEN** a GET request is made to `/api/photos/:id` with an invalid photo ID
- **THEN** the API returns a 404 Not Found error

#### Scenario: Get photo for another user's photo
- **WHEN** a GET request is made to `/api/photos/:id` for a photo belonging to another user
- **THEN** the API returns a 404 Not Found error (or 403 Forbidden)

### Requirement: Upload Job Query
The API SHALL provide an endpoint to retrieve details of an upload job by ID.

#### Scenario: Get upload job by ID
- **WHEN** a GET request is made to `/api/upload-jobs/:id` with a valid job ID
- **THEN** the API returns the upload job details including id, userId, totalPhotos, completedPhotos, failedPhotos, status, createdAt, updatedAt

#### Scenario: Get upload job requires authentication
- **WHEN** a GET request is made to `/api/upload-jobs/:id` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Get upload job for non-existent job
- **WHEN** a GET request is made to `/api/upload-jobs/:id` with an invalid job ID
- **THEN** the API returns a 404 Not Found error

#### Scenario: Get upload job for another user's job
- **WHEN** a GET request is made to `/api/upload-jobs/:id` for a job belonging to another user
- **THEN** the API returns a 404 Not Found error (or 403 Forbidden)

### Requirement: Photo Deletion
The API SHALL provide an endpoint to delete a photo by ID.

#### Scenario: Delete photo
- **WHEN** a DELETE request is made to `/api/photos/:id` with a valid photo ID
- **THEN** the API deletes the photo record from the database

#### Scenario: Delete photo requires authentication
- **WHEN** a DELETE request is made to `/api/photos/:id` without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Delete photo for non-existent photo
- **WHEN** a DELETE request is made to `/api/photos/:id` with an invalid photo ID
- **THEN** the API returns a 404 Not Found error

#### Scenario: Delete photo for another user's photo
- **WHEN** a DELETE request is made to `/api/photos/:id` for a photo belonging to another user
- **THEN** the API returns a 404 Not Found error (or 403 Forbidden)

