/**
 * Progress event for upload job status updates
 */
export interface ProgressEvent {
  /** Upload job ID */
  jobId: string;
  /** Number of completed photos */
  completedPhotos: number;
  /** Number of failed photos */
  failedPhotos: number;
  /** Total number of photos in the batch */
  totalPhotos: number;
  /** Current job status */
  status: "pending" | "in-progress" | "completed" | "failed";
}

/**
 * Function type for progress event subscribers
 */
type ProgressSubscriber = (event: ProgressEvent) => void;

/**
 * Service for managing upload progress events via Server-Sent Events (SSE)
 * Implements pub/sub pattern for real-time progress updates
 */
export class ProgressService {
  private subscribers: Map<string, Set<ProgressSubscriber>> = new Map();

  /**
   * Subscribe to progress events for an upload job
   * @param jobId - Upload job ID to subscribe to
   * @param subscriber - Callback function to receive progress events
   * @returns Unsubscribe function to remove the subscriber
   */
  subscribe(jobId: string, subscriber: ProgressSubscriber): () => void {
    if (!this.subscribers.has(jobId)) {
      this.subscribers.set(jobId, new Set());
    }
    this.subscribers.get(jobId)!.add(subscriber);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(jobId);
      if (subscribers) {
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
          this.subscribers.delete(jobId);
        }
      }
    };
  }

  /**
   * Publish a progress event to all subscribers for the job
   * @param event - Progress event to publish
   */
  publish(event: ProgressEvent): void {
    const subscribers = this.subscribers.get(event.jobId);
    if (subscribers) {
      subscribers.forEach((subscriber) => {
        try {
          subscriber(event);
        } catch (error) {
          console.error("Error publishing progress event:", error);
        }
      });
    }
  }
}

