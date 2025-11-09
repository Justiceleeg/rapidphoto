## ADDED Requirements

### Requirement: Display AI Tag Suggestions
The PhotoModal SHALL display AI-suggested tags separately from user-confirmed tags.

#### Scenario: Show AI suggestions with distinct styling
- **GIVEN** a photo has both user-confirmed tags and AI-suggested tags
- **WHEN** viewing the photo in the modal
- **THEN** the system SHALL display `suggestedTags` in a separate section labeled "AI Suggestions"
- **AND** SHALL style AI suggestion badges differently (e.g., with an AI icon or different color)
- **AND** SHALL display user-confirmed tags in the main tags section
- **AND** SHALL clearly distinguish between the two types of tags

#### Scenario: No AI suggestions available
- **GIVEN** a photo does not have AI-suggested tags
- **WHEN** viewing the photo in the modal
- **THEN** the system SHALL not display the AI suggestions section
- **OR** SHALL display a message indicating no suggestions are available

### Requirement: Accept AI Tag Suggestion
Users SHALL be able to accept an AI-suggested tag with one click.

#### Scenario: Accept suggestion successfully
- **GIVEN** a photo has AI-suggested tags displayed
- **WHEN** a user clicks the "Accept" button on a suggestion
- **THEN** the system SHALL call the accept tag API endpoint
- **AND** SHALL move the tag from AI suggestions to confirmed tags optimistically
- **AND** SHALL update the cache to reflect the change
- **AND** SHALL show a success notification

#### Scenario: Accept suggestion fails
- **GIVEN** the accept tag API call fails
- **WHEN** attempting to accept a suggestion
- **THEN** the system SHALL revert the optimistic update
- **AND** SHALL display an error notification
- **AND** SHALL keep the tag in AI suggestions

### Requirement: Reject AI Tag Suggestion
Users SHALL be able to reject an AI-suggested tag with one click.

#### Scenario: Reject suggestion successfully
- **GIVEN** a photo has AI-suggested tags displayed
- **WHEN** a user clicks the "Reject" or "×" button on a suggestion
- **THEN** the system SHALL call the reject tag API endpoint
- **AND** SHALL remove the tag from AI suggestions optimistically
- **AND** SHALL update the cache to reflect the change
- **AND** SHALL show a success notification

#### Scenario: Reject suggestion fails
- **GIVEN** the reject tag API call fails
- **WHEN** attempting to reject a suggestion
- **THEN** the system SHALL revert the optimistic update
- **AND** SHALL display an error notification
- **AND** SHALL keep the tag in AI suggestions

