import { Photo } from "./photo.entity.js";

/**
 * Repository interface for photo data access
 * Defines methods for CRUD operations on photos
 */
export interface PhotoRepository {
  /**
   * Create a new photo record
   * @param photo - Photo data (without id, createdAt, updatedAt)
   * @returns Created photo with generated id and timestamps
   */
  create(photo: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo>;
  
  /**
   * Find a photo by ID
   * @param id - Photo ID
   * @returns Photo if found, null otherwise
   */
  findById(id: string): Promise<Photo | null>;
  
  /**
   * Find all photos for a user
   * @param userId - User ID
   * @returns Array of photos belonging to the user
   */
  findByUserId(userId: string): Promise<Photo[]>;
  
  /**
   * Find photos for a user with pagination
   * @param userId - User ID
   * @param page - Page number (1-indexed)
   * @param limit - Number of photos per page
   * @param tags - Optional array of tags to filter by (AND logic - photo must have all tags)
   * @param includeSuggested - Whether to include AI-suggested tags in search (default: false)
   * @returns Paginated photos and total count
   */
  findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
    tags?: string[],
    includeSuggested?: boolean
  ): Promise<{ photos: Photo[]; total: number }>;
  
  /**
   * Update a photo by ID
   * @param id - Photo ID
   * @param updates - Partial photo data to update
   * @returns Updated photo
   */
  update(id: string, updates: Partial<Photo>): Promise<Photo>;
  
  /**
   * Delete a photo by ID
   * @param id - Photo ID
   */
  delete(id: string): Promise<void>;

  /**
   * Find distinct tags for a user
   * @param userId - User ID
   * @param prefix - Optional prefix to filter tags by (case-insensitive)
   * @returns Array of distinct tags (only from user-confirmed tags, not suggestedTags)
   */
  findDistinctTagsByUserId(userId: string, prefix?: string): Promise<string[]>;
}

