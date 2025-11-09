import { Hono } from "hono";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { GetPhotosHandler } from "../../../application/queries/get-photos/get-photos.handler.js";
import { GetPhotoHandler } from "../../../application/queries/get-photo/get-photo.handler.js";
import { GetUploadJobHandler } from "../../../application/queries/get-upload-job/get-upload-job.handler.js";
import { UpdatePhotoTagsHandler } from "../../../application/commands/update-photo-tags/update-photo-tags.handler.js";
import { PhotoRepositoryImpl } from "../../database/repositories/photo.repository.impl.js";
import { UploadJobRepositoryImpl } from "../../database/repositories/upload-job.repository.impl.js";
import { R2Service } from "../../storage/r2.service.js";
import { validateQuery, validateParams, validateBody } from "../middleware/validation.middleware.js";
import { getPhotosQuerySchema, photoIdParamSchema, updatePhotoTagsSchema } from "../validation/schemas.js";
import { AppError, createNotFoundError, createForbiddenError } from "../middleware/error.middleware.js";

const photoRoutes = new Hono<{ Variables: Variables }>();

// Initialize services and handlers
const photoRepository = new PhotoRepositoryImpl();
const uploadJobRepository = new UploadJobRepositoryImpl();
const r2Service = new R2Service();
const getPhotosHandler = new GetPhotosHandler(photoRepository, r2Service);
const getPhotoHandler = new GetPhotoHandler(photoRepository, r2Service);
const getUploadJobHandler = new GetUploadJobHandler(uploadJobRepository);
const updatePhotoTagsHandler = new UpdatePhotoTagsHandler(photoRepository);

// GET /api/photos - List photos with pagination
photoRoutes.get(
  "/",
  authMiddleware,
  validateQuery(getPhotosQuerySchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const query = c.get("validatedQuery") as {
      page?: number;
      limit?: number;
      tags?: string[];
      includeSuggested?: boolean;
    };

    const result = await getPhotosHandler.handle({
      userId: user.id,
      page: query?.page,
      limit: query?.limit,
      // tags and includeSuggested will be added in Slice 6
    });

    return c.json(result, 200);
  }
);

// GET /api/photos/:id - Get single photo
photoRoutes.get(
  "/:id",
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
      const result = await getPhotoHandler.handle({
        photoId,
        userId: user.id,
      });

      return c.json(result, 200);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw createNotFoundError("Photo", photoId);
      }
      if (error.message.includes("Unauthorized")) {
        throw createForbiddenError("Photo does not belong to user");
      }
      throw error;
    }
  }
);

// DELETE /api/photos/:id - Delete photo
photoRoutes.delete(
  "/:id",
  authMiddleware,
  validateParams(photoIdParamSchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const params = c.get("validatedParams") as { id: string };
    const photoId = params.id;

    // Verify photo exists and belongs to user
    const photo = await photoRepository.findById(photoId);
    if (!photo) {
      throw createNotFoundError("Photo", photoId);
    }
    if (photo.userId !== user.id) {
      throw createForbiddenError("Photo does not belong to user");
    }

    await photoRepository.delete(photoId);

    return c.json({ success: true }, 200);
  }
);

// PUT /api/photos/:id/tags - Update photo tags
photoRoutes.put(
  "/:id/tags",
  authMiddleware,
  validateParams(photoIdParamSchema),
  validateBody(updatePhotoTagsSchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new AppError(401, "Unauthorized", "AUTH_ERROR");
    }

    const params = c.get("validatedParams") as { id: string };
    const photoId = params.id;
    const body = c.get("validatedBody") as { tags: string[] };
    const tags = body.tags;

    try {
      const result = await updatePhotoTagsHandler.handle({
        photoId,
        userId: user.id,
        tags,
      });

      return c.json(result, 200);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw createNotFoundError("Photo", photoId);
      }
      if (error.message.includes("Unauthorized")) {
        throw createForbiddenError("Photo does not belong to user");
      }
      if (
        error.message.includes("must be") ||
        error.message.includes("cannot") ||
        error.message.includes("Tags")
      ) {
        throw new AppError(400, error.message, "VALIDATION_ERROR");
      }
      throw error;
    }
  }
);

export default photoRoutes;

