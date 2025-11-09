import { Hono } from "hono";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { InitUploadHandler } from "../../../application/commands/init-upload/init-upload.handler.js";
import { CompletePhotoHandler } from "../../../application/commands/complete-photo/complete-photo.handler.js";
import { FailPhotoHandler } from "../../../application/commands/fail-photo/fail-photo.handler.js";
import { PhotoRepositoryImpl } from "../../database/repositories/photo.repository.impl.js";
import { UploadJobRepositoryImpl } from "../../database/repositories/upload-job.repository.impl.js";
import { R2Service } from "../../storage/r2.service.js";
import { progressService } from "../../sse/progress.service.instance.js";
import { validateBody, validateParams } from "../middleware/validation.middleware.js";
import { initUploadBodySchema, photoIdParamSchema } from "../validation/schemas.js";
import { AppError, createNotFoundError, createForbiddenError } from "../middleware/error.middleware.js";

/**
 * Upload routes for photo upload operations
 * Handles single and batch photo upload initialization, completion, and failure
 */
const uploadRoutes = new Hono<{ Variables: Variables }>();

// Initialize services and handlers
const photoRepository = new PhotoRepositoryImpl();
const uploadJobRepository = new UploadJobRepositoryImpl();
const r2Service = new R2Service();
const initUploadHandler = new InitUploadHandler(
  photoRepository,
  uploadJobRepository,
  r2Service
);
const completePhotoHandler = new CompletePhotoHandler(
  photoRepository,
  uploadJobRepository,
  r2Service,
  progressService
);
const failPhotoHandler = new FailPhotoHandler(
  photoRepository,
  uploadJobRepository,
  progressService
);

/**
 * POST /api/upload/init
 * Initialize photo upload (single or batch)
 * Creates photo records and generates presigned URLs for direct client upload
 * Supports 1-100 photos per batch
 */
uploadRoutes.post(
  "/init",
  authMiddleware,
  validateBody(initUploadBodySchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const body = c.get("validatedBody") as Array<{ filename: string; fileSize: number; mimeType: string }>;
    
    // Body is already normalized to array by schema transform
    const normalizedPhotos = body.map((p) => ({
      filename: p.filename,
      fileSize: typeof p.fileSize === "number" ? p.fileSize : Number(p.fileSize),
      mimeType: p.mimeType,
    }));

    const result = await initUploadHandler.handle({
      userId: user.id,
      photos: normalizedPhotos,
    });

    return c.json(result, 201);
  }
);

/**
 * Complete photo routes (mounted at /api/photos)
 * Handles photo upload completion and failure reporting
 */
export const completePhotoRoute = new Hono<{ Variables: Variables }>();

/**
 * POST /api/photos/:id/complete
 * Mark a photo upload as completed
 * Updates photo status, upload job progress, and publishes SSE events
 */
completePhotoRoute.post(
  "/:id/complete",
  authMiddleware,
  validateParams(photoIdParamSchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const params = c.get("validatedParams") as { id: string };
    const photoId = params.id;

    try {
      await completePhotoHandler.handle({
        photoId,
        userId: user.id,
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw createNotFoundError("Photo", photoId);
      }
      if (error.message.includes("Unauthorized")) {
        throw createForbiddenError("Photo does not belong to user");
      }
      throw error;
    }

    return c.json({ success: true }, 200);
  }
);

/**
 * POST /api/photos/:id/failed
 * Report a failed photo upload
 * Updates photo status, upload job progress, and publishes SSE events
 */
completePhotoRoute.post(
  "/:id/failed",
  authMiddleware,
  validateParams(photoIdParamSchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const params = c.get("validatedParams") as { id: string };
    const photoId = params.id;

    try {
      await failPhotoHandler.handle({
        photoId,
        userId: user.id,
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw createNotFoundError("Photo", photoId);
      }
      if (error.message.includes("Unauthorized")) {
        throw createForbiddenError("Photo does not belong to user");
      }
      throw error;
    }

    return c.json({ success: true }, 200);
  }
);

export default uploadRoutes;

