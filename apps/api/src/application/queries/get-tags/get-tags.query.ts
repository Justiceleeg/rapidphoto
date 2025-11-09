/**
 * Query to retrieve distinct tags for a user
 */
export interface GetTagsQuery {
  /** ID of the user whose tags to retrieve */
  userId: string;
  /** Optional prefix to filter tags by (case-insensitive) */
  prefix?: string;
}

/**
 * Result of querying tags
 */
export interface GetTagsResult {
  /** Array of distinct tags */
  tags: string[];
}

