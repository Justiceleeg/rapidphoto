/**
 * Vitest setup file
 * Configures test environment variables and global test setup
 */

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
// Try to load .env.test first, but fall back to .env
// Tests can use the same R2 bucket as production (with test/ prefix for isolation)
const envPath = resolve(__dirname, "../../.env.test");
const testEnvLoaded = config({ path: envPath });

// Always load regular .env (tests can use same R2 bucket, just with test/ prefix)
const fallbackEnvPath = resolve(__dirname, "../../.env");
config({ path: fallbackEnvPath, override: !testEnvLoaded.parsed });

// Set NODE_ENV to test if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

// Ensure test database URL is set
if (!process.env.DATABASE_URL) {
  console.warn(
    "Warning: DATABASE_URL not set. Tests may fail. Set DATABASE_URL in .env.test"
  );
}

// Ensure test R2 configuration is set (can use same bucket as production)
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
  console.warn(
    "Warning: R2 configuration not set. R2 tests may fail. Set R2_* variables in .env or .env.test"
  );
} else {
  console.log("✓ R2 configuration loaded - tests will use bucket:", process.env.R2_BUCKET_NAME);
  console.log("  Test files will be prefixed with 'test/' and cleaned up after tests");
}

