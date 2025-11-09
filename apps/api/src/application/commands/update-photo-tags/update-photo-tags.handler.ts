import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { UpdatePhotoTagsCommand, UpdatePhotoTagsResult } from "./update-photo-tags.command.js";

export class UpdatePhotoTagsHandler {
  constructor(private photoRepository: PhotoRepository) {}

  async handle(command: UpdatePhotoTagsCommand): Promise<UpdatePhotoTagsResult> {
    // Validate tags
    if (!Array.isArray(command.tags)) {
      throw new Error("Tags must be an array");
    }

    // Validate each tag
    for (const tag of command.tags) {
      if (typeof tag !== "string") {
        throw new Error("All tags must be strings");
      }
      if (tag.trim().length === 0) {
        throw new Error("Tags cannot be empty strings");
      }
      if (tag.length > 50) {
        throw new Error("Tags cannot exceed 50 characters");
      }
    }

    // Find photo
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw new Error(`Photo with id ${command.photoId} not found`);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw new Error("Unauthorized: Photo does not belong to user");
    }

    // Normalize tags: trim, remove duplicates, convert to lowercase
    const normalizedTags = Array.from(
      new Set(command.tags.map((tag) => tag.trim().toLowerCase()))
    ).filter((tag) => tag.length > 0);

    // Update photo tags
    const updated = await this.photoRepository.update(command.photoId, {
      tags: normalizedTags.length > 0 ? normalizedTags : null,
    });

    // Return minimal data - no need to regenerate presigned URL for tag updates
    // The client will keep using the existing URL from the photo they already have
    return {
      id: updated.id,
      filename: updated.filename,
      status: updated.status,
      tags: updated.tags,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

