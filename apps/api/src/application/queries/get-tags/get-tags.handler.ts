import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { GetTagsQuery, GetTagsResult } from "./get-tags.query.js";

/**
 * Handler for querying user tags with optional prefix filtering
 * Returns only user-confirmed tags (not AI-suggested tags)
 */
export class GetTagsHandler {
  /**
   * @param photoRepository - Repository for photo data access
   */
  constructor(private photoRepository: PhotoRepository) {}

  /**
   * Get distinct tags for a user with optional prefix filtering
   * Only returns tags from the user-confirmed tags array (not suggestedTags)
   * 
   * @param query - Query parameters for tag retrieval
   * @returns Array of distinct tags matching the prefix (if provided)
   */
  async handle(query: GetTagsQuery): Promise<GetTagsResult> {
    const tags = await this.photoRepository.findDistinctTagsByUserId(
      query.userId,
      query.prefix
    );

    return {
      tags,
    };
  }
}

