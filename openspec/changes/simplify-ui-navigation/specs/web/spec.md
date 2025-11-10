## MODIFIED Requirements

### Requirement: Gallery Page
The web application SHALL provide a gallery page as the root page (`/`) for viewing all uploaded photos.

#### Scenario: Load photos on page load
- **WHEN** a user navigates to the root page (`/`)
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

#### Scenario: Drag-and-drop upload
- **WHEN** a user drags photo files over the gallery area
- **THEN** the gallery displays visual feedback indicating the drop zone
- **WHEN** a user drops photo files on the gallery area
- **THEN** the upload flow is triggered and photos are uploaded

## ADDED Requirements

### Requirement: Application Header
The web application SHALL provide a header component displaying user information and action buttons.

#### Scenario: Display username in header
- **WHEN** a user is authenticated and viewing the gallery
- **THEN** the header displays the user's username

#### Scenario: Display photo count in header
- **WHEN** a user is authenticated and viewing the gallery
- **THEN** the header displays the total number of photos (e.g., "# 42 photos")

#### Scenario: Upload button in header
- **WHEN** a user clicks the upload button in the header
- **THEN** a file picker dialog opens
- **WHEN** a user selects photo files
- **THEN** the upload flow is triggered

#### Scenario: Signout button in header
- **WHEN** a user clicks the signout button in the header
- **THEN** the user is signed out
- **AND** the user is redirected to the login page

## REMOVED Requirements

### Requirement: Gallery Navigation Link
**Reason**: Gallery is now the root page, so navigation link is no longer needed.
**Migration**: Users will be automatically redirected to the gallery (root page) after login.

### Requirement: Dashboard Layout
**Reason**: Dashboard layout and separate dashboard pages are removed in favor of a simplified single-page experience.
**Migration**: All dashboard routes are removed. Gallery is now the root page.

