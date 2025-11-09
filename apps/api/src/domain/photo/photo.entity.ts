/**
 * Photo upload status
 */
export type PhotoStatus = "pending" | "completed" | "failed";

/**
 * Photo entity representing a user's uploaded photo
 */
export interface Photo {
  /** Unique photo identifier */
  id: string;
  /** ID of the user who owns the photo */
  userId: string;
  /** Upload job ID (null for single photo uploads) */
  jobId: string | null;
  /** Original filename of the photo */
  filename: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type of the photo (e.g., "image/jpeg") */
  mimeType: string;
  /** R2 storage key (path in R2 bucket) */
  r2Key: string;
  /** R2 public URL (null if not set) */
  r2Url: string | null;
  /** Current upload status */
  status: PhotoStatus;
  /** User-defined tags (normalized: lowercase, trimmed, deduplicated) */
  tags: string[] | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

