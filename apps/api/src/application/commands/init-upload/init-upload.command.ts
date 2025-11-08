export interface PhotoMetadata {
  filename: string;
  fileSize: number;
  mimeType: string;
}

export interface InitUploadCommand {
  userId: string;
  photos: PhotoMetadata | PhotoMetadata[];
}

export interface InitUploadResult {
  jobId?: string;
  photoId?: string;
  photoIds?: string[];
  presignedUrl?: string;
  presignedUrls?: Array<{
    photoId: string;
    presignedUrl: string;
    r2Key: string;
  }>;
  r2Key?: string;
}

