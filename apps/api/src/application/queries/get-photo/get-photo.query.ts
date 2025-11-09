/**
 * Query to retrieve a single photo by ID
 */
export interface GetPhotoQuery {
  /** ID of the photo to retrieve */
  photoId: string;
  /** ID of the user who owns the photo */
  userId: string;
}

/**
 * Result of querying a single photo
 */
export interface GetPhotoResult {
  /** Photo ID */
  id: string;
  /** ID of the user who owns the photo */
  userId: string;
  /** Upload job ID (null for single uploads) */
  jobId: string | null;
  /** Original filename */
  filename: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type of the photo */
  mimeType: string;
  /** R2 storage key */
  r2Key: string;
  /** Presigned URL for viewing/downloading (temporary, expires in 1 hour, null if not completed) */
  url: string | null;
  /** Presigned URL for thumbnail (temporary, expires in 1 hour, null if no thumbnail) */
  thumbnailUrl: string | null;
  /** Current upload status */
  status: string;
  /** User-defined tags */
  tags: string[] | null;
  /** AI-generated tag suggestions (≥70% confidence) */
  suggestedTags: string[] | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

