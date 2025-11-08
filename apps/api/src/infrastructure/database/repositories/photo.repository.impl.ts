import { eq } from "drizzle-orm";
import { db } from "../connection.js";
import { photo } from "../schema.js";
import { Photo, PhotoStatus } from "../../../domain/photo/photo.entity.js";
import { PhotoRepository } from "../../../domain/photo/photo.repository.js";
import { randomUUID } from "crypto";

export class PhotoRepositoryImpl implements PhotoRepository {
  async create(
    photoData: Omit<Photo, "id" | "createdAt" | "updatedAt">
  ): Promise<Photo> {
    const id = randomUUID();
    const now = new Date();

    const [created] = await db
      .insert(photo)
      .values({
        id,
        userId: photoData.userId,
        jobId: photoData.jobId ?? null,
        filename: photoData.filename,
        fileSize: photoData.fileSize,
        mimeType: photoData.mimeType,
        r2Key: photoData.r2Key,
        r2Url: photoData.r2Url,
        status: photoData.status,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Photo | null> {
    const [result] = await db
      .select()
      .from(photo)
      .where(eq(photo.id, id))
      .limit(1);

    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<Photo[]> {
    const results = await db
      .select()
      .from(photo)
      .where(eq(photo.userId, userId));

    return results.map((r) => this.mapToEntity(r));
  }

  async update(id: string, updates: Partial<Photo>): Promise<Photo> {
    const updateData: any = {
      ...(updates.filename !== undefined && { filename: updates.filename }),
      ...(updates.fileSize !== undefined && { fileSize: updates.fileSize }),
      ...(updates.mimeType !== undefined && { mimeType: updates.mimeType }),
      ...(updates.r2Key !== undefined && { r2Key: updates.r2Key }),
      ...(updates.r2Url !== undefined && { r2Url: updates.r2Url }),
      ...(updates.status !== undefined && { status: updates.status }),
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(photo)
      .set(updateData)
      .where(eq(photo.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Photo with id ${id} not found`);
    }

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db.delete(photo).where(eq(photo.id, id));
  }

  private mapToEntity(row: typeof photo.$inferSelect): Photo {
    return {
      id: row.id,
      userId: row.userId,
      jobId: row.jobId,
      filename: row.filename,
      fileSize: row.fileSize,
      mimeType: row.mimeType,
      r2Key: row.r2Key,
      r2Url: row.r2Url,
      status: row.status as PhotoStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

