import { eq } from "drizzle-orm";
import { db } from "../connection.js";
import { uploadJob } from "../schema.js";
import {
  UploadJob,
  UploadJobStatus,
} from "../../../domain/upload-job/upload-job.entity.js";
import { UploadJobRepository } from "../../../domain/upload-job/upload-job.repository.js";
import { randomUUID } from "crypto";

export class UploadJobRepositoryImpl implements UploadJobRepository {
  async create(
    jobData: Omit<UploadJob, "id" | "createdAt" | "updatedAt">
  ): Promise<UploadJob> {
    const id = randomUUID();
    const now = new Date();

    const [created] = await db
      .insert(uploadJob)
      .values({
        id,
        userId: jobData.userId,
        totalPhotos: jobData.totalPhotos,
        completedPhotos: jobData.completedPhotos,
        failedPhotos: jobData.failedPhotos,
        status: jobData.status,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<UploadJob | null> {
    const [result] = await db
      .select()
      .from(uploadJob)
      .where(eq(uploadJob.id, id))
      .limit(1);

    return result ? this.mapToEntity(result) : null;
  }

  async update(id: string, updates: Partial<UploadJob>): Promise<UploadJob> {
    const updateData: any = {
      ...(updates.totalPhotos !== undefined && {
        totalPhotos: updates.totalPhotos,
      }),
      ...(updates.completedPhotos !== undefined && {
        completedPhotos: updates.completedPhotos,
      }),
      ...(updates.failedPhotos !== undefined && {
        failedPhotos: updates.failedPhotos,
      }),
      ...(updates.status !== undefined && { status: updates.status }),
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(uploadJob)
      .set(updateData)
      .where(eq(uploadJob.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Upload job with id ${id} not found`);
    }

    return this.mapToEntity(updated);
  }

  private mapToEntity(row: typeof uploadJob.$inferSelect): UploadJob {
    return {
      id: row.id,
      userId: row.userId,
      totalPhotos: row.totalPhotos,
      completedPhotos: row.completedPhotos,
      failedPhotos: row.failedPhotos,
      status: row.status as UploadJobStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

