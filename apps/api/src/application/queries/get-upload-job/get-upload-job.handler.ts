import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { GetUploadJobQuery, GetUploadJobResult } from "./get-upload-job.query.js";

export class GetUploadJobHandler {
  constructor(private uploadJobRepository: UploadJobRepository) {}

  async handle(query: GetUploadJobQuery): Promise<GetUploadJobResult> {
    const job = await this.uploadJobRepository.findById(query.jobId);

    if (!job) {
      throw new Error(`Upload job with id ${query.jobId} not found`);
    }

    // Verify job belongs to user
    if (job.userId !== query.userId) {
      throw new Error("Unauthorized: Upload job does not belong to user");
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

