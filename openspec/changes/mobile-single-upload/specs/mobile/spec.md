## ADDED Requirements

### Requirement: Tabs Navigation
The mobile application SHALL provide a tabs layout for navigation between main screens.

#### Scenario: Tabs layout
- **WHEN** the app loads
- **THEN** a tabs layout is displayed with tabs for upload and other main screens

### Requirement: Image Picker
The mobile application SHALL provide functionality to select photos from the device.

#### Scenario: Open image picker
- **WHEN** a user taps the image picker button
- **THEN** the device photo library or camera is opened for photo selection

#### Scenario: Select single photo
- **WHEN** a user selects a photo from the picker
- **THEN** the selected photo is ready for upload

#### Scenario: Image picker permissions
- **WHEN** the image picker is opened for the first time
- **THEN** the app requests necessary permissions (camera, photo library)

### Requirement: Image Preview (Mobile)
The mobile application SHALL display a preview of the selected photo before upload.

#### Scenario: Display preview
- **WHEN** a photo is selected
- **THEN** a preview of the image is displayed showing the file name and thumbnail

### Requirement: Upload Store (Mobile)
The mobile application SHALL provide a store for managing photo upload state.

#### Scenario: Upload state management
- **WHEN** a file is selected for upload
- **THEN** the store tracks the selected file and upload state (pending, uploading, completed, error)

#### Scenario: Upload flow with FileSystem
- **WHEN** an upload is initiated
- **THEN** the store uses expo-file-system to upload the file to R2 using the presigned URL, then calls completePhoto

### Requirement: Upload Screen
The mobile application SHALL provide an upload screen where users can upload photos.

#### Scenario: Upload screen access
- **WHEN** an authenticated user navigates to the upload tab
- **THEN** the upload screen is displayed with image picker and upload controls

#### Scenario: Single photo upload
- **WHEN** a user selects a photo and taps upload
- **THEN** the photo is uploaded to R2, the upload state is tracked, and success/error feedback is shown

#### Scenario: Upload requires authentication
- **WHEN** an unauthenticated user navigates to the upload screen
- **THEN** they are redirected to the login screen

