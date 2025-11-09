/**
 * Command to update photo tags
 */
export interface UpdatePhotoTagsCommand {
  /** ID of the photo to update */
  photoId: string;
  /** ID of the user who owns the photo */
  userId: string;
  /** Array of tags to set (max 20 tags, each max 50 characters) */
  tags: string[];
}

/**
 * Result of updating photo tags
 */
export interface UpdatePhotoTagsResult {
  /** Photo ID */
  id: string;
  /** Original filename */
  filename: string;
  /** Current upload status */
  status: string;
  /** Updated tags array (normalized: lowercase, trimmed, deduplicated) */
  tags: string[] | null;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

