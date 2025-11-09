import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env.js";

/**
 * Service for interacting with Cloudflare R2 storage
 * Provides methods for generating presigned URLs for upload and download
 */
export class R2Service {
  private client: S3Client;

  /**
   * Initialize R2 service with S3-compatible client
   */
  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }

  /**
   * Generate a presigned URL for direct client upload to R2
   * @param key The R2 object key (path)
   * @param contentType The MIME type of the file
   * @param expiresIn Expiration time in seconds (default: 1 hour)
   * @returns Presigned URL for PUT request
   */
  async generatePresignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    return url;
  }

  /**
   * Generate a presigned URL for viewing/downloading an object from R2
   * This allows temporary, secure access to private R2 objects without making the bucket public.
   * @param key The R2 object key (path)
   * @param expiresIn Expiration time in seconds (default: 1 hour)
   * @returns Presigned URL for GET request
   */
  async generatePresignedGetUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    return url;
  }

  /**
   * Get the public URL for an R2 object (if bucket is configured for public access)
   * @param key The R2 object key
   * @returns Public URL if configured, otherwise returns null
   * @deprecated Use generatePresignedGetUrl() for secure, temporary access instead
   */
  getObjectUrl(key: string): string | null {
    if (!env.r2.publicUrl) {
      return null;
    }
    return `${env.r2.publicUrl}/${key}`;
  }
}

