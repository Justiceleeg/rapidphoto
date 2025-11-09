# api Specification

## Purpose
TBD - created by archiving change setup-backend-api. Update Purpose after archive.
## Requirements
### Requirement: Backend API Application
The system SHALL provide a Hono-based backend API application with Domain-Driven Design architecture, database connectivity, and authentication.

#### Scenario: API initialization
- **WHEN** the API application is started
- **THEN** it runs on the configured port (default: 4000) and connects to the database

#### Scenario: Health check endpoint
- **WHEN** a GET request is made to `/health`
- **THEN** the API returns `{status: 'ok'}`

### Requirement: DDD Architecture Structure
The API SHALL organize code using Domain-Driven Design layers: domain, application, and infrastructure.

#### Scenario: Folder structure
- **WHEN** the API is initialized
- **THEN** the `apps/api/src/` directory contains `domain/`, `application/`, and `infrastructure/` folders

#### Scenario: Infrastructure organization
- **WHEN** infrastructure code is added
- **THEN** it is organized under `infrastructure/database/`, `infrastructure/auth/`, and `infrastructure/http/`

### Requirement: Development Scripts
The API package.json SHALL provide scripts for development, building, database migrations, and starting the server.

#### Scenario: Development mode
- **WHEN** a developer runs `pnpm dev` in the API directory
- **THEN** the API starts in development mode with hot reload

#### Scenario: Database migrations
- **WHEN** a developer runs `pnpm db:generate`
- **THEN** Drizzle generates migration files from schema changes

#### Scenario: Apply migrations
- **WHEN** a developer runs `pnpm db:migrate`
- **THEN** pending database migrations are applied

### Requirement: Environment Configuration
The API SHALL use environment variables for configuration including database connection, authentication secrets, and runtime environment.

#### Scenario: Environment variables
- **WHEN** the API starts
- **THEN** it reads `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, and `PORT` from environment variables

### Requirement: Database Connection
The API SHALL connect to a PostgreSQL database using Drizzle ORM.

#### Scenario: Database connection
- **WHEN** the API starts
- **THEN** it establishes a connection to the PostgreSQL database using the DATABASE_URL environment variable

#### Scenario: Database schema
- **WHEN** migrations are applied
- **THEN** the users table is created with required fields (id, email, name, password_hash, created_at, updated_at)

### Requirement: User Registration
The API SHALL provide an endpoint for users to register with email and password.

#### Scenario: User signup
- **WHEN** a POST request is made to `/api/auth/signup` with valid email and password
- **THEN** a new user is created in the database and a session is established

#### Scenario: Duplicate email signup
- **WHEN** a POST request is made to `/api/auth/signup` with an email that already exists
- **THEN** the API returns an error indicating the email is already registered

### Requirement: User Authentication
The API SHALL provide an endpoint for users to login with email and password.

#### Scenario: User signin
- **WHEN** a POST request is made to `/api/auth/signin` with valid credentials
- **THEN** a session is established and the user is authenticated

#### Scenario: Invalid credentials signin
- **WHEN** a POST request is made to `/api/auth/signin` with invalid credentials
- **THEN** the API returns an authentication error

### Requirement: Session Management
The API SHALL provide endpoints for session management and signout.

#### Scenario: Get session
- **WHEN** a GET request is made to `/api/auth/session` with a valid session cookie
- **THEN** the API returns the current user's session information

#### Scenario: User signout
- **WHEN** a POST request is made to `/api/auth/signout` with a valid session
- **THEN** the session is invalidated and the user is logged out

### Requirement: Protected Routes
The API SHALL provide middleware to protect routes that require authentication.

#### Scenario: Protected route access
- **WHEN** a request is made to a protected route without authentication
- **THEN** the API returns a 401 Unauthorized error

#### Scenario: Authenticated route access
- **WHEN** a request is made to a protected route with valid authentication
- **THEN** the request proceeds and the user information is available

### Requirement: Photo Gallery Query Endpoints
The API SHALL provide endpoints for users to retrieve their uploaded photos with pagination and individual photo details.

#### Scenario: List user photos
- **WHEN** a GET request is made to `/api/photos` with valid authentication
- **THEN** the API returns a paginated list of the user's photos with temporary presigned URLs

#### Scenario: Get single photo
- **WHEN** a GET request is made to `/api/photos/:id` with valid authentication
- **THEN** the API returns the photo details with a temporary presigned URL if the photo belongs to the authenticated user

#### Scenario: Unauthorized photo access
- **WHEN** a GET request is made to `/api/photos/:id` for a photo that doesn't belong to the user
- **THEN** the API returns a 403 Forbidden error

### Requirement: Presigned URL Generation for Photo Access
The API SHALL generate temporary presigned URLs for viewing and downloading photos from private R2 storage, eliminating the need for public bucket access.

#### Scenario: Presigned URL generation for completed photos
- **WHEN** a photo query endpoint is called for a completed photo
- **THEN** the API generates a presigned GET URL valid for 1 hour for secure access to the R2 object

#### Scenario: Pending photo URL handling
- **WHEN** a photo query endpoint is called for a pending photo
- **THEN** the API returns null for the URL field since the photo upload is not yet complete

#### Scenario: Secure photo access
- **WHEN** presigned URLs are generated
- **THEN** they provide temporary, time-limited access without requiring the R2 bucket to be publicly accessible

