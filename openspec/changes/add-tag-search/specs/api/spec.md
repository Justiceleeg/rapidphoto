## MODIFIED Requirements
### Requirement: Photo Gallery Query Endpoints
The API SHALL provide endpoints for users to retrieve their uploaded photos with pagination, individual photo details, and tag-based filtering.

#### Scenario: List user photos
- **WHEN** a GET request is made to `/api/photos` with valid authentication
- **THEN** the API returns a paginated list of the user's photos with temporary presigned URLs

#### Scenario: List photos with tag filter
- **WHEN** a GET request is made to `/api/photos?tags=beach,sunset` with valid authentication
- **THEN** the API returns only photos that have all specified tags in their `tags` array
- **AND** uses PostgreSQL array operators (@> or &&) with AND logic for multi-tag search

#### Scenario: List photos including AI-suggested tags
- **WHEN** a GET request is made to `/api/photos?tags=beach&includeSuggested=true` with valid authentication
- **THEN** the API returns photos that have the specified tags in either `tags` or `suggested_tags` arrays
- **AND** searches both user-confirmed tags and AI-suggested tags

#### Scenario: List photos with tag filter and pagination
- **WHEN** a GET request is made to `/api/photos?tags=beach&page=2&limit=20` with valid authentication
- **THEN** the API returns paginated results filtered by tags
- **AND** pagination metadata correctly reflects the filtered total count

#### Scenario: Get single photo
- **WHEN** a GET request is made to `/api/photos/:id` with valid authentication
- **THEN** the API returns the photo details with a temporary presigned URL if the photo belongs to the authenticated user

#### Scenario: Unauthorized photo access
- **WHEN** a GET request is made to `/api/photos/:id` for a photo that doesn't belong to the user
- **THEN** the API returns a 403 Forbidden error

## ADDED Requirements
### Requirement: Tag Autocomplete API
The API SHALL provide an endpoint for retrieving tag suggestions based on a prefix for autocomplete functionality.

#### Scenario: Get all user tags
- **WHEN** a GET request is made to `/api/tags` with valid authentication
- **THEN** the API returns a list of distinct tags from the user's photos' `tags` arrays
- **AND** only includes user-confirmed tags (not AI-suggested tags)
- **AND** limits results to a reasonable number (e.g., top 20)
- **AND** filters tags to only those from the authenticated user's photos

#### Scenario: Get tags with prefix
- **WHEN** a GET request is made to `/api/tags?prefix=bea` with valid authentication
- **THEN** the API returns tags that start with the specified prefix (case-insensitive)
- **AND** only includes user-confirmed tags from the user's photos
- **AND** limits results to a reasonable number (e.g., top 20)

#### Scenario: Empty prefix returns all tags
- **WHEN** a GET request is made to `/api/tags?prefix=` with valid authentication
- **THEN** the API returns all distinct user-confirmed tags from the user's photos
- **AND** limits results to a reasonable number (e.g., top 20)

