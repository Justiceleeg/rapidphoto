import { eq, count, desc, and, sql } from "drizzle-orm";
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
        thumbnailKey: photoData.thumbnailKey,
        status: photoData.status,
        tags: photoData.tags ?? null,
        suggestedTags: photoData.suggestedTags ?? null,
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

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
    tags?: string[],
    includeSuggested?: boolean
  ): Promise<{ photos: Photo[]; total: number }> {
    const offset = (page - 1) * limit;

    // Build tag filter conditions
    const conditions = [eq(photo.userId, userId)];

    if (tags && tags.length > 0) {
      // Normalize tags (lowercase, trim)
      const normalizedTags = tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean);

      if (normalizedTags.length > 0) {
        if (includeSuggested) {
          // Search in both tags and suggestedTags
          // Photo must have all tags in either tags OR suggestedTags array (AND logic across tags)
          // For each tag, check if it's in either array
          // Build SQL conditions using array contains operator (@>)
          const tagConditions = normalizedTags.map((tag) => {
            // Escape single quotes in tag for SQL
            const escapedTag = tag.replace(/'/g, "''");
            // Construct SQL string with proper array literal syntax
            // PostgreSQL: tags @> ARRAY['tag']::text[] OR suggested_tags @> ARRAY['tag']::text[]
            const arrayLiteral = `ARRAY['${escapedTag}']::text[]`;
            return sql`(${photo.tags} @> ${sql.raw(arrayLiteral)} OR ${photo.suggestedTags} @> ${sql.raw(arrayLiteral)})`;
          });
          // All tag conditions must be true (AND logic)
          conditions.push(sql`(${sql.join(tagConditions, sql` AND `)})`);
        } else {
          // Search only in user-confirmed tags
          // Photo must contain all tags (AND logic using @> operator)
          // Use PostgreSQL array contains operator (@>)
          // For AND logic with multiple tags, we need each tag to be in the array
          // Build condition for each tag individually and combine with AND
          const tagConditions = normalizedTags.map((tag) => {
            const escapedTag = tag.replace(/'/g, "''");
            const arrayLiteral = `ARRAY['${escapedTag}']::text[]`;
            return sql`${photo.tags} @> ${sql.raw(arrayLiteral)}`;
          });
          // All tags must be present (AND logic)
          if (tagConditions.length === 1) {
            conditions.push(tagConditions[0]);
          } else {
            conditions.push(sql`(${sql.join(tagConditions, sql` AND `)})`);
          }
        }
      }
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(photo)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    // Get paginated results
    const results = await db
      .select()
      .from(photo)
      .where(whereClause)
      .orderBy(desc(photo.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      photos: results.map((r) => this.mapToEntity(r)),
      total,
    };
  }

  async update(id: string, updates: Partial<Photo>): Promise<Photo> {
    const updateData: any = {
      ...(updates.filename !== undefined && { filename: updates.filename }),
      ...(updates.fileSize !== undefined && { fileSize: updates.fileSize }),
      ...(updates.mimeType !== undefined && { mimeType: updates.mimeType }),
      ...(updates.r2Key !== undefined && { r2Key: updates.r2Key }),
      ...(updates.r2Url !== undefined && { r2Url: updates.r2Url }),
      ...(updates.thumbnailKey !== undefined && { thumbnailKey: updates.thumbnailKey }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
      ...(updates.suggestedTags !== undefined && { suggestedTags: updates.suggestedTags }),
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

  async findDistinctTagsByUserId(userId: string, prefix?: string): Promise<string[]> {
    // Get all photos for the user
    const photos = await db
      .select({ tags: photo.tags })
      .from(photo)
      .where(eq(photo.userId, userId));

    // Extract all tags from photos (only user-confirmed tags, not suggestedTags)
    const allTags = new Set<string>();
    for (const photoData of photos) {
      if (photoData.tags && Array.isArray(photoData.tags)) {
        for (const tag of photoData.tags) {
          if (tag && typeof tag === "string") {
            const normalizedTag = tag.toLowerCase().trim();
            if (normalizedTag) {
              // Filter by prefix if provided (case-insensitive)
              if (!prefix || normalizedTag.startsWith(prefix.toLowerCase().trim())) {
                allTags.add(normalizedTag);
              }
            }
          }
        }
      }
    }

    // Return sorted array of distinct tags
    return Array.from(allTags).sort();
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
      thumbnailKey: row.thumbnailKey,
      status: row.status as PhotoStatus,
      tags: row.tags ?? null,
      suggestedTags: row.suggestedTags ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

