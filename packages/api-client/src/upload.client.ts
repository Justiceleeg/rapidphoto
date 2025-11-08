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

export interface InitBatchUploadResponse {
  jobId: string;
  photoIds: string[];
  presignedUrls: Array<{
    photoId: string;
    presignedUrl: string;
    r2Key: string;
  }>;
}

export interface CompletePhotoResponse {
  success: boolean;
}

export interface FailPhotoResponse {
  success: boolean;
}

export class UploadClient {
  constructor(private client: ApiClient) {}

  /**
   * Initialize a photo upload (single or batch)
   * Returns a presigned URL for direct upload to R2
   * For batch uploads, returns jobId and array of presigned URLs
   */
  async initUpload(
    data: InitUploadRequest | InitUploadRequest[]
  ): Promise<InitUploadResponse | InitBatchUploadResponse> {
    return this.client.post<InitUploadResponse | InitBatchUploadResponse>('/api/upload/init', data, {
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

  /**
   * Report a failed photo upload
   * Notifies the backend that a photo upload failed
   */
  async failPhoto(photoId: string): Promise<FailPhotoResponse> {
    return this.client.post<FailPhotoResponse>(`/api/photos/${photoId}/failed`, undefined, {
      credentials: 'include',
    });
  }
}

