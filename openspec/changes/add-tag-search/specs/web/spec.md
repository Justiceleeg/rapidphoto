## MODIFIED Requirements
### Requirement: Photo Client Methods
The web application SHALL provide client methods for interacting with photo API endpoints including tag search functionality.

#### Scenario: Get photos list
- **WHEN** the photo client calls `getPhotos(page, limit)`
- **THEN** it makes a GET request to `/api/photos` with pagination parameters and returns the photo list

#### Scenario: Get photos with tag filter
- **WHEN** the photo client calls `getPhotos(page, limit, { tags: ['beach', 'sunset'], includeSuggested: false })`
- **THEN** it makes a GET request to `/api/photos?tags=beach,sunset&includeSuggested=false` with pagination parameters
- **AND** returns the filtered photo list

#### Scenario: Get photos including AI-suggested tags
- **WHEN** the photo client calls `getPhotos(page, limit, { tags: ['beach'], includeSuggested: true })`
- **THEN** it makes a GET request to `/api/photos?tags=beach&includeSuggested=true` with pagination parameters
- **AND** returns photos matching tags in either user-confirmed or AI-suggested tags

#### Scenario: Get single photo
- **WHEN** the photo client calls `getPhoto(id)`
- **THEN** it makes a GET request to `/api/photos/:id` and returns the photo details

#### Scenario: Delete photo
- **WHEN** the photo client calls `deletePhoto(id)`
- **THEN** it makes a DELETE request to `/api/photos/:id` and returns the result

#### Scenario: Update photo tags
- **WHEN** the photo client calls `updatePhotoTags(id, tags)`
- **THEN** it makes a PUT request to `/api/photos/:id/tags` with the tags array and returns the updated photo

#### Scenario: Get tag autocomplete suggestions
- **WHEN** the photo client calls `getTags(prefix)`
- **THEN** it makes a GET request to `/api/tags?prefix={prefix}` and returns the tag suggestions

### Requirement: Gallery Page
The web application SHALL provide a gallery page for viewing all uploaded photos with tag search and filtering capabilities.

#### Scenario: Load photos on page load
- **WHEN** a user navigates to the gallery page
- **THEN** the page loads and displays photos using React Query

#### Scenario: Display photo grid
- **WHEN** the gallery page loads photos
- **THEN** it displays them using the PhotoGrid component

#### Scenario: Handle loading state
- **WHEN** photos are being fetched
- **THEN** the gallery page displays a loading indicator

#### Scenario: Handle error state
- **WHEN** photo fetching fails
- **THEN** the gallery page displays an error message

#### Scenario: Filter photos by tags
- **WHEN** a user selects tags in the TagSearch component
- **THEN** the gallery page updates the photo query with tag filters
- **AND** React Query refetches photos with the new filter parameters
- **AND** the PhotoGrid displays only photos matching the selected tags

#### Scenario: Toggle AI-suggested tags in search
- **WHEN** a user toggles the "Include AI-suggested tags" checkbox in TagSearch
- **THEN** the gallery page updates the photo query with `includeSuggested` parameter
- **AND** React Query refetches photos including AI-suggested tags in the search
- **AND** the PhotoGrid displays photos matching tags in either user-confirmed or AI-suggested tags

#### Scenario: Clear tag search
- **WHEN** a user clicks the clear search button in TagSearch
- **THEN** all tag filters are removed
- **AND** the gallery page displays all photos without tag filtering

## ADDED Requirements
### Requirement: Tag Search Component
The web application SHALL provide a TagSearch component for filtering photos by tags with autocomplete support.

#### Scenario: Display tag search input
- **WHEN** the TagSearch component is rendered
- **THEN** it displays a search input field with tag autocomplete functionality
- **AND** displays selected tags as chips/badges
- **AND** displays a checkbox for "Include AI-suggested tags"
- **AND** displays a clear search button

#### Scenario: Select tag from autocomplete
- **WHEN** a user types in the TagSearch input field
- **THEN** the component shows autocomplete suggestions from the tag API
- **AND** debounces API calls to avoid excessive requests
- **WHEN** a user selects a tag from the autocomplete dropdown
- **THEN** the tag is added to the selected tags list
- **AND** displayed as a chip/badge
- **AND** the search input is cleared for the next tag

#### Scenario: Remove selected tag
- **WHEN** a user clicks the remove button (×) on a tag chip
- **THEN** the tag is removed from the selected tags list
- **AND** the photo query is updated to remove that tag filter

#### Scenario: Multi-tag search with AND logic
- **WHEN** a user selects multiple tags (e.g., "beach" and "sunset")
- **THEN** the component filters photos to only show those that have all selected tags
- **AND** uses AND logic (photos must match all tags)

#### Scenario: Toggle AI suggestions in search
- **WHEN** a user checks the "Include AI-suggested tags" checkbox
- **THEN** the component includes AI-suggested tags in the search filter
- **AND** photos matching tags in either `tags` or `suggested_tags` arrays are displayed
- **WHEN** a user unchecks the checkbox
- **THEN** the component only searches user-confirmed tags
- **AND** photos are filtered to only match tags in the `tags` array

#### Scenario: Clear all tag filters
- **WHEN** a user clicks the clear search button
- **THEN** all selected tags are removed
- **AND** the "Include AI-suggested tags" checkbox is unchecked
- **AND** the photo query is updated to show all photos without tag filtering

