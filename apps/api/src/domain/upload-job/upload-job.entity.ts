/**
 * Upload job status
 */
export type UploadJobStatus = "pending" | "in-progress" | "completed" | "failed";

/**
 * Upload job entity representing a batch photo upload
 */
export interface UploadJob {
  /** Unique upload job identifier */
  id: string;
  /** ID of the user who owns the upload job */
  userId: string;
  /** Total number of photos in the batch */
  totalPhotos: number;
  /** Number of successfully completed photos */
  completedPhotos: number;
  /** Number of failed photos */
  failedPhotos: number;
  /** Current job status */
  status: UploadJobStatus;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

