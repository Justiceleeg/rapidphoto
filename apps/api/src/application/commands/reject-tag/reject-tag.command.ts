/**
 * Command to reject an AI-suggested tag
 * Removes a tag from suggested_tags without adding to confirmed tags
 */
export interface RejectTagCommand {
  /** Photo ID */
  photoId: string;
  /** Tag to reject (must exist in suggested_tags) */
  tag: string;
  /** User ID (for authorization) */
  userId: string;
}

