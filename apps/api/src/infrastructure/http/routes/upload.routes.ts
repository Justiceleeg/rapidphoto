import { Hono } from "hono";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { InitUploadHandler } from "../../../application/commands/init-upload/init-upload.handler.js";
import { CompletePhotoHandler } from "../../../application/commands/complete-photo/complete-photo.handler.js";
import { PhotoRepositoryImpl } from "../../database/repositories/photo.repository.impl.js";
import { R2Service } from "../../storage/r2.service.js";

const uploadRoutes = new Hono<{ Variables: Variables }>();

// Initialize services and handlers
const photoRepository = new PhotoRepositoryImpl();
const r2Service = new R2Service();
const initUploadHandler = new InitUploadHandler(photoRepository, r2Service);
const completePhotoHandler = new CompletePhotoHandler(
  photoRepository,
  r2Service
);

// POST /api/upload/init - Initialize photo upload
uploadRoutes.post("/init", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { filename, fileSize, mimeType } = body;

    // Validate required fields
    if (!filename || !fileSize || !mimeType) {
      return c.json(
        { error: "Missing required fields: filename, fileSize, mimeType" },
        400
      );
    }

    const result = await initUploadHandler.handle({
      userId: user.id,
      filename,
      fileSize: Number(fileSize),
      mimeType,
    });

    return c.json(result, 201);
  } catch (error) {
    console.error("Error initializing upload:", error);
    return c.json(
      { error: "Failed to initialize upload" },
      500
    );
  }
});

// Export complete handler separately for mounting at /api/photos
export const completePhotoRoute = new Hono<{ Variables: Variables }>();

completePhotoRoute.post("/:id/complete", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const photoId = c.req.param("id");
    if (!photoId) {
      return c.json({ error: "Photo ID is required" }, 400);
    }

    await completePhotoHandler.handle({
      photoId,
      userId: user.id,
    });

    return c.json({ success: true }, 200);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return c.json({ error: "Photo not found" }, 404);
    }
    if (error.message.includes("Unauthorized")) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    console.error("Error completing upload:", error);
    return c.json(
      { error: "Failed to complete upload" },
      500
    );
  }
});

export default uploadRoutes;

