import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { createNotFoundError, createForbiddenError, AppError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { RejectTagCommand } from "./reject-tag.command.js";

/**
 * Handler for rejecting AI-suggested tags
 * Removes a tag from suggested_tags without adding to confirmed tags
 */
export class RejectTagHandler {
  constructor(private photoRepository: PhotoRepository) {}

  /**
   * Reject an AI-suggested tag
   * - Validates the photo exists and belongs to the user
   * - Validates the tag exists in suggested_tags
   * - Removes the tag from suggested_tags
   */
  async handle(command: RejectTagCommand): Promise<void> {
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

    // Update photo
    await this.photoRepository.update(photoId, {
      suggestedTags: updatedSuggestedTags.length > 0 ? updatedSuggestedTags : null,
    });
  }
}

