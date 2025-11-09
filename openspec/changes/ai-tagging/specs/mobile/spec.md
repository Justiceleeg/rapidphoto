## ADDED Requirements

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

