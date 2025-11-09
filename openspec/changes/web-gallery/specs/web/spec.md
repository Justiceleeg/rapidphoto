## ADDED Requirements

### Requirement: Photo Client Methods
The web application SHALL provide client methods for interacting with photo API endpoints.

#### Scenario: Get photos list
- **WHEN** the photo client calls `getPhotos(page, limit)`
- **THEN** it makes a GET request to `/api/photos` with pagination parameters and returns the photo list

#### Scenario: Get single photo
- **WHEN** the photo client calls `getPhoto(id)`
- **THEN** it makes a GET request to `/api/photos/:id` and returns the photo details

#### Scenario: Delete photo
- **WHEN** the photo client calls `deletePhoto(id)`
- **THEN** it makes a DELETE request to `/api/photos/:id` and returns the result

#### Scenario: Update photo tags
- **WHEN** the photo client calls `updatePhotoTags(id, tags)`
- **THEN** it makes a PUT request to `/api/photos/:id/tags` with the tags array and returns the updated photo

### Requirement: Photo Grid Component
The web application SHALL provide a PhotoGrid component for displaying photos in a grid layout.

#### Scenario: Display photos in grid
- **WHEN** the PhotoGrid component receives a list of photos
- **THEN** it displays them in a responsive grid layout with thumbnails

#### Scenario: Open photo modal on click
- **WHEN** a user clicks on a photo in the PhotoGrid
- **THEN** the PhotoModal opens displaying the full-size photo

#### Scenario: Handle empty state
- **WHEN** the PhotoGrid receives an empty list of photos
- **THEN** it displays an empty state message

### Requirement: Photo Modal Component
The web application SHALL provide a PhotoModal component for viewing individual photos in detail.

#### Scenario: Display full-size photo
- **WHEN** the PhotoModal is opened with a photo
- **THEN** it displays the full-size photo image

#### Scenario: Show photo metadata
- **WHEN** the PhotoModal is opened
- **THEN** it displays photo metadata such as filename, upload date, status, and tags

#### Scenario: Close modal
- **WHEN** a user clicks the close button or outside the modal
- **THEN** the PhotoModal closes

### Requirement: Gallery Page
The web application SHALL provide a gallery page for viewing all uploaded photos.

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

### Requirement: Gallery Pagination
The gallery page SHALL support pagination for navigating through multiple pages of photos.

#### Scenario: Display pagination controls
- **WHEN** there are multiple pages of photos
- **THEN** the gallery displays pagination controls (Previous/Next buttons, page numbers)

#### Scenario: Navigate to next page
- **WHEN** a user clicks the Next button
- **THEN** the gallery loads and displays the next page of photos

#### Scenario: Navigate to previous page
- **WHEN** a user clicks the Previous button
- **THEN** the gallery loads and displays the previous page of photos

#### Scenario: Navigate to specific page
- **WHEN** a user clicks a page number
- **THEN** the gallery loads and displays that page of photos

### Requirement: Gallery Navigation Link
The dashboard layout SHALL provide a navigation link to the gallery page.

#### Scenario: Gallery link in navigation
- **WHEN** a user views the dashboard layout
- **THEN** they see a navigation link to the gallery page

#### Scenario: Navigate to gallery
- **WHEN** a user clicks the gallery navigation link
- **THEN** they are navigated to the gallery page

### Requirement: Photo Tagging
The web application SHALL support adding and editing tags for photos.

#### Scenario: Display tags in photo modal
- **WHEN** the PhotoModal is opened with a photo that has tags
- **THEN** it displays the photo's tags as chips/badges

#### Scenario: Add tag to photo
- **WHEN** a user types a tag in the TagInput component and presses Enter
- **THEN** the tag is added to the photo and saved via the API

#### Scenario: Remove tag from photo
- **WHEN** a user clicks the remove button on a tag chip
- **THEN** the tag is removed from the photo and saved via the API

#### Scenario: Tag autocomplete
- **WHEN** a user types in the TagInput component
- **THEN** it shows autocomplete suggestions based on existing tags

#### Scenario: Update photo tags
- **WHEN** a user adds or removes tags in the PhotoModal
- **THEN** the photo client calls `updatePhotoTags(id, tags)` to save the changes

