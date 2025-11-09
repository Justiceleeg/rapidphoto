import { UploadJob } from "./upload-job.entity.js";

/**
 * Repository interface for upload job data access
 * Defines methods for CRUD operations on upload jobs
 */
export interface UploadJobRepository {
  /**
   * Create a new upload job record
   * @param jobData - Upload job data (without id, createdAt, updatedAt)
   * @returns Created upload job with generated id and timestamps
   */
  create(
    jobData: Omit<UploadJob, "id" | "createdAt" | "updatedAt">
  ): Promise<UploadJob>;
  
  /**
   * Find an upload job by ID
   * @param id - Upload job ID
   * @returns Upload job if found, null otherwise
   */
  findById(id: string): Promise<UploadJob | null>;
  
  /**
   * Update an upload job by ID
   * @param id - Upload job ID
   * @param updates - Partial upload job data to update
   * @returns Updated upload job
   */
  update(id: string, updates: Partial<UploadJob>): Promise<UploadJob>;
}

