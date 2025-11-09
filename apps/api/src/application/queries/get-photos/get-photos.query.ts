export interface GetPhotosQuery {
  userId: string;
  page?: number;
  limit?: number;
}

export interface GetPhotosResult {
  photos: Array<{
    id: string;
    filename: string;
    r2Url: string | null;
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

