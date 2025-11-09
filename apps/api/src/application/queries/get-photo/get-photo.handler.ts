import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { GetPhotoQuery, GetPhotoResult } from "./get-photo.query.js";

/**
 * Handler for querying a single photo by ID
 * Generates presigned URL for completed photos
 */
export class GetPhotoHandler {
  /**
   * @param photoRepository - Repository for photo data access
   * @param r2Service - Service for R2 storage operations
   */
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  /**
   * Get a single photo by ID
   * Generates presigned URL if photo is completed
   * 
   * @param query - Query parameters for photo retrieval
   * @returns Photo details with presigned URL if completed
   * @throws {AppError} If photo not found or user doesn't own the photo
   */
  async handle(query: GetPhotoQuery): Promise<GetPhotoResult> {
    const photo = await this.photoRepository.findById(query.photoId);

    if (!photo) {
      throw createNotFoundError("Photo", query.photoId);
    }

    // Verify photo belongs to user
    if (photo.userId !== query.userId) {
      throw createForbiddenError("Photo does not belong to user");
    }

    // Generate presigned URL for viewing/downloading (only for completed photos)
    const url = photo.status === "completed"
      ? await this.r2Service.generatePresignedGetUrl(photo.r2Key)
      : null;

    // Generate thumbnail URL if thumbnail exists
    const thumbnailUrl = photo.thumbnailKey
      ? await this.r2Service.generatePresignedGetUrl(photo.thumbnailKey)
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
      thumbnailUrl, // Presigned URL for thumbnail
      status: photo.status,
      tags: photo.tags,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };
  }
}

