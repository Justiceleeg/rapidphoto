import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { R2Service } from "../../../infrastructure/storage/r2.service.js";
import { GetPhotosQuery, GetPhotosResult } from "./get-photos.query.js";

export class GetPhotosHandler {
  constructor(
    private photoRepository: PhotoRepository,
    private r2Service: R2Service
  ) {}

  async handle(query: GetPhotosQuery): Promise<GetPhotosResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    // Validate pagination parameters
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

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

    return {
        id: photo.id,
        filename: photo.filename,
          url, // Presigned URL for viewing/downloading
        status: photo.status,
        tags: photo.tags,
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

