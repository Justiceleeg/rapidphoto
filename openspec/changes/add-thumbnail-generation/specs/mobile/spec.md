## ADDED Requirements

### Requirement: Thumbnail Display in Mobile Gallery
The mobile gallery SHALL display thumbnails for faster loading and reduced bandwidth usage with fallback to full images.

#### Scenario: Mobile PhotoGrid displays thumbnails
- **WHEN** the gallery screen loads
- **THEN** PhotoGrid component displays thumbnails (using thumbnail_key to generate URL) in a 3-column grid layout

#### Scenario: Thumbnail fallback on mobile
- **WHEN** a photo does not have a thumbnail_key
- **THEN** mobile PhotoGrid displays the full image as a fallback

#### Scenario: Efficient mobile loading
- **WHEN** thumbnails are displayed in the mobile gallery
- **THEN** they use efficient loading strategies to minimize mobile data usage and battery consumption

### Requirement: Full Image Display in Mobile Viewer
The mobile photo viewer SHALL display full-resolution images when viewing photo details.

#### Scenario: PhotoViewer shows full image
- **WHEN** a user taps on a thumbnail in the gallery
- **THEN** PhotoViewer opens and displays the full-resolution image (using r2Url)

#### Scenario: Full image loading on mobile
- **WHEN** a full-resolution image is loading in PhotoViewer
- **THEN** a loading indicator is displayed while the image loads

#### Scenario: Platform-specific image handling
- **WHEN** thumbnails and full images are displayed on mobile
- **THEN** they work correctly on both iOS and Android platforms using React Native Image component

