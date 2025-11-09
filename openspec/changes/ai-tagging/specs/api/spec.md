## ADDED Requirements

### Requirement: AI Tag Suggestions
The system SHALL automatically generate tag suggestions for uploaded photos using AWS Rekognition.

#### Scenario: Photo processed for AI tagging
- **GIVEN** a photo has been successfully uploaded and completed
- **WHEN** the AI tagging job processes the photo
- **THEN** the system SHALL call AWS Rekognition DetectLabels API
- **AND** SHALL filter labels with confidence ≥70%
- **AND** SHALL store the filtered labels in the `suggested_tags` array
- **AND** SHALL handle API errors with retry logic

#### Scenario: High confidence tags only
- **GIVEN** AWS Rekognition returns labels with varying confidence scores
- **WHEN** filtering labels for suggestions
- **THEN** the system SHALL only include labels with confidence ≥70%
- **AND** SHALL sort labels by confidence (highest first)

### Requirement: Accept AI Tag Suggestion
Users SHALL be able to accept an AI-suggested tag and move it to their confirmed tags.

#### Scenario: Accept valid suggestion
- **GIVEN** a photo has AI-suggested tags
- **WHEN** a user accepts a suggested tag
- **THEN** the system SHALL move the tag from `suggested_tags` to `tags` array
- **AND** SHALL remove the tag from `suggested_tags`
- **AND** SHALL verify the user owns the photo
- **AND** SHALL return the updated photo

#### Scenario: Accept non-existent suggestion
- **GIVEN** a photo does not have the specified suggested tag
- **WHEN** a user attempts to accept it
- **THEN** the system SHALL return a 404 error

### Requirement: Reject AI Tag Suggestion
Users SHALL be able to reject an AI-suggested tag.

#### Scenario: Reject valid suggestion
- **GIVEN** a photo has AI-suggested tags
- **WHEN** a user rejects a suggested tag
- **THEN** the system SHALL remove the tag from `suggested_tags` array
- **AND** SHALL verify the user owns the photo
- **AND** SHALL return the updated photo

#### Scenario: Reject non-existent suggestion
- **GIVEN** a photo does not have the specified suggested tag
- **WHEN** a user attempts to reject it
- **THEN** the system SHALL return a 404 error

### Requirement: Photo API Response
The GetPhoto and GetPhotos endpoints SHALL include suggested tags in the response.

#### Scenario: Photo with AI suggestions
- **GIVEN** a photo has AI-suggested tags
- **WHEN** a user retrieves the photo
- **THEN** the response SHALL include both `tags` (user-confirmed) and `suggestedTags` (AI-generated) arrays
- **AND** SHALL clearly distinguish between confirmed and suggested tags

