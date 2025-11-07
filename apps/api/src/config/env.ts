export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  authSecret: process.env.BETTER_AUTH_SECRET || "",
  authUrl: process.env.BETTER_AUTH_URL || "http://localhost:4000",
} as const;

// Validate required environment variables
if (process.env.NODE_ENV !== "test" && !env.databaseUrl) {
  console.warn("Warning: DATABASE_URL is not set");
}
if (process.env.NODE_ENV !== "test" && !env.authSecret) {
  console.warn("Warning: BETTER_AUTH_SECRET is not set");
}
