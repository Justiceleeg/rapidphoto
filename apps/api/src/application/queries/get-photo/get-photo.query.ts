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
  r2Url: string | null;
  status: string;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

