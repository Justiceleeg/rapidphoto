import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { createNotFoundError, createForbiddenError } from "../../../infrastructure/http/middleware/error.middleware.js";
import { GetUploadJobQuery, GetUploadJobResult } from "./get-upload-job.query.js";

/**
 * Handler for querying upload job details
 */
export class GetUploadJobHandler {
  /**
   * @param uploadJobRepository - Repository for upload job data access
   */
  constructor(private uploadJobRepository: UploadJobRepository) {}

  /**
   * Get upload job details by ID
   * 
   * @param query - Query parameters for upload job retrieval
   * @returns Upload job details with progress information
   * @throws {AppError} If upload job not found or user doesn't own the job
   */
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

