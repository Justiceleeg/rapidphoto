import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "../../../config/env.js";

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Error response format
 */
interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  path?: string;
  timestamp?: string;
}

/**
 * Error handler for Hono app
 * Catches all errors and returns consistent error responses
 */
export function errorHandler(error: Error, c: Context) {
  // Log error with context
  const errorContext = {
    path: c.req.path,
    method: c.req.method,
    userId: c.get("user")?.id,
    error: error.message,
    stack: env.nodeEnv === "development" ? error.stack : undefined,
  };

  console.error("API Error:", errorContext);

  // Handle HTTPException from Hono
  if (error instanceof HTTPException) {
    const response: ErrorResponse = {
      error: error.message || "An error occurred",
      path: c.req.path,
      timestamp: new Date().toISOString(),
    };

    if (env.nodeEnv === "development" && error.cause) {
      response.details = error.cause;
    }

    return c.json(response, error.status);
  }

  // Handle AppError
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      path: c.req.path,
      timestamp: new Date().toISOString(),
    };

    if (error.details) {
      response.details = error.details;
    }

    return c.json(response, error.statusCode as 400 | 401 | 403 | 404 | 500);
  }

  // Handle validation errors (Zod)
  if (error && typeof error === "object" && "issues" in error) {
    const response: ErrorResponse = {
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: (error as { issues: unknown }).issues,
      path: c.req.path,
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 400);
  }

  // Handle generic errors
  const response: ErrorResponse = {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    path: c.req.path,
    timestamp: new Date().toISOString(),
  };

  if (env.nodeEnv === "development") {
    response.details = {
      message: error.message,
      stack: error.stack,
    };
  }

  return c.json(response, 500);
}

/**
 * Helper function to create validation errors
 */
export function createValidationError(message: string, details?: unknown): AppError {
  return new AppError(400, message, "VALIDATION_ERROR", details);
}

/**
 * Helper function to create authentication errors
 */
export function createAuthError(message: string = "Unauthorized"): AppError {
  return new AppError(401, message, "AUTH_ERROR");
}

/**
 * Helper function to create not found errors
 */
export function createNotFoundError(resource: string, id?: string): AppError {
  const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
  return new AppError(404, message, "NOT_FOUND");
}

/**
 * Helper function to create forbidden errors
 */
export function createForbiddenError(message: string = "Forbidden"): AppError {
  return new AppError(403, message, "FORBIDDEN");
}

