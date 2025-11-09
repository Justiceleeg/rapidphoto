// Load .env file first, before any other imports
import "./config/dotenv.js";

import { serve } from "@hono/node-server";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: env.port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
