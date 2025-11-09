/**
 * Test database setup utilities
 * Provides functions to setup/teardown test database with migrations
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { readdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as schema from "../../src/infrastructure/database/schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TestDatabase {
  db: ReturnType<typeof drizzle>;
  client: postgres.Sql;
  cleanup: () => Promise<void>;
}

/**
 * Create a test database connection and run migrations
 * @param databaseUrl Database connection URL
 * @returns Test database instance with db connection and cleanup function
 */
export async function setupTestDatabase(
  databaseUrl: string
): Promise<TestDatabase> {
  const client = postgres(databaseUrl);
  const db = drizzle(client, { schema });

  // Run migrations
  const migrationsPath = join(
    __dirname,
    "../../src/infrastructure/database/migrations"
  );

  try {
    await migrate(db, { migrationsFolder: migrationsPath });
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }

  return {
    db,
    client,
    cleanup: async () => {
      await client.end();
    },
  };
}

/**
 * Clean up all tables in the test database
 * This will delete all data from all tables
 * Uses CASCADE-safe ordering to avoid foreign key constraint violations
 */
export async function cleanupTestDatabase(
  db: ReturnType<typeof drizzle>
): Promise<void> {
  // Delete in reverse order of dependencies to avoid foreign key violations
  const { photo, uploadJob, session, account, verification, user } = schema;

  try {
    // Delete child records first
    await db.delete(photo);
    await db.delete(uploadJob);
    
    // Delete auth-related records (dependent on user)
    await db.delete(session);
    await db.delete(account);
    await db.delete(verification);
    
    // Finally delete users (no dependencies should remain)
    await db.delete(user);
  } catch (error) {
    // If cleanup fails, log it but don't throw - tests need to continue
    console.warn("Warning: Database cleanup encountered an error:", error);
  }
}

