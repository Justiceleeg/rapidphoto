"use client";

import { createApiClient, UploadClient, PhotoClient } from "@rapidphoto/api-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create API client
const apiClient = createApiClient({
  baseURL: apiUrl,
});

// Create upload client
export const uploadClient = new UploadClient(apiClient);

// Create photo client
export const photoClient = new PhotoClient(apiClient);

