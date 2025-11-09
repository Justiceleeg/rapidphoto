## ADDED Requirements

### Requirement: Gallery API Deployment
The gallery API endpoints SHALL be deployed and accessible in the production environment.

#### Scenario: Gallery API endpoints accessible
- **WHEN** the API is deployed to Railway
- **THEN** the gallery endpoints (`GET /api/photos`, `GET /api/photos/:id`, `DELETE /api/photos/:id`, `GET /api/upload-jobs/:id`) are accessible in production

#### Scenario: Gallery API authentication works
- **WHEN** gallery endpoints are accessed in production
- **THEN** authentication middleware correctly protects the endpoints

### Requirement: Gallery Web Deployment
The web gallery functionality SHALL be deployed and accessible in the production environment.

#### Scenario: Gallery page accessible
- **WHEN** the web application is deployed to Railway
- **THEN** the gallery page is accessible at the production URL

#### Scenario: Gallery images load from R2
- **WHEN** users view photos in the gallery
- **THEN** images load correctly from R2 storage using the R2 public URLs

### Requirement: Gallery Mobile Deployment
The mobile gallery functionality SHALL work correctly with the production API.

#### Scenario: Mobile gallery connects to production API
- **WHEN** the mobile app is configured with the production API URL
- **THEN** the gallery screen successfully loads photos from the production API

#### Scenario: Mobile gallery images load from R2
- **WHEN** users view photos in the mobile gallery
- **THEN** images load correctly from R2 storage using the R2 public URLs

### Requirement: Production Gallery Testing
The gallery functionality SHALL be tested and verified in the production environment.

#### Scenario: Web gallery works in production
- **WHEN** users access the gallery page in production
- **THEN** they can view photos, navigate pagination, and open photo modals

#### Scenario: Mobile gallery works in production
- **WHEN** users access the gallery screen in production
- **THEN** they can view photos, use pull-to-refresh, and open photo viewer

#### Scenario: Images load from R2 in production
- **WHEN** users view photos in production
- **THEN** images load correctly from R2 storage with proper URLs

