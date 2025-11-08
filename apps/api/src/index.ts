// Load .env file first, before any other imports
import "./config/dotenv.js";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { env } from "./config/env.js";
import authRoutes from "./infrastructure/http/routes/auth.routes.js";
import uploadRoutes, { completePhotoRoute } from "./infrastructure/http/routes/upload.routes.js";
import { authMiddleware } from "./infrastructure/auth/auth.middleware.js";
import { auth } from "./infrastructure/auth/better-auth.js";

export type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{ Variables: Variables }>();

// CORS middleware
app.use(
  "*",
  cors({
    origin: env.allowedOrigins,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Mount auth routes
app.route("/api/auth", authRoutes);

// Mount upload routes
app.route("/api/upload", uploadRoutes);

// Mount photo complete route
app.route("/api/photos", completePhotoRoute);

// Protected route example
app.get("/api/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  return c.json({ user, session });
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
