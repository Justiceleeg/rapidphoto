/**
 * AI Tagging Worker
 * 
 * Processes photos to generate AI-powered tag suggestions using AWS Rekognition.
 * Downloads the photo from R2, analyzes it with Rekognition DetectLabels API,
 * filters labels with >= 70% confidence, and stores them in the suggested_tags field.
 */

import { Job } from 'bullmq';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BaseWorker } from './base.worker.js';
import { AITaggingJobData } from '../photo-queue.js';
import { QueueNames } from '../queue.config.js';
import { RekognitionService } from '../../ai/rekognition.service.js';
import { env } from '../../../config/env.js';
import { db } from '../../database/connection.js';
import { photo as photoTable } from '../../database/schema.js';
import { eq } from 'drizzle-orm';

export class AITaggingWorker extends BaseWorker<AITaggingJobData> {
  private s3Client: S3Client;
  private rekognitionService: RekognitionService;

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
    
    this.rekognitionService = new RekognitionService();
  }

  /**
   * Process an AI tagging job
   */
  protected async process(job: Job<AITaggingJobData>): Promise<void> {
    const { photoId, r2Key, userId } = job.data;

    console.log(`[AITaggingWorker] Starting AI tagging for photo ${photoId}`);

    try {
      // Step 1: Download the original photo from R2
      console.log(`[AITaggingWorker] Downloading photo from R2: ${r2Key}`);
      const imageBuffer = await this.downloadFromR2(r2Key);

      // Step 2: Analyze image with AWS Rekognition
      console.log(`[AITaggingWorker] Analyzing image with AWS Rekognition`);
      const suggestedTags = await this.rekognitionService.detectLabels(imageBuffer);

      console.log(`[AITaggingWorker] Detected ${suggestedTags.length} tags with ≥70% confidence:`, suggestedTags);

      // Step 3: Update photo record with suggested tags
      await db
        .update(photoTable)
        .set({ suggestedTags: suggestedTags.length > 0 ? suggestedTags : null })
        .where(eq(photoTable.id, photoId));

      console.log(`[AITaggingWorker] Successfully generated AI tags for photo ${photoId}`);
    } catch (error) {
      console.error(`[AITaggingWorker] Failed to generate AI tags for photo ${photoId}:`, error);
      throw error; // Re-throw to trigger BullMQ retry logic
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

  async close(): Promise<void> {
    await super.close();
    await this.rekognitionService.close();
  }
}

