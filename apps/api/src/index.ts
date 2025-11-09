// Load .env file first, before any other imports
import "./config/dotenv.js";

import { serve } from "@hono/node-server";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { initializeWorkers, closeWorkers } from "./infrastructure/queue/workers/index.js";
import { closePhotoQueue } from "./infrastructure/queue/photo-queue.js";

// Export Variables type for use in routes
export type { Variables } from "./app.js";

const app = createApp();

// Initialize workers (job queue processors)
initializeWorkers();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeWorkers();
  await closePhotoQueue();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await closeWorkers();
  await closePhotoQueue();
  process.exit(0);
});

serve(
  {
    fetch: app.fetch,
    port: env.port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
