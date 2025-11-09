import { Hono } from "hono";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { GetUploadJobHandler } from "../../../application/queries/get-upload-job/get-upload-job.handler.js";
import { UploadJobRepositoryImpl } from "../../database/repositories/upload-job.repository.impl.js";
import { validateParams } from "../middleware/validation.middleware.js";
import { uploadJobIdParamSchema } from "../validation/schemas.js";
import { AppError, createNotFoundError, createForbiddenError } from "../middleware/error.middleware.js";

/**
 * Upload job routes for batch upload job management
 * Handles retrieving upload job details and progress
 */
const uploadJobRoutes = new Hono<{ Variables: Variables }>();

// Initialize services and handlers
const uploadJobRepository = new UploadJobRepositoryImpl();
const getUploadJobHandler = new GetUploadJobHandler(uploadJobRepository);

/**
 * GET /api/upload-jobs/:id
 * Get upload job by ID
 * Returns upload job details with progress information
 */
uploadJobRoutes.get(
  "/:id",
  authMiddleware,
  validateParams(uploadJobIdParamSchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const params = c.get("validatedParams") as { id: string };
    const jobId = params.id;

    try {
      const result = await getUploadJobHandler.handle({
        jobId,
        userId: user.id,
      });

      return c.json(result, 200);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw createNotFoundError("Upload job", jobId);
      }
      if (error.message.includes("Unauthorized")) {
        throw createForbiddenError("Upload job does not belong to user");
      }
      throw error;
    }
  }
);

export default uploadJobRoutes;

