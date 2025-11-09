/**
 * Command to accept an AI-suggested tag
 * Moves a tag from suggested_tags to the user's confirmed tags
 */
export interface AcceptTagCommand {
  /** Photo ID */
  photoId: string;
  /** Tag to accept (must exist in suggested_tags) */
  tag: string;
  /** User ID (for authorization) */
  userId: string;
}

