import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { ProgressService } from "../../../infrastructure/sse/progress.service.js";
import { FailPhotoCommand } from "./fail-photo.command.js";

export class FailPhotoHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private uploadJobRepository: UploadJobRepository,
    private progressService: ProgressService
  ) {}

  async handle(command: FailPhotoCommand): Promise<void> {
    // Find photo by ID
    const photo = await this.photoRepository.findById(command.photoId);

    if (!photo) {
      throw new Error(`Photo with id ${command.photoId} not found`);
    }

    // Verify photo belongs to user
    if (photo.userId !== command.userId) {
      throw new Error("Unauthorized: Photo does not belong to user");
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

