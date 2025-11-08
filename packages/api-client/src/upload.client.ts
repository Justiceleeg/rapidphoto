/**
 * Upload client methods for photo uploads
 */

import { ApiClient } from './client';

export interface InitUploadRequest {
  filename: string;
  fileSize: number;
  mimeType: string;
}

export interface InitUploadResponse {
  photoId: string;
  presignedUrl: string;
  r2Key: string;
}

export interface CompletePhotoResponse {
  success: boolean;
}

export class UploadClient {
  constructor(private client: ApiClient) {}

  /**
   * Initialize a photo upload
   * Returns a presigned URL for direct upload to R2
   */
  async initUpload(data: InitUploadRequest): Promise<InitUploadResponse> {
    return this.client.post<InitUploadResponse>('/api/upload/init', data, {
      credentials: 'include',
    });
  }

  /**
   * Complete a photo upload
   * Notifies the backend that the file has been uploaded to R2
   */
  async completePhoto(photoId: string): Promise<CompletePhotoResponse> {
    return this.client.post<CompletePhotoResponse>(`/api/photos/${photoId}/complete`, undefined, {
      credentials: 'include',
    });
  }
}

