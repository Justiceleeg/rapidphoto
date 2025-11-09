import Constants from "expo-constants";
import { createApiClient, UploadClient, PhotoClient } from "@rapidphoto/api-client";

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "https://api-production-18fb.up.railway.app";

console.log("Mobile API URL:", apiUrl);

// Use the API URL as the origin since Better Auth validates against trustedOrigins
const requestOrigin = apiUrl;

// Create API client
const apiClient = createApiClient({
  baseURL: apiUrl,
  headers: {
    Origin: requestOrigin,
  },
});

// Create upload client
export const uploadClient = new UploadClient(apiClient);

// Create photo client
export const photoClient = new PhotoClient(apiClient);

// Export the API URL for direct fetch calls (e.g., SSE)
export const API_URL = apiUrl;
