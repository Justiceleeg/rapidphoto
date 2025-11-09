/**
 * Script to empty all objects from R2 bucket
 * 
 * Usage:
 * 1. Install dependencies: npm install -D @cloudflare/workers-types
 * 2. Set environment variables (or use .env):
 *    - R2_ACCOUNT_ID
 *    - R2_ACCESS_KEY_ID
 *    - R2_SECRET_ACCESS_KEY
 *    - R2_BUCKET_NAME
 * 3. Run with .env file from apps/api directory:
 *    DOTENV_CONFIG_PATH=apps/api/.env npx tsx -r dotenv/config scripts/empty-r2-bucket.ts
 */

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error('❌ Missing required environment variables:');
  console.error('  - R2_ACCOUNT_ID');
  console.error('  - R2_ACCESS_KEY_ID');
  console.error('  - R2_SECRET_ACCESS_KEY');
  console.error('  - R2_BUCKET_NAME');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function emptyBucket() {
  console.log(`🗑️  Emptying R2 bucket: ${bucketName}`);
  
  let totalDeleted = 0;
  let continuationToken: string | undefined;

  do {
    // List objects
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
      MaxKeys: 1000, // Max per request
    });

    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log('✅ No more objects to delete');
      break;
    }

    console.log(`📦 Found ${listResponse.Contents.length} objects to delete...`);

    // Delete objects in batch
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key })),
        Quiet: false,
      },
    });

    const deleteResponse = await s3Client.send(deleteCommand);
    
    const deletedCount = deleteResponse.Deleted?.length || 0;
    totalDeleted += deletedCount;
    
    console.log(`✅ Deleted ${deletedCount} objects (total: ${totalDeleted})`);

    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
      console.error('❌ Errors during deletion:');
      deleteResponse.Errors.forEach((error) => {
        console.error(`  - ${error.Key}: ${error.Message}`);
      });
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);

  console.log(`\n🎉 Done! Deleted ${totalDeleted} objects from ${bucketName}`);
}

emptyBucket().catch((error) => {
  console.error('❌ Error emptying bucket:', error);
  process.exit(1);
});

