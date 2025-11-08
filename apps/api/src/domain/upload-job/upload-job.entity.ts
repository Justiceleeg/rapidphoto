export type UploadJobStatus = "pending" | "in-progress" | "completed" | "failed";

export interface UploadJob {
  id: string;
  userId: string;
  totalPhotos: number;
  completedPhotos: number;
  failedPhotos: number;
  status: UploadJobStatus;
  createdAt: Date;
  updatedAt: Date;
}

