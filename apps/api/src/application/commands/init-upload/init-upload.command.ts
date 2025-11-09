/**
 * Photo metadata for upload initialization
 */
export interface PhotoMetadata {
  /** Original filename of the photo */
  filename: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type of the photo (e.g., "image/jpeg") */
  mimeType: string;
}

/**
 * Command to initialize a photo upload (single or batch)
 */
export interface InitUploadCommand {
  /** ID of the user uploading the photo(s) */
  userId: string;
  /** Single photo metadata or array of photo metadata (up to 100) */
  photos: PhotoMetadata | PhotoMetadata[];
}

/**
 * Result of upload initialization
 */
export interface InitUploadResult {
  /** Upload job ID (for batch uploads) */
  jobId?: string;
  /** Photo ID (for single uploads) */
  photoId?: string;
  /** Array of photo IDs (for batch uploads) */
  photoIds?: string[];
  /** Presigned URL for single photo upload */
  presignedUrl?: string;
  /** Array of presigned URLs with photo IDs (for batch uploads) */
  presignedUrls?: Array<{
    photoId: string;
    presignedUrl: string;
    r2Key: string;
  }>;
  /** R2 storage key (for single uploads) */
  r2Key?: string;
}

