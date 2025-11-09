import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import type { Variables } from "../../../index.js";
import { authMiddleware } from "../../auth/auth.middleware.js";
import { UploadJobRepositoryImpl } from "../../database/repositories/upload-job.repository.impl.js";
import { progressService } from "../../sse/progress.service.instance.js";

/**
 * SSE routes for real-time progress updates
 * Handles Server-Sent Events for upload progress tracking
 */
const sseRoutes = new Hono<{ Variables: Variables }>();

// Initialize services
const uploadJobRepository = new UploadJobRepositoryImpl();

/**
 * GET /api/upload-progress/:jobId
 * SSE endpoint for upload progress
 * Streams real-time progress events for batch uploads
 * Automatically closes connection when job is completed or failed
 */
sseRoutes.get("/upload-progress/:jobId", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const jobId = c.req.param("jobId");
    if (!jobId) {
      return c.json({ error: "Job ID is required" }, 400);
    }

    // Verify job exists and belongs to user
    const job = await uploadJobRepository.findById(jobId);
    if (!job) {
      return c.json({ error: "Upload job not found" }, 404);
    }

    if (job.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    return streamSSE(c, async (stream) => {
      let unsubscribe: (() => void) | null = null;
      let keepAliveInterval: NodeJS.Timeout | null = null;

      // Clean up on abort
      stream.onAbort(() => {
        if (unsubscribe) {
          unsubscribe();
        }
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
        }
      });

      // Send initial state
      await stream.writeSSE({
        data: JSON.stringify({
          jobId: job.id,
          completedPhotos: job.completedPhotos,
          failedPhotos: job.failedPhotos,
          totalPhotos: job.totalPhotos,
          status: job.status,
        }),
      });

      // Subscribe to progress updates
      unsubscribe = progressService.subscribe(jobId, async (event) => {
        await stream.writeSSE({
          data: JSON.stringify(event),
        });
      });

      // Keep connection alive with periodic pings
      keepAliveInterval = setInterval(async () => {
        await stream.writeSSE({
          data: JSON.stringify({ type: "ping" }),
        });
      }, 30000); // Send ping every 30 seconds
    });
  } catch (error: any) {
    console.error("Error setting up SSE:", error);
    return c.json({ error: "Failed to set up progress stream" }, 500);
  }
});

export default sseRoutes;

