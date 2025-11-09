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
photoRoutes.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const page = c.req.query("page") ? parseInt(c.req.query("page")!, 10) : undefined;
    const limit = c.req.query("limit") ? parseInt(c.req.query("limit")!, 10) : undefined;

    const result = await getPhotosHandler.handle({
      userId: user.id,
      page,
      limit,
    });

    return c.json(result, 200);
  } catch (error: any) {
    if (error.message.includes("Page must be") || error.message.includes("Limit must be")) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error getting photos:", error);
    return c.json(
      { error: "Failed to get photos", details: error?.message || String(error) },
      500
    );
  }
});

// GET /api/photos/:id - Get single photo
photoRoutes.get("/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const photoId = c.req.param("id");
    if (!photoId) {
      return c.json({ error: "Photo ID is required" }, 400);
    }

    const result = await getPhotoHandler.handle({
      photoId,
      userId: user.id,
    });

    return c.json(result, 200);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return c.json({ error: "Photo not found" }, 404);
    }
    if (error.message.includes("Unauthorized")) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    console.error("Error getting photo:", error);
    return c.json(
      { error: "Failed to get photo", details: error?.message || String(error) },
      500
    );
  }
});

// DELETE /api/photos/:id - Delete photo
photoRoutes.delete("/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const photoId = c.req.param("id");
    if (!photoId) {
      return c.json({ error: "Photo ID is required" }, 400);
    }

    // Verify photo exists and belongs to user
    const photo = await photoRepository.findById(photoId);
    if (!photo) {
      return c.json({ error: "Photo not found" }, 404);
    }
    if (photo.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    await photoRepository.delete(photoId);

    return c.json({ success: true }, 200);
  } catch (error: any) {
    console.error("Error deleting photo:", error);
    return c.json(
      { error: "Failed to delete photo", details: error?.message || String(error) },
      500
    );
  }
});

// PUT /api/photos/:id/tags - Update photo tags
photoRoutes.put("/:id/tags", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const photoId = c.req.param("id");
    if (!photoId) {
      return c.json({ error: "Photo ID is required" }, 400);
    }

    const body = await c.req.json();
    
    if (!body || typeof body !== "object") {
      return c.json({ error: "Request body must be an object" }, 400);
    }
    
    if (!body.tags || !Array.isArray(body.tags)) {
      return c.json({ error: "Tags must be an array" }, 400);
    }

    const result = await updatePhotoTagsHandler.handle({
      photoId,
      userId: user.id,
      tags: body.tags,
    });

    return c.json(result, 200);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return c.json({ error: "Photo not found" }, 404);
    }
    if (error.message.includes("Unauthorized")) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    if (
      error.message.includes("must be") ||
      error.message.includes("cannot") ||
      error.message.includes("Tags")
    ) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error updating photo tags:", error);
    return c.json(
      { error: "Failed to update photo tags", details: error?.message || String(error) },
      500
    );
  }
});

export default photoRoutes;

