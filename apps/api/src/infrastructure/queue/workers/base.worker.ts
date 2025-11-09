/**
 * Base Worker
 * 
 * Abstract base class for BullMQ workers with common error handling and logging.
 */

import { Worker, Job, WorkerOptions } from 'bullmq';
import { defaultWorkerOptions, QueueName } from '../queue.config.js';

export abstract class BaseWorker<T = unknown> {
  protected worker: Worker<T>;
  protected queueName: QueueName;

  constructor(queueName: QueueName, options: Partial<WorkerOptions> = {}) {
    this.queueName = queueName;
    
    this.worker = new Worker<T>(
      queueName,
      async (job) => this.process(job),
      {
        ...defaultWorkerOptions,
        ...options,
      }
    );

    this.setupEventHandlers();
  }

  /**
   * Process a job - to be implemented by subclasses
   */
  protected abstract process(job: Job<T>): Promise<void>;

  /**
   * Setup event handlers for the worker
   */
  private setupEventHandlers(): void {
    this.worker.on('completed', (job) => {
      console.log(`[${this.queueName}] Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(
        `[${this.queueName}] Job ${job?.id} failed with error:`,
        err.message
      );
      console.error('Error stack:', err.stack);
    });

    this.worker.on('error', (err) => {
      console.error(`[${this.queueName}] Worker error:`, err);
    });

    this.worker.on('ready', () => {
      console.log(`[${this.queueName}] Worker is ready and waiting for jobs`);
    });
  }

  /**
   * Close the worker connection (for graceful shutdown)
   */
  public async close(): Promise<void> {
    await this.worker.close();
  }

  /**
   * Get the worker instance
   */
  public getWorker(): Worker<T> {
    return this.worker;
  }
}

