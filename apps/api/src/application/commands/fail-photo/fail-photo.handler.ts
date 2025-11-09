import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { ProgressService } from "../../../infrastructure/sse/progress.service.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { FailPhotoCommand } from "./fail-photo.command.js";

/**
 * Handler for marking photo uploads as failed
 * Updates photo status, upload job progress, and publishes progress events
 */
export class FailPhotoHandler {
  /**
   * @param photoRepository - Repository for photo data access
   * @param uploadJobRepository - Repository for upload job data access
   * @param progressService - Service for publishing upload progress events
   */
  constructor(
    private photoRepository: PhotoRepository,
    private uploadJobRepository: UploadJobRepository,
    private progressService: ProgressService
  ) {}

  /**
   * Mark a photo upload as failed
   * Updates photo status, upload job progress, and publishes progress events via SSE
   * 
   * @param command - Fail photo command
   * @throws {AppError} If photo not found or user doesn't own the photo
   */
  async handle(command: FailPhotoCommand): Promise<void> {
    // Find photo by ID
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw createNotFoundError("Photo", command.photoId);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw createForbiddenError("Photo does not belong to user");
    }

    // Update photo status to "failed"
    await this.photoRepository.update(command.photoId, {
      status: "failed",
    });

    // If photo is part of an upload job, update job progress
    if (photo.jobId) {
      const job = await this.uploadJobRepository.findById(photo.jobId);
      if (job) {
        const newFailedPhotos = job.failedPhotos + 1;
        const totalProcessed = job.completedPhotos + newFailedPhotos;
        const isComplete = totalProcessed >= job.totalPhotos;
        const shouldMarkFailed = newFailedPhotos > 0 && isComplete;

        await this.uploadJobRepository.update(photo.jobId, {
          failedPhotos: newFailedPhotos,
          status: shouldMarkFailed ? "failed" : isComplete ? "completed" : "in-progress",
        });

        // Publish progress event
        this.progressService.publish({
          jobId: job.id,
          completedPhotos: job.completedPhotos,
          failedPhotos: newFailedPhotos,
          totalPhotos: job.totalPhotos,
          status: shouldMarkFailed ? "failed" : isComplete ? "completed" : "in-progress",
        });
      }
    }
  }
}

