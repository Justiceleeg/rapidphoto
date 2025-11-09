import { z } from "zod";

/**
 * Auth validation schemas
 * Note: These are defined but not used as Better-Auth handles its own validation
 */

/**
 * Signup request validation schema
 */
export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

/**
 * Signin request validation schema
 */
export const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Upload validation schemas
 */

/**
 * Photo metadata validation schema
 */
export const photoMetadataSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  fileSize: z.number().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required").regex(/^image\//, "Must be an image file"),
});

/**
 * Upload initialization body schema
 * Supports both single photo object and array of photos (1-100 photos)
 * Normalizes input to always return an array
 */
export const initUploadBodySchema = z.union([
  photoMetadataSchema,
  z.array(photoMetadataSchema).min(1, "At least one photo is required").max(100, "Maximum 100 photos allowed"),
]).transform((val) => {
  // Normalize to array format
  return Array.isArray(val) ? val : [val];
});

/**
 * Complete photo request validation schema
 */
export const completePhotoSchema = z.object({
  photoId: z.string().uuid("Invalid photo ID format"),
});

/**
 * Fail photo request validation schema
 */
export const failPhotoSchema = z.object({
  photoId: z.string().uuid("Invalid photo ID format"),
});

/**
 * Photo query validation schemas
 */

/**
 * Get photos query parameters validation schema
 * Supports pagination, tag filtering, and suggested tags inclusion
 */
export const getPhotosQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  tags: z.string().optional().transform((val) => {
    if (!val) return undefined;
    return val.split(",").filter(Boolean);
  }),
  includeSuggested: z.coerce.boolean().optional(),
});

/**
 * Update photo tags request body validation schema
 * Validates tag array (max 20 tags, each max 50 characters)
 */
export const updatePhotoTagsSchema = z.object({
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(50, "Tag cannot exceed 50 characters")).max(20, "Maximum 20 tags allowed"),
});

/**
 * Photo ID route parameter validation schema
 */
export const photoIdParamSchema = z.object({
  id: z.string().uuid("Invalid photo ID format"),
});

/**
 * Upload job ID route parameter validation schema
 */
export const uploadJobIdParamSchema = z.object({
  id: z.string().uuid("Invalid upload job ID format"),
});

