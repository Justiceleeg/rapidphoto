import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { GetUploadJobQuery, GetUploadJobResult } from "./get-upload-job.query.js";

export class GetUploadJobHandler {
  constructor(private uploadJobRepository: UploadJobRepository) {}

  async handle(query: GetUploadJobQuery): Promise<GetUploadJobResult> {
    const job = await this.uploadJobRepository.findById(query.jobId);

    if (!job) {
      throw createNotFoundError("Upload job", query.jobId);
    }

    // Verify job belongs to user
    if (job.userId !== query.userId) {
      throw createForbiddenError("Upload job does not belong to user");
    }

    return {
      id: job.id,
      userId: job.userId,
      totalPhotos: job.totalPhotos,
      completedPhotos: job.completedPhotos,
      failedPhotos: job.failedPhotos,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}

