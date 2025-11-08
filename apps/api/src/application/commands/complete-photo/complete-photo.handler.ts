import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { CompletePhotoCommand } from "./complete-photo.command.js";

export class CompletePhotoHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  async handle(command: CompletePhotoCommand): Promise<void> {
    // Find photo by ID
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw new Error(`Photo with id ${command.photoId} not found`);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw new Error("Unauthorized: Photo does not belong to user");
    }

    // Get R2 URL (public URL if configured, otherwise null)
    const r2Url = this.r2Service.getObjectUrl(photo.r2Key);

    // Update photo status to "completed" and set R2 URL
    await this.photoRepository.update(command.photoId, {
      status: "completed",
      r2Url,
    });
  }
}

