export interface ProgressEvent {
  jobId: string;
  completedPhotos: number;
  failedPhotos: number;
  totalPhotos: number;
  status: "pending" | "in-progress" | "completed" | "failed";
}

type ProgressSubscriber = (event: ProgressEvent) => void;

export class ProgressService {
  private subscribers: Map<string, Set<ProgressSubscriber>> = new Map();

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

