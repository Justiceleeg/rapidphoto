import { z } from "zod";

/**
 * Auth validation schemas
 */
export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Upload validation schemas
 */
export const photoMetadataSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  fileSize: z.number().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required").regex(/^image\//, "Must be an image file"),
});

export const initUploadSchema = z.object({
  photos: z.array(photoMetadataSchema).min(1, "At least one photo is required").max(100, "Maximum 100 photos allowed"),
});

// Support single photo or array
// Support single photo or array of photos
export const initUploadBodySchema = z.union([
  photoMetadataSchema,
  z.array(photoMetadataSchema).min(1, "At least one photo is required").max(100, "Maximum 100 photos allowed"),
]).transform((val) => {
  // Normalize to array format
  return Array.isArray(val) ? val : [val];
});

export const completePhotoSchema = z.object({
  photoId: z.string().uuid("Invalid photo ID format"),
});

export const failPhotoSchema = z.object({
  photoId: z.string().uuid("Invalid photo ID format"),
});

/**
 * Photo query validation schemas
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

export const updatePhotoTagsSchema = z.object({
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(50, "Tag cannot exceed 50 characters")).max(20, "Maximum 20 tags allowed"),
});

/**
 * Photo ID param validation
 */
export const photoIdParamSchema = z.object({
  id: z.string().uuid("Invalid photo ID format"),
});

/**
 * Upload job ID param validation
 */
export const uploadJobIdParamSchema = z.object({
  id: z.string().uuid("Invalid upload job ID format"),
});

