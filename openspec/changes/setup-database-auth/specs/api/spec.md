## MODIFIED Requirements

### Requirement: Backend API Application
The system SHALL provide a Hono-based backend API application with Domain-Driven Design architecture, database connectivity, and authentication.

#### Scenario: API initialization
- **WHEN** the API application is started
- **THEN** it runs on the configured port (default: 4000) and connects to the database

#### Scenario: Health check endpoint
- **WHEN** a GET request is made to `/health`
- **THEN** the API returns `{status: 'ok'}`

## ADDED Requirements

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

