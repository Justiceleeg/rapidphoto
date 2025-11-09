import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { GetPhotosQuery, GetPhotosResult } from "./get-photos.query.js";

export class GetPhotosHandler {
  constructor(private photoRepository: PhotoRepository) {}

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

    return {
      photos: photos.map((photo) => ({
        id: photo.id,
        filename: photo.filename,
        r2Url: photo.r2Url,
        status: photo.status,
        tags: photo.tags,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

