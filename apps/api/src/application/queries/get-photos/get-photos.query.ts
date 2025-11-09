/**
 * Query to retrieve a paginated list of photos for a user
 */
export interface GetPhotosQuery {
  /** ID of the user whose photos to retrieve */
  userId: string;
  /** Page number (1-indexed, default: 1) */
  page?: number;
  /** Number of photos per page (default: 20, max: 100) */
  limit?: number;
  /** Array of tags to filter by (AND logic - photo must have all tags) */
  tags?: string[];
  /** Whether to include AI-suggested tags in search (default: false) */
  includeSuggested?: boolean;
}

/**
 * Result of querying photos
 */
export interface GetPhotosResult {
  /** Array of photos with presigned URLs */
  photos: Array<{
    /** Photo ID */
    id: string;
    /** Original filename */
    filename: string;
    /** Presigned URL for viewing/downloading (temporary, expires in 1 hour) */
    url: string | null;
    /** Current upload status */
    status: string;
    /** User-defined tags */
    tags: string[] | null;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
  }>;
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of photos per page */
    limit: number;
    /** Total number of photos */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}

