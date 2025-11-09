import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { ProgressService } from "../../../infrastructure/sse/progress.service.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { CompletePhotoCommand } from "./complete-photo.command.js";

/**
 * Handler for completing photo uploads
 * Marks photo as completed, updates upload job progress, and publishes progress events
 */
export class CompletePhotoHandler {
  /**
   * @param photoRepository - Repository for photo data access
   * @param uploadJobRepository - Repository for upload job data access
   * @param r2Service - Service for R2 storage operations
   * @param progressService - Service for publishing upload progress events
   */
  constructor(
    private photoRepository: PhotoRepository,
    private uploadJobRepository: UploadJobRepository,
    private r2Service: R2Service,
    private progressService: ProgressService
  ) {}

  /**
   * Mark a photo upload as completed
   * Updates photo status, upload job progress, and publishes progress events via SSE
   * 
   * @param command - Complete photo command
   * @throws {AppError} If photo not found or user doesn't own the photo
   */
  async handle(command: CompletePhotoCommand): Promise<void> {
    // Find photo by ID
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw createNotFoundError("Photo", command.photoId);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw createForbiddenError("Photo does not belong to user");
    }

    // Get R2 URL (public URL if configured, otherwise null)
    const r2Url = this.r2Service.getObjectUrl(photo.r2Key);

    // Update photo status to "completed" and set R2 URL
    await this.photoRepository.update(command.photoId, {
      status: "completed",
      r2Url,
    });

    // If photo is part of an upload job, update job progress
    if (photo.jobId) {
      const job = await this.uploadJobRepository.findById(photo.jobId);
      if (job) {
        const newCompletedPhotos = job.completedPhotos + 1;
        const isComplete =
          newCompletedPhotos + job.failedPhotos >= job.totalPhotos;

        await this.uploadJobRepository.update(photo.jobId, {
          completedPhotos: newCompletedPhotos,
          status: isComplete ? "completed" : "in-progress",
        });

        // Publish progress event
        this.progressService.publish({
          jobId: job.id,
          completedPhotos: newCompletedPhotos,
          failedPhotos: job.failedPhotos,
          totalPhotos: job.totalPhotos,
          status: isComplete ? "completed" : "in-progress",
        });
      }
    }
  }
}

