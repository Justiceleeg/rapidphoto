# Change: Setup Database & Auth

## Why
Establish the database infrastructure with PostgreSQL on Railway, create the user schema using Drizzle ORM, configure Better-Auth for authentication, and implement authentication endpoints. This enables user registration, login, session management, and protected routes.

## What Changes
- Setup PostgreSQL database on Railway
- Create Drizzle schema with users table
- Configure database connection and migrations
- Setup Better-Auth with Drizzle adapter
- Implement authentication routes (signup, signin, signout, session)
- Create authentication middleware for protected routes

## Impact
- Affected specs: api (MODIFIED - adds authentication capability)
- Affected code: Database schema, auth infrastructure, HTTP routes in `apps/api/`

