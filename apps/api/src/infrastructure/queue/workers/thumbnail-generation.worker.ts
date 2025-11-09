/**
 * Thumbnail Generation Worker
 * 
 * Worker that processes thumbnail generation jobs for uploaded photos.
 * Downloads photos from R2, generates thumbnails using Sharp, and uploads back to R2.
 */

import { Job } from 'bullmq';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { BaseWorker } from './base.worker.js';
import { ThumbnailGenerationJobData } from '../photo-queue.js';
import { QueueNames } from '../queue.config.js';
import { env } from '../../../config/env.js';
import { db } from '../../database/connection.js';
import { photo as photoTable } from '../../database/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Thumbnail generation worker
 */
export class ThumbnailGenerationWorker extends BaseWorker<ThumbnailGenerationJobData> {
  private s3Client: S3Client;

  constructor() {
    super(QueueNames.PHOTO_PROCESSING);
    
    // Initialize S3 client for R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }

  /**
   * Process a thumbnail generation job
   */
  protected async process(job: Job<ThumbnailGenerationJobData>): Promise<void> {
    const { photoId, r2Key, userId } = job.data;

    console.log(`[ThumbnailWorker] Processing thumbnail for photo ${photoId}`);

    try {
      // 1. Download the photo from R2
      const photoBuffer = await this.downloadFromR2(r2Key);
      console.log(`[ThumbnailWorker] Downloaded photo ${r2Key} from R2`);

      // 2. Generate thumbnail using Sharp
      const thumbnailBuffer = await this.generateThumbnail(photoBuffer);
      console.log(`[ThumbnailWorker] Generated thumbnail for photo ${photoId}`);

      // 3. Generate thumbnail key (same path as photo but in thumbnails/ folder)
      const thumbnailKey = this.generateThumbnailKey(r2Key);

      // 4. Upload thumbnail to R2
      await this.uploadToR2(thumbnailKey, thumbnailBuffer, 'image/jpeg');
      console.log(`[ThumbnailWorker] Uploaded thumbnail ${thumbnailKey} to R2`);

      // 5. Update photo record with thumbnail key
      await db
        .update(photoTable)
        .set({ thumbnailKey })
        .where(eq(photoTable.id, photoId));
      
      console.log(`[ThumbnailWorker] Updated photo ${photoId} with thumbnail key`);
    } catch (error) {
      console.error(`[ThumbnailWorker] Failed to generate thumbnail for photo ${photoId}:`, error);
      throw error; // Re-throw to trigger retry logic
    }
  }

  /**
   * Download an object from R2
   */
  private async downloadFromR2(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    
    if (!response.Body) {
      throw new Error(`No body in R2 response for key: ${key}`);
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }

  /**
   * Generate thumbnail from image buffer
   * Resizes to 300x300 with cover fit, optimizes quality
   */
  private async generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();
  }

  /**
   * Upload an object to R2
   */
  private async uploadToR2(
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: env.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
  }

  /**
   * Generate thumbnail key from original photo key
   * Example: "users/abc123/photo.jpg" -> "users/abc123/thumbnails/photo.jpg"
   */
  private generateThumbnailKey(originalKey: string): string {
    const parts = originalKey.split('/');
    const filename = parts.pop() || 'thumbnail.jpg';
    return `${parts.join('/')}/thumbnails/${filename}`;
  }
}

