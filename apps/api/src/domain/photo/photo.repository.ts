import { Photo } from "./photo.entity.js";

export interface PhotoRepository {
  create(photo: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo>;
  findById(id: string): Promise<Photo | null>;
  findByUserId(userId: string): Promise<Photo[]>;
  findByUserIdPaginated(userId: string, page: number, limit: number): Promise<{ photos: Photo[]; total: number }>;
  update(id: string, updates: Partial<Photo>): Promise<Photo>;
  delete(id: string): Promise<void>;
}

