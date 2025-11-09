import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { UpdatePhotoTagsCommand, UpdatePhotoTagsResult } from "./update-photo-tags.command.js";

export class UpdatePhotoTagsHandler {
  constructor(private photoRepository: PhotoRepository) {}

  async handle(command: UpdatePhotoTagsCommand): Promise<UpdatePhotoTagsResult> {
    // Note: Tag validation is handled by Zod at the route level
    // No need to validate here - tags are already validated and normalized

    // Find photo
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw createNotFoundError("Photo", command.photoId);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw createForbiddenError("Photo does not belong to user");
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

