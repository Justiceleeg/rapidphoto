/**
 * Test R2 bucket utilities
 * Provides functions to upload, verify, and cleanup test files in R2
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface TestR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export interface TestR2 {
  client: S3Client;
  bucketName: string;
  uploadFile: (key: string, content: Buffer | string, contentType?: string) => Promise<void>;
  verifyFileExists: (key: string) => Promise<boolean>;
  deleteFile: (key: string) => Promise<void>;
  cleanup: () => Promise<void>;
}

/**
 * Create a test R2 client and utilities
 * @param config R2 configuration
 * @returns Test R2 instance with utilities
 */
export function setupTestR2(config: TestR2Config): TestR2 {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  /**
   * Upload a file to R2
   */
  async function uploadFile(
    key: string,
    content: Buffer | string,
    contentType: string = "application/octet-stream"
  ): Promise<void> {
    const buffer = typeof content === "string" ? Buffer.from(content) : content;
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await client.send(command);
  }

  /**
   * Verify a file exists in R2
   */
  async function verifyFileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      });
      await client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Delete a file from R2
   */
  async function deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });
    await client.send(command);
  }

  /**
   * Cleanup all test files from R2
   * This will delete all objects with keys starting with "test/"
   */
  async function cleanup(): Promise<void> {
    const testPrefix = "test/";
    let continuationToken: string | undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: testPrefix,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(listCommand);

      if (response.Contents && response.Contents.length > 0) {
        const deletePromises = response.Contents.map((object) => {
          if (object.Key) {
            return deleteFile(object.Key);
          }
        }).filter(Boolean);

        await Promise.all(deletePromises);
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  }

  return {
    client,
    bucketName: config.bucketName,
    uploadFile,
    verifyFileExists,
    deleteFile,
    cleanup,
  };
}

/**
 * Upload a file to R2 using a presigned URL
 * @param presignedUrl The presigned URL from the API
 * @param content File content as Buffer or string
 * @param contentType MIME type of the file
 */
export async function uploadToPresignedUrl(
  presignedUrl: string,
  content: Buffer | string,
  contentType: string = "image/jpeg"
): Promise<Response> {
  const buffer = typeof content === "string" ? Buffer.from(content) : content;
  
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload to presigned URL: ${response.status} ${response.statusText}`
    );
  }

  return response;
}

