export type PhotoStatus = "pending" | "completed" | "failed";

export interface Photo {
  id: string;
  userId: string;
  jobId: string | null;
  filename: string;
  fileSize: number;
  mimeType: string;
  r2Key: string;
  r2Url: string | null;
  status: PhotoStatus;
  createdAt: Date;
  updatedAt: Date;
}

