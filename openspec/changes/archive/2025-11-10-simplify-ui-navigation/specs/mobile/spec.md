## MODIFIED Requirements

### Requirement: Mobile Gallery Screen
The mobile application SHALL provide a gallery screen as the main screen in the tabs navigation for viewing all uploaded photos.

#### Scenario: Load photos on screen load
- **WHEN** a user navigates to the gallery tab
- **THEN** the screen loads and displays photos using React Query

#### Scenario: Display photo grid
- **WHEN** the gallery screen loads photos
- **THEN** it displays them using the PhotoGrid component

#### Scenario: Handle loading state
- **WHEN** photos are being fetched
- **THEN** the gallery screen displays a loading indicator

#### Scenario: Handle error state
- **WHEN** photo fetching fails
- **THEN** the gallery screen displays an error message

#### Scenario: Gallery is main screen
- **WHEN** a user opens the mobile app after login
- **THEN** the gallery screen is displayed as the main/default screen

## ADDED Requirements

### Requirement: Gallery Header
The mobile gallery screen SHALL provide a header component displaying user information and action buttons.

#### Scenario: Display username in header
- **WHEN** a user is authenticated and viewing the gallery
- **THEN** the header displays the user's username

#### Scenario: Display photo count in header
- **WHEN** a user is authenticated and viewing the gallery
- **THEN** the header displays the total number of photos (e.g., "# 42 photos")

#### Scenario: Upload button in header
- **WHEN** a user taps the upload button in the header
- **THEN** the image picker opens
- **WHEN** a user selects photo files
- **THEN** the upload flow is triggered

#### Scenario: Signout button in header
- **WHEN** a user taps the signout button in the header
- **THEN** the user is signed out
- **AND** the user is navigated to the login screen

## REMOVED Requirements

### Requirement: Upload Tab
**Reason**: Upload functionality is now integrated into the gallery screen via the header button, eliminating the need for a separate upload tab.
**Migration**: Users can access upload functionality via the upload button in the gallery header.

