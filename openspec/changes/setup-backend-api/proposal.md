# Change: Setup Backend API

## Why
Initialize the backend API application with Hono framework, establish the Domain-Driven Design (DDD) folder structure, and configure the development environment. This provides the foundation for all backend functionality including authentication, file uploads, and API endpoints.

## What Changes
- Initialize Hono-based API application in `apps/api`
- Install core dependencies (Hono, Drizzle ORM, PostgreSQL, Better-Auth)
- Setup DDD folder structure (domain, application, infrastructure layers)
- Configure environment variables and package.json scripts
- Create basic Hono app with health check endpoint

## Impact
- Affected specs: api (new capability)
- Affected code: `apps/api/` directory structure and configuration files

