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

// POST /api/upload/init - Initialize photo upload (single or batch)
uploadRoutes.post("/init", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    
    // Support both single photo and array of photos
    const photos = Array.isArray(body) ? body : [body];
    
    // Validate required fields for each photo
    for (const photo of photos) {
      if (!photo.filename || !photo.fileSize || !photo.mimeType) {
        return c.json(
          { error: "Missing required fields: filename, fileSize, mimeType" },
          400
        );
      }
    }

    const result = await initUploadHandler.handle({
      userId: user.id,
      photos: photos.map((p) => ({
        filename: p.filename,
        fileSize: Number(p.fileSize),
        mimeType: p.mimeType,
      })),
    });

    return c.json(result, 201);
  } catch (error: any) {
    console.error("Error initializing upload:", error);
    const errorMessage = error?.message || String(error);
    return c.json(
      { error: "Failed to initialize upload", details: errorMessage },
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

// POST /api/photos/:id/failed - Report failed photo upload
completePhotoRoute.post("/:id/failed", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const photoId = c.req.param("id");
    if (!photoId) {
      return c.json({ error: "Photo ID is required" }, 400);
    }

    await failPhotoHandler.handle({
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
    console.error("Error reporting failed upload:", error);
    return c.json(
      { error: "Failed to report failed upload" },
      500
    );
  }
});

export default uploadRoutes;

