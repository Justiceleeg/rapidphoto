import { Hono } from "hono";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { GetUploadJobHandler } from "../../../application/queries/get-upload-job/get-upload-job.handler.js";
import { UploadJobRepositoryImpl } from "../../database/repositories/upload-job.repository.impl.js";

const uploadJobRoutes = new Hono<{ Variables: Variables }>();

// Initialize services and handlers
const uploadJobRepository = new UploadJobRepositoryImpl();
const getUploadJobHandler = new GetUploadJobHandler(uploadJobRepository);

// GET /api/upload-jobs/:id - Get upload job by ID
uploadJobRoutes.get("/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const jobId = c.req.param("id");
    if (!jobId) {
      return c.json({ error: "Job ID is required" }, 400);
    }

    const result = await getUploadJobHandler.handle({
      jobId,
      userId: user.id,
    });

    return c.json(result, 200);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return c.json({ error: "Upload job not found" }, 404);
    }
    if (error.message.includes("Unauthorized")) {
      return c.json({ error: "Unauthorized" }, 403);
    }
    console.error("Error getting upload job:", error);
    return c.json(
      { error: "Failed to get upload job", details: error?.message || String(error) },
      500
    );
  }
});

export default uploadJobRoutes;

