import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { GetPhotoQuery, GetPhotoResult } from "./get-photo.query.js";

export class GetPhotoHandler {
  constructor(private photoRepository: PhotoRepository) {}

  async handle(query: GetPhotoQuery): Promise<GetPhotoResult> {
    const photo = await this.photoRepository.findById(query.photoId);

    if (!photo) {
      throw new Error(`Photo with id ${query.photoId} not found`);
    }

    // Verify photo belongs to user
    if (photo.userId !== query.userId) {
      throw new Error("Unauthorized: Photo does not belong to user");
    }

    return {
      id: photo.id,
      userId: photo.userId,
      jobId: photo.jobId,
      filename: photo.filename,
      fileSize: photo.fileSize,
      mimeType: photo.mimeType,
      r2Key: photo.r2Key,
      r2Url: photo.r2Url,
      status: photo.status,
      tags: photo.tags,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };
  }
}

