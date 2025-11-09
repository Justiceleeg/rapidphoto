/**
 * Query to retrieve an upload job by ID
 */
export interface GetUploadJobQuery {
  /** ID of the upload job to retrieve */
  jobId: string;
  /** ID of the user who owns the upload job */
  userId: string;
}

/**
 * Result of querying an upload job
 */
export interface GetUploadJobResult {
  /** Upload job ID */
  id: string;
  /** ID of the user who owns the job */
  userId: string;
  /** Total number of photos in the batch */
  totalPhotos: number;
  /** Number of successfully completed photos */
  completedPhotos: number;
  /** Number of failed photos */
  failedPhotos: number;
  /** Current job status */
  status: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

