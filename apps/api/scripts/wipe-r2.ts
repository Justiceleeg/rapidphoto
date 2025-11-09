/**
 * Script to wipe all objects from the Cloudflare R2 bucket
 * 
 * Usage: pnpm tsx scripts/wipe-r2.ts
 * 
 * WARNING: This will delete ALL objects from the R2 bucket!
 */

// Load .env file first, before any other imports
import "../src/config/dotenv.js";

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { env } from "../src/config/env.js";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2.accessKeyId,
    secretAccessKey: env.r2.secretAccessKey,
  },
});

async function wipeR2() {
  console.log("⚠️  WARNING: This will delete ALL objects from the R2 bucket!");
  console.log(`Bucket: ${env.r2.bucketName}`);
  console.log("Starting wipe of R2 bucket...\n");

  try {
    let totalDeleted = 0;
    let continuationToken: string | undefined;

    do {
      // List objects in the bucket
      const listCommand = new ListObjectsV2Command({
        Bucket: env.r2.bucketName,
        ContinuationToken: continuationToken,
      });

      const listResponse = await client.send(listCommand);
      const objects = listResponse.Contents || [];

      if (objects.length === 0) {
        if (totalDeleted === 0) {
          console.log("✅ Bucket is already empty");
        }
        break;
      }

      // Delete objects in batches (max 1000 per request)
      const keysToDelete = objects.map((obj) => ({ Key: obj.Key! }));
      
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: env.r2.bucketName,
        Delete: {
          Objects: keysToDelete,
          Quiet: false,
        },
      });

      const deleteResponse = await client.send(deleteCommand);
      const deleted = deleteResponse.Deleted || [];
      const errors = deleteResponse.Errors || [];

      totalDeleted += deleted.length;

      if (deleted.length > 0) {
        console.log(`✅ Deleted ${deleted.length} objects (total: ${totalDeleted})`);
      }

      if (errors.length > 0) {
        console.error(`❌ Errors deleting ${errors.length} objects:`);
        errors.forEach((error) => {
          console.error(`   - ${error.Key}: ${error.Message}`);
        });
      }

      // Check if there are more objects to list
      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log(`\n✅ Successfully wiped R2 bucket`);
    console.log(`   Total objects deleted: ${totalDeleted}`);
  } catch (error) {
    console.error("❌ Error during wipe:", error);
    process.exit(1);
  }
}

wipeR2()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

