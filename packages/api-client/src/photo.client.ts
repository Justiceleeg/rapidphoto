/**
 * Photo client methods
 */

import { ApiClient } from './client';

export interface Photo {
  id: string;
  filename: string;
  url: string | null; // Presigned URL (temporary, expires in 1 hour)
  thumbnailKey: string | null; // R2 key for thumbnail
  thumbnailUrl: string | null; // Presigned URL for thumbnail (temporary, expires in 1 hour)
  status: string;
  tags: string[] | null;
  suggestedTags: string[] | null; // AI-generated tag suggestions (≥70% confidence)
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPhotosRequest {
  page?: number;
  limit?: number;
}

export interface GetPhotosResponse {
  photos: Photo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdatePhotoTagsRequest {
  tags: string[];
}

export class PhotoClient {
  constructor(private client: ApiClient) {}

  /**
   * Get photos with pagination
   */
  async getPhotos(params?: GetPhotosRequest): Promise<GetPhotosResponse> {
    return this.client.get<GetPhotosResponse>('/api/photos', {
      params: params as Record<string, string | number | boolean>,
    });
  }

  /**
   * Get single photo by ID
   */
  async getPhoto(id: string): Promise<Photo> {
    return this.client.get<Photo>(`/api/photos/${id}`);
  }

  /**
   * Delete photo by ID
   */
  async deletePhoto(id: string): Promise<void> {
    return this.client.delete<void>(`/api/photos/${id}`);
  }

  /**
   * Update photo tags
   */
  async updatePhotoTags(id: string, tagsOrData: string[] | UpdatePhotoTagsRequest): Promise<Photo> {
    // Handle both tags array and data object for flexibility
    const tags = Array.isArray(tagsOrData) ? tagsOrData : tagsOrData.tags;
    
    if (!Array.isArray(tags)) {
      throw new Error(`Invalid tags: ${JSON.stringify(tagsOrData)}`);
    }
    
    // Always send as { tags: [...] }
    return this.client.put<Photo>(`/api/photos/${id}/tags`, { tags });
  }

  /**
   * Accept an AI-suggested tag (moves from suggestedTags to tags)
   */
  async acceptTag(id: string, tag: string): Promise<void> {
    return this.client.post<void>(`/api/photos/${id}/tags/accept`, { tag });
  }

  /**
   * Reject an AI-suggested tag (removes from suggestedTags)
   */
  async rejectTag(id: string, tag: string): Promise<void> {
    return this.client.post<void>(`/api/photos/${id}/tags/reject`, { tag });
  }
}

