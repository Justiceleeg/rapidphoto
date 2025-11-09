export interface GetUploadJobQuery {
  jobId: string;
  userId: string;
}

export interface GetUploadJobResult {
  id: string;
  userId: string;
  totalPhotos: number;
  completedPhotos: number;
  failedPhotos: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

