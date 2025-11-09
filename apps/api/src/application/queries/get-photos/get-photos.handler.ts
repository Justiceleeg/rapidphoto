import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { GetPhotosQuery, GetPhotosResult } from "./get-photos.query.js";

/**
 * Handler for querying user photos with pagination
 * Generates presigned URLs for completed photos
 */
export class GetPhotosHandler {
  /**
   * @param photoRepository - Repository for photo data access
   * @param r2Service - Service for R2 storage operations
   */
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  /**
   * Get paginated list of photos for a user
   * Generates presigned URLs for completed photos in parallel
   * 
   * @param query - Query parameters for photo retrieval
   * @returns Paginated list of photos with presigned URLs
   */
  async handle(query: GetPhotosQuery): Promise<GetPhotosResult> {
    // Note: Pagination validation is handled by Zod at the route level
    // page is validated as positive integer, limit is validated as positive integer with max 100
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { photos, total } = await this.photoRepository.findByUserIdPaginated(
      query.userId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    // Generate presigned URLs for all photos in parallel
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        // Only generate URL for completed photos
        const url = photo.status === "completed" 
          ? await this.r2Service.generatePresignedGetUrl(photo.r2Key)
          : null;

        // Generate thumbnail URL if thumbnail exists
        const thumbnailUrl = photo.thumbnailKey
          ? await this.r2Service.generatePresignedGetUrl(photo.thumbnailKey)
          : null;

        return {
          id: photo.id,
          filename: photo.filename,
          url, // Presigned URL for viewing/downloading
          thumbnailUrl, // Presigned URL for thumbnail
          status: photo.status,
          tags: photo.tags,
          suggestedTags: photo.suggestedTags, // AI-generated tag suggestions
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        };
      })
    );

    return {
      photos: photosWithUrls,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

