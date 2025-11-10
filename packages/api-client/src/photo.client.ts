/**
 * Photo client methods
 */

import { ApiClient } from "./client";

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
  tags?: string[];
  includeSuggested?: boolean;
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
   * Get photos with pagination and optional tag filtering
   */
  async getPhotos(params?: GetPhotosRequest): Promise<GetPhotosResponse> {
    // Convert tags array to comma-separated string for query parameter
    const queryParams: Record<string, string | number | boolean> = {};
    if (params) {
      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.tags && params.tags.length > 0) {
        queryParams.tags = params.tags.join(",");
      }
      if (params.includeSuggested !== undefined) {
        queryParams.includeSuggested = params.includeSuggested;
      }
    }
    return this.client.get<GetPhotosResponse>("/api/photos", {
      params: queryParams,
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
  async updatePhotoTags(
    id: string,
    tagsOrData: string[] | UpdatePhotoTagsRequest
  ): Promise<Photo> {
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

  /**
   * Get distinct tags for autocomplete
   */
  async getTags(prefix?: string): Promise<string[]> {
    const params: Record<string, string> = {};
    if (prefix) {
      params.prefix = prefix;
    }
    const response = await this.client.get<{ tags: string[] }>(
      "/api/photos/tags",
      {
        params,
      }
    );
    return response.tags;
  }

  /**
   * Download a photo file as a blob
   * Proxies through the API to avoid CORS issues with presigned URLs
   */
  async downloadPhoto(id: string): Promise<Blob> {
    // Use the client's baseURL to build the download URL
    const endpoint = `/api/photos/${id}/download`;
    const baseURL = this.client.getBaseURL();
    const url = `${baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const error = JSON.parse(errorText) as {
              message?: string;
              error?: string;
            };
            errorMessage = error.message || error.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (err) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.blob();
  }
}
