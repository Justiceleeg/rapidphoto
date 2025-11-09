import { Context, Next } from "hono";
import { z } from "zod";
import { createValidationError } from "./error.middleware.js";

/**
 * Validation middleware factory
 * Creates middleware that validates request body, query, or params against a Zod schema
 */
export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      // Store validated data in context for handlers to use
      c.set("validatedBody", validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError("Validation failed", error.issues);
      }
      throw error;
    }
  };
}

/**
 * Validation middleware for query parameters
 */
export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const queryParams: Record<string, string> = {};
      const url = new URL(c.req.url);
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      const validated = schema.parse(queryParams);
      c.set("validatedQuery", validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError("Query validation failed", error.issues);
      }
      throw error;
    }
  };
}

/**
 * Validation middleware for route parameters
 */
export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);
      c.set("validatedParams", validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError("Parameter validation failed", error.issues);
      }
      throw error;
    }
  };
}

