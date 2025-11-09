## MODIFIED Requirements
### Requirement: Mobile Gallery Screen
The mobile application SHALL provide a gallery screen in the tabs navigation for viewing all uploaded photos with tag search and filtering capabilities.

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

#### Scenario: Filter photos by tags
- **WHEN** a user enters tags in the search input field
- **THEN** the gallery screen updates the photo query with tag filters
- **AND** React Query refetches photos with the new filter parameters
- **AND** the PhotoGrid displays only photos matching the entered tags

#### Scenario: Toggle AI-suggested tags in search
- **WHEN** a user toggles the "Include AI-suggested tags" switch
- **THEN** the gallery screen updates the photo query with `includeSuggested` parameter
- **AND** React Query refetches photos including AI-suggested tags in the search
- **AND** the PhotoGrid displays photos matching tags in either user-confirmed or AI-suggested tags

#### Scenario: Clear tag search
- **WHEN** a user clears the search input
- **THEN** all tag filters are removed
- **AND** the gallery screen displays all photos without tag filtering

## ADDED Requirements
### Requirement: Tag Search on Mobile Gallery
The mobile gallery screen SHALL provide tag search functionality with autocomplete for filtering photos.

#### Scenario: Display search input
- **WHEN** the gallery screen is rendered
- **THEN** it displays a search input field at the top of the screen
- **AND** displays tag autocomplete suggestions as the user types
- **AND** displays a toggle switch for "Include AI-suggested tags"

#### Scenario: Select tag from autocomplete
- **WHEN** a user types in the search input field
- **THEN** the component shows autocomplete suggestions from the tag API
- **AND** debounces API calls to avoid excessive requests
- **WHEN** a user selects a tag from the autocomplete dropdown
- **THEN** the tag is added to the search filter
- **AND** photos are filtered to show only those matching the tag

#### Scenario: Multi-tag search with AND logic
- **WHEN** a user enters multiple tags (e.g., "beach sunset")
- **THEN** the component filters photos to only show those that have all entered tags
- **AND** uses AND logic (photos must match all tags)

#### Scenario: Toggle AI suggestions in search
- **WHEN** a user enables the "Include AI-suggested tags" toggle
- **THEN** the component includes AI-suggested tags in the search filter
- **AND** photos matching tags in either `tags` or `suggested_tags` arrays are displayed
- **WHEN** a user disables the toggle
- **THEN** the component only searches user-confirmed tags
- **AND** photos are filtered to only match tags in the `tags` array

#### Scenario: Clear tag search
- **WHEN** a user clears the search input field
- **THEN** all tag filters are removed
- **AND** the "Include AI-suggested tags" toggle is disabled
- **AND** the photo query is updated to show all photos without tag filtering

#### Scenario: Touch-optimized search interface
- **GIVEN** the tag search is displayed on mobile
- **WHEN** a user interacts with the search input and autocomplete
- **THEN** the interface SHALL have adequate touch targets (minimum 44x44 points on iOS, 48x48dp on Android)
- **AND** SHALL provide visual feedback on touch
- **AND** SHALL prevent accidental taps with appropriate spacing
- **AND** SHALL be optimized for mobile keyboard input

