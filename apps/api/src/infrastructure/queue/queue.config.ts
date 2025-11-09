/**
 * Queue Configuration
 * 
 * Centralized configuration for BullMQ queues and workers.
 */

import { QueueOptions, WorkerOptions } from 'bullmq';
import { env } from '../../config/env.js';

/**
 * Base connection configuration for Redis
 */
export const redisConnection = {
  url: env.redisUrl,
  maxRetriesPerRequest: null, // Required for BullMQ
};

/**
 * Default queue options
 */
export const defaultQueueOptions: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
};

/**
 * Default worker options
 */
export const defaultWorkerOptions: WorkerOptions = {
  connection: redisConnection,
  concurrency: 5,
  autorun: true,
};

/**
 * Queue names
 */
export const QueueNames = {
  PHOTO_PROCESSING: 'photo-processing',
} as const;

export type QueueName = typeof QueueNames[keyof typeof QueueNames];

