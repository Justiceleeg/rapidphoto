## ADDED Requirements

### Requirement: Backend API Application
The system SHALL provide a Hono-based backend API application with Domain-Driven Design architecture.

#### Scenario: API initialization
- **WHEN** the API application is started
- **THEN** it runs on the configured port (default: 4000)

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

