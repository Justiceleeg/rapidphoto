export interface GetPhotosQuery {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetPhotosResult {
  photos: Array<{
    id: string;
    filename: string;
    url: string | null; // Presigned URL for viewing/downloading (temporary, expires in 1 hour)
    status: string;
    tags: string[] | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

