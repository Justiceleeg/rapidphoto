# infrastructure Specification

## Purpose
TBD - created by archiving change deploy-authentication. Update Purpose after archive.
## Requirements
### Requirement: Production Deployment
The system SHALL provide production deployment infrastructure for API and web applications.

#### Scenario: API deployment
- **WHEN** the API is deployed to Railway
- **THEN** it is accessible via a production URL and connects to the production database

#### Scenario: Web deployment
- **WHEN** the web application is deployed to Railway
- **THEN** it is accessible via a production URL and connects to the production API

#### Scenario: Database migrations in production
- **WHEN** the API is deployed
- **THEN** database migrations are applied automatically or manually as part of the deployment process

### Requirement: Production Environment Configuration
The system SHALL use production environment variables for configuration.

#### Scenario: API environment variables
- **WHEN** the API is deployed
- **THEN** it uses production environment variables (DATABASE_URL, JWT_SECRET, NODE_ENV, PORT)

#### Scenario: Web environment variables
- **WHEN** the web application is deployed
- **THEN** it uses production environment variables (NEXT_PUBLIC_API_URL)

#### Scenario: Mobile environment variables
- **WHEN** the mobile application is configured
- **THEN** it uses production API URL (EXPO_PUBLIC_API_URL)

### Requirement: Production Authentication
The system SHALL provide authentication functionality in the production environment.

#### Scenario: Web registration in production
- **WHEN** a user registers on the production web application
- **THEN** a new account is created in the production database

#### Scenario: Web login in production
- **WHEN** a user logs in on the production web application
- **THEN** they are authenticated and can access protected routes

#### Scenario: Mobile registration in production
- **WHEN** a user registers on the mobile application
- **THEN** a new account is created in the production database

#### Scenario: Mobile login in production
- **WHEN** a user logs in on the mobile application
- **THEN** they are authenticated and can access protected screens

### Requirement: Session Persistence in Production
The system SHALL maintain user sessions across requests in the production environment.

#### Scenario: Session persistence
- **WHEN** a user is authenticated in production
- **THEN** their session persists across requests and page navigations

#### Scenario: Session validation
- **WHEN** a user makes a request with a valid session
- **THEN** the session is validated and the request is processed

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

