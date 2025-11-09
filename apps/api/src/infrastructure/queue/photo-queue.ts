/**
 * Photo Processing Queue
 * 
 * Queue for photo-related asynchronous tasks like thumbnail generation.
 */

import { Queue } from 'bullmq';
import { defaultQueueOptions, QueueNames } from './queue.config.js';

/**
 * Job data for thumbnail generation
 */
export interface ThumbnailGenerationJobData {
  photoId: string;
  r2Key: string;
  userId: string;
}

/**
 * Photo processing job types
 */
export type PhotoProcessingJobData = ThumbnailGenerationJobData;

/**
 * Photo processing queue instance
 */
export const photoQueue = new Queue<PhotoProcessingJobData>(
  QueueNames.PHOTO_PROCESSING,
  defaultQueueOptions
);

/**
 * Add a thumbnail generation job to the queue
 */
export async function queueThumbnailGeneration(
  data: ThumbnailGenerationJobData
): Promise<void> {
  await photoQueue.add('generate-thumbnail', data, {
    jobId: `thumbnail-${data.photoId}`, // Prevent duplicate jobs
  });
}

/**
 * Close the queue connection (for graceful shutdown)
 */
export async function closePhotoQueue(): Promise<void> {
  await photoQueue.close();
}

