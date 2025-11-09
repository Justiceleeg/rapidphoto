import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { GetPhotoQuery, GetPhotoResult } from "./get-photo.query.js";

export class GetPhotoHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  async handle(query: GetPhotoQuery): Promise<GetPhotoResult> {
    const photo = await this.photoRepository.findById(query.photoId);

    if (!photo) {
      throw new Error(`Photo with id ${query.photoId} not found`);
    }

    // Verify photo belongs to user
    if (photo.userId !== query.userId) {
      throw new Error("Unauthorized: Photo does not belong to user");
    }

    // Generate presigned URL for viewing/downloading (only for completed photos)
    const url = photo.status === "completed"
      ? await this.r2Service.generatePresignedGetUrl(photo.r2Key)
      : null;

    return {
      id: photo.id,
      userId: photo.userId,
      jobId: photo.jobId,
      filename: photo.filename,
      fileSize: photo.fileSize,
      mimeType: photo.mimeType,
      r2Key: photo.r2Key,
      url, // Presigned URL for viewing/downloading
      status: photo.status,
      tags: photo.tags,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };
  }
}

