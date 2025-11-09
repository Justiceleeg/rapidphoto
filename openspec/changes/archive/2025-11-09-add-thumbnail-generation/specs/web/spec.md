## ADDED Requirements

### Requirement: Thumbnail Display in Gallery
The web gallery SHALL display thumbnails for faster loading with fallback to full images.

#### Scenario: PhotoGrid displays thumbnails
- **WHEN** the gallery page loads
- **THEN** PhotoGrid component displays thumbnails (using thumbnail_key to generate URL) instead of full-size images

#### Scenario: Thumbnail fallback
- **WHEN** a photo does not have a thumbnail_key
- **THEN** PhotoGrid displays the full image as a fallback

#### Scenario: Lazy loading thumbnails
- **WHEN** thumbnails are displayed in the gallery
- **THEN** they use lazy loading to improve performance and reduce initial bandwidth usage

### Requirement: Full Image Display in Modal
The web photo modal SHALL display full-resolution images when viewing photo details.

#### Scenario: PhotoModal shows full image
- **WHEN** a user clicks on a thumbnail in the gallery
- **THEN** PhotoModal opens and displays the full-resolution image (using r2Url)

#### Scenario: Full image loading indicator
- **WHEN** a full-resolution image is loading in PhotoModal
- **THEN** a loading indicator is displayed while the image loads

