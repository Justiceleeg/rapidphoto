/**
 * Worker Registry
 * 
 * Central place to initialize and manage all workers.
 */

import { ThumbnailGenerationWorker } from './thumbnail-generation.worker.js';

let thumbnailWorker: ThumbnailGenerationWorker | null = null;

/**
 * Initialize all workers
 */
export function initializeWorkers(): void {
  console.log('[Workers] Initializing workers...');
  
  thumbnailWorker = new ThumbnailGenerationWorker();
  
  console.log('[Workers] All workers initialized successfully');
}

/**
 * Close all workers gracefully
 */
export async function closeWorkers(): Promise<void> {
  console.log('[Workers] Closing workers...');
  
  if (thumbnailWorker) {
    await thumbnailWorker.close();
  }
  
  console.log('[Workers] All workers closed successfully');
}

/**
 * Get the thumbnail generation worker instance
 */
export function getThumbnailWorker(): ThumbnailGenerationWorker | null {
  return thumbnailWorker;
}

