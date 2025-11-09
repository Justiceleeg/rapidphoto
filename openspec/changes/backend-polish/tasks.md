## 1. Error Handling
- [x] 1.1 Create error handling middleware (`apps/api/src/infrastructure/http/middleware/error.middleware.ts`)
  - Handle different error types (validation, authentication, not found, server errors)
  - Return consistent error response format
  - Log errors appropriately

## 2. Request Validation
- [ ] 2.1 Add Zod validation schemas for auth endpoints
  - Signup request validation
  - Signin request validation
  - **Status**: Not needed - Better-Auth handles its own validation internally
- [x] 2.2 Add Zod validation schemas for upload endpoints
  - Init upload request validation
  - Complete photo request validation
  - Fail photo request validation
- [x] 2.3 Add Zod validation schemas for photo endpoints
  - Get photos query parameters validation
  - Update photo tags request validation
- [x] 2.4 Integrate validation middleware into all routes
  - Apply validation before handlers
  - Return validation errors in consistent format

## 3. Logging
- [x] 3.1 Add Hono logger middleware to main app (`apps/api/src/index.ts`)
  - Configure logger for development and production
  - Log request/response details
  - Log errors with context

## 4. CORS Configuration
- [x] 4.1 Add CORS middleware to main app (`apps/api/src/index.ts`)
  - Configure allowed origins (web and mobile app URLs)
  - Configure allowed methods and headers
  - Configure credentials handling
  - Note: Already existed and verified correct

## 5. Code Cleanup
- [x] 5.1 Review and refactor application layer code
  - Extract common patterns
  - Improve error handling consistency
  - Remove unused code
  - **Completed**: Replaced generic Error with AppError helpers, removed redundant validation
- [x] 5.2 Review and refactor infrastructure layer code
  - Improve database query patterns
  - Standardize route handlers
  - Improve type safety

## 6. Documentation
- [ ] 6.1 Add JSDoc comments to application layer
  - Document command/query handlers
  - Document DTOs
  - Document use cases
- [ ] 6.2 Add JSDoc comments to domain layer
  - Document entities
  - Document repository interfaces
  - Document domain logic
- [ ] 6.3 Add JSDoc comments to infrastructure layer
  - Document route handlers
  - Document middleware
  - Document services

