import { randomUUID } from "crypto";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { InitUploadCommand, InitUploadResult } from "./init-upload.command.js";

export class InitUploadHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private uploadJobRepository: UploadJobRepository,
    private r2Service: R2Service
  ) {}

  async handle(command: InitUploadCommand): Promise<InitUploadResult> {
    const photosArray = Array.isArray(command.photos)
      ? command.photos
      : [command.photos];

    // Single photo upload (backward compatible)
    if (photosArray.length === 1) {
      const photoMeta = photosArray[0];
      const photoId = randomUUID();
      const r2Key = `${command.userId}/${photoId}/${photoMeta.filename}`;

      // Create photo record with status "pending" (no jobId for single uploads)
      const photo = await this.photoRepository.create({
        userId: command.userId,
        jobId: null,
        filename: photoMeta.filename,
        fileSize: photoMeta.fileSize,
        mimeType: photoMeta.mimeType,
        r2Key,
        r2Url: null,
        status: "pending",
        tags: null,
      });

      // Generate presigned URL for upload
      const presignedUrl = await this.r2Service.generatePresignedUrl(
        r2Key,
        photoMeta.mimeType
      );

      return {
        photoId: photo.id,
        presignedUrl,
        r2Key,
      };
    }

    // Batch upload
    const jobId = randomUUID();
    const photoIds: string[] = [];
    const presignedUrls: Array<{
      photoId: string;
      presignedUrl: string;
      r2Key: string;
    }> = [];

    // Create upload job
    const uploadJob = await this.uploadJobRepository.create({
      userId: command.userId,
      totalPhotos: photosArray.length,
      completedPhotos: 0,
      failedPhotos: 0,
      status: "pending",
    });

    // Process each photo
    for (const photoMeta of photosArray) {
      const photoId = randomUUID();
      const r2Key = `${command.userId}/${photoId}/${photoMeta.filename}`;

      // Create photo record with status "pending" and link to job
      const photo = await this.photoRepository.create({
        userId: command.userId,
        jobId: uploadJob.id,
        filename: photoMeta.filename,
        fileSize: photoMeta.fileSize,
        mimeType: photoMeta.mimeType,
        r2Key,
        r2Url: null,
        status: "pending",
        tags: null,
      });

      // Generate presigned URL for upload
      const presignedUrl = await this.r2Service.generatePresignedUrl(
        r2Key,
        photoMeta.mimeType
      );

      photoIds.push(photo.id);
      presignedUrls.push({
        photoId: photo.id,
        presignedUrl,
        r2Key,
      });
    }

    // Update job status to "in-progress"
    await this.uploadJobRepository.update(uploadJob.id, {
      status: "in-progress",
    });

    return {
      jobId: uploadJob.id,
      photoIds,
      presignedUrls,
    };
  }
}

