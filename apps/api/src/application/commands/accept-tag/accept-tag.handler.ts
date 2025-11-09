import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { createNotFoundError, createForbiddenError, AppError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { AcceptTagCommand } from "./accept-tag.command.js";

/**
 * Handler for accepting AI-suggested tags
 * Moves a tag from suggested_tags to the user's confirmed tags array
 */
export class AcceptTagHandler {
  constructor(private photoRepository: PhotoRepository) {}

  /**
   * Accept an AI-suggested tag
   * - Validates the photo exists and belongs to the user
   * - Validates the tag exists in suggested_tags
   * - Moves the tag from suggested_tags to tags
   * - Normalizes tags (lowercase, deduplicated)
   */
  async handle(command: AcceptTagCommand): Promise<void> {
    const { photoId, tag, userId } = command;

    // Normalize tag (lowercase, trim)
    const normalizedTag = tag.trim().toLowerCase();

    if (!normalizedTag) {
      throw new AppError(400, "Tag cannot be empty", "VALIDATION_ERROR");
    }

    // Find photo
    const photo = await this.photoRepository.findById(photoId);

    if (!photo) {
      throw createNotFoundError("Photo", photoId);
    }

    // Verify photo belongs to user
    if (photo.userId !== userId) {
      throw createForbiddenError("Photo does not belong to user");
    }

    // Verify tag exists in suggested_tags
    const suggestedTags = photo.suggestedTags || [];
    if (!suggestedTags.includes(normalizedTag)) {
      throw new AppError(400, `Tag "${normalizedTag}" is not in suggested tags`, "VALIDATION_ERROR");
    }

    // Remove from suggested_tags
    const updatedSuggestedTags = suggestedTags.filter((t) => t !== normalizedTag);

    // Add to confirmed tags (deduplicate)
    const currentTags = photo.tags || [];
    const updatedTags = Array.from(new Set([...currentTags, normalizedTag]));

    // Update photo
    await this.photoRepository.update(photoId, {
      tags: updatedTags,
      suggestedTags: updatedSuggestedTags.length > 0 ? updatedSuggestedTags : null,
    });
  }
}

