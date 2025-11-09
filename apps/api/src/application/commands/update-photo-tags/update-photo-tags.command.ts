export interface UpdatePhotoTagsCommand {
  photoId: string;
  userId: string;
  tags: string[];
}

export interface UpdatePhotoTagsResult {
  id: string;
  filename: string;
  r2Url: string | null;
  status: string;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

