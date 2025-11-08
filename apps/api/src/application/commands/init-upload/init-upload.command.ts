export interface InitUploadCommand {
  userId: string;
  filename: string;
  fileSize: number;
  mimeType: string;
}

export interface InitUploadResult {
  photoId: string;
  presignedUrl: string;
  r2Key: string;
}

