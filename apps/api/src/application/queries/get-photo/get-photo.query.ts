export interface GetPhotoQuery {
  photoId: string;
  userId: string;
}

export interface GetPhotoResult {
  id: string;
  userId: string;
  jobId: string | null;
  filename: string;
  fileSize: number;
  mimeType: string;
  r2Key: string;
  url: string | null; // Presigned URL for viewing/downloading (temporary, expires in 1 hour)
  status: string;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

