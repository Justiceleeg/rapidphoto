import { UploadJob } from "./upload-job.entity.js";

export interface UploadJobRepository {
  create(
    jobData: Omit<UploadJob, "id" | "createdAt" | "updatedAt">
  ): Promise<UploadJob>;
  findById(id: string): Promise<UploadJob | null>;
  update(id: string, updates: Partial<UploadJob>): Promise<UploadJob>;
}

