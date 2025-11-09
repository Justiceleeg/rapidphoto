/**
 * Script to clean up photos that reference R2 objects that no longer exist
 * 
 * Usage: pnpm tsx scripts/cleanup-orphaned-photos.ts
 */

// Load .env file first, before any other imports
import "../src/config/dotenv.js";

import { db } from "../src/infrastructure/database/connection.js";
import { photo } from "../src/infrastructure/database/schema.js";
import { eq } from "drizzle-orm";
import { R2Service } from "../src/infrastructure/storage/r2.service.js";

const r2Service = new R2Service();

async function cleanupOrphanedPhotos() {
  console.log("Starting cleanup of orphaned photos...");

  try {
    // Get all photos
    const allPhotos = await db.select().from(photo);
    console.log(`Found ${allPhotos.length} photos in database`);

    let deletedCount = 0;
    let keptCount = 0;

    for (const photoRecord of allPhotos) {
      if (!photoRecord.r2Key) {
        console.log(`Photo ${photoRecord.id} (${photoRecord.filename}) has no r2Key, deleting...`);
        await db.delete(photo).where(eq(photo.id, photoRecord.id));
        deletedCount++;
        continue;
      }

      // Check if R2 object exists
      const exists = await r2Service.objectExists(photoRecord.r2Key);
      if (!exists) {
        console.log(`Photo ${photoRecord.id} (${photoRecord.filename}) references missing R2 object (${photoRecord.r2Key}), deleting...`);
        await db.delete(photo).where(eq(photo.id, photoRecord.id));
        deletedCount++;
      } else {
        keptCount++;
      }
    }

    console.log(`\nCleanup complete:`);
    console.log(`  - Deleted: ${deletedCount} orphaned photos`);
    console.log(`  - Kept: ${keptCount} photos with valid R2 objects`);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

cleanupOrphanedPhotos()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

