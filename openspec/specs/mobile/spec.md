# mobile Specification

## Purpose
TBD - created by archiving change mobile-gallery. Update Purpose after archive.
## Requirements
### Requirement: Mobile Photo Grid Component
The mobile application SHALL provide a PhotoGrid component for displaying photos in a grid layout optimized for mobile devices.

#### Scenario: Display photos in grid
- **WHEN** the PhotoGrid component receives a list of photos
- **THEN** it displays them in a FlatList with 3 columns showing photo thumbnails

#### Scenario: Open photo viewer on press
- **WHEN** a user presses on a photo in the PhotoGrid
- **THEN** the PhotoViewer modal opens displaying the full-size photo

#### Scenario: Handle empty state
- **WHEN** the PhotoGrid receives an empty list of photos
- **THEN** it displays an empty state message

### Requirement: Mobile Photo Viewer Component
The mobile application SHALL provide a PhotoViewer component for viewing individual photos in detail.

#### Scenario: Display full-size photo
- **WHEN** the PhotoViewer is opened with a photo
- **THEN** it displays the full-size photo image optimized for mobile viewing

#### Scenario: Show photo metadata
- **WHEN** the PhotoViewer is opened
- **THEN** it displays photo metadata such as filename, upload date, status, and tags

#### Scenario: Display tags in photo viewer
- **WHEN** the PhotoViewer is opened with a photo that has tags
- **THEN** it displays the photo's tags as chips/badges below the photo metadata

#### Scenario: Edit tags in photo viewer
- **WHEN** a user presses the "Edit Tags" button in the PhotoViewer
- **THEN** the tag editing interface is displayed with a TagInput component
- **WHEN** a user adds a new tag and presses Enter
- **THEN** the tag is added to the photo and saved automatically
- **WHEN** a user removes a tag by pressing the X button on a tag badge
- **THEN** the tag is removed from the photo and saved automatically

#### Scenario: Close viewer
- **WHEN** a user presses the close button or swipes down
- **THEN** the PhotoViewer closes

### Requirement: Mobile Gallery Screen
The mobile application SHALL provide a gallery screen in the tabs navigation for viewing all uploaded photos.

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

### Requirement: Pull-to-Refresh
The gallery screen SHALL support pull-to-refresh functionality for reloading photos.

#### Scenario: Pull to refresh
- **WHEN** a user pulls down on the gallery screen
- **THEN** the photo list is refreshed and a refresh indicator is shown

#### Scenario: Refresh completes
- **WHEN** the refresh completes
- **THEN** the refresh indicator is hidden and the updated photo list is displayed

### Requirement: Display AI Tag Suggestions on Mobile
The PhotoViewer SHALL display AI-suggested tags separately from user-confirmed tags on mobile devices.

#### Scenario: Show AI suggestions with distinct styling
- **GIVEN** a photo has both user-confirmed tags and AI-suggested tags
- **WHEN** viewing the photo in the PhotoViewer
- **THEN** the system SHALL display `suggestedTags` in a separate section labeled "AI Suggestions"
- **AND** SHALL style AI suggestion badges differently (e.g., with an AI icon or different background color)
- **AND** SHALL display user-confirmed tags in the main tags section
- **AND** SHALL clearly distinguish between the two types of tags
- **AND** SHALL be optimized for touch interactions on mobile

#### Scenario: No AI suggestions available
- **GIVEN** a photo does not have AI-suggested tags
- **WHEN** viewing the photo in the PhotoViewer
- **THEN** the system SHALL not display the AI suggestions section
- **OR** SHALL display a message indicating no suggestions are available

### Requirement: Accept AI Tag Suggestion on Mobile
Users SHALL be able to accept an AI-suggested tag with one tap on mobile.

#### Scenario: Accept suggestion successfully on iOS/Android
- **GIVEN** a photo has AI-suggested tags displayed
- **WHEN** a user taps the "Accept" button on a suggestion
- **THEN** the system SHALL call the accept tag API endpoint
- **AND** SHALL move the tag from AI suggestions to confirmed tags optimistically
- **AND** SHALL update the local state to reflect the change
- **AND** SHALL show a success toast notification
- **AND** SHALL provide haptic feedback (on supported devices)

#### Scenario: Accept suggestion fails on mobile
- **GIVEN** the accept tag API call fails
- **WHEN** attempting to accept a suggestion
- **THEN** the system SHALL revert the optimistic update
- **AND** SHALL display an error toast notification
- **AND** SHALL keep the tag in AI suggestions

### Requirement: Reject AI Tag Suggestion on Mobile
Users SHALL be able to reject an AI-suggested tag with one tap on mobile.

#### Scenario: Reject suggestion successfully on iOS/Android
- **GIVEN** a photo has AI-suggested tags displayed
- **WHEN** a user taps the "Reject" or "×" button on a suggestion
- **THEN** the system SHALL call the reject tag API endpoint
- **AND** SHALL remove the tag from AI suggestions optimistically
- **AND** SHALL update the local state to reflect the change
- **AND** SHALL show a success toast notification
- **AND** SHALL provide haptic feedback (on supported devices)

#### Scenario: Reject suggestion fails on mobile
- **GIVEN** the reject tag API call fails
- **WHEN** attempting to reject a suggestion
- **THEN** the system SHALL revert the optimistic update
- **AND** SHALL display an error toast notification
- **AND** SHALL keep the tag in AI suggestions

### Requirement: Mobile Touch Optimization
AI tag suggestion interactions SHALL be optimized for mobile touch interfaces.

#### Scenario: Touch-friendly buttons
- **GIVEN** AI suggestions are displayed on mobile
- **WHEN** a user interacts with accept/reject buttons
- **THEN** the buttons SHALL have adequate touch targets (minimum 44x44 points on iOS, 48x48dp on Android)
- **AND** SHALL provide visual feedback on touch
- **AND** SHALL prevent accidental taps with appropriate spacing

