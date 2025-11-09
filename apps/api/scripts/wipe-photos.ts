/**
 * Script to wipe all photos from the database
 * 
 * Usage: pnpm tsx scripts/wipe-photos.ts
 * 
 * WARNING: This will delete ALL photos from the database!
 */

// Load .env file first, before any other imports
import "../src/config/dotenv.js";

import { db } from "../src/infrastructure/database/connection.js";
import { photo } from "../src/infrastructure/database/schema.js";

async function wipePhotos() {
  console.log("⚠️  WARNING: This will delete ALL photos from the database!");
  console.log("Starting wipe of photo table...");

  try {
    // Delete all photos
    const result = await db.delete(photo);
    
    console.log(`\n✅ Successfully wiped all photos from the database`);
    console.log(`   Deleted all rows from the photo table`);
  } catch (error) {
    console.error("❌ Error during wipe:", error);
    process.exit(1);
  }
}

wipePhotos()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

