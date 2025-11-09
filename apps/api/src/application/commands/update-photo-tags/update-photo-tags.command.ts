export interface UpdatePhotoTagsCommand {
  photoId: string;
  userId: string;
  tags: string[];
}

export interface UpdatePhotoTagsResult {
  id: string;
  filename: string;
  status: string;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

