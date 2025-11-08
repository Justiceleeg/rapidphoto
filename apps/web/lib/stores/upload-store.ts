"use client";

import { create } from "zustand";
import { uploadClient } from "../api-client";

export type UploadState = "idle" | "pending" | "uploading" | "completed" | "error";

interface UploadStore {
  selectedFile: File | null;
  uploadState: UploadState;
  photoId: string | null;
  error: string | null;
  progress: number;

  // Actions
  setSelectedFile: (file: File | null) => void;
  reset: () => void;
  upload: () => Promise<void>;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  selectedFile: null,
  uploadState: "idle",
  photoId: null,
  error: null,
  progress: 0,

  setSelectedFile: (file: File | null) => {
    set({
      selectedFile: file,
      uploadState: file ? "idle" : "idle",
      error: null,
      progress: 0,
    });
  },

  reset: () => {
    set({
      selectedFile: null,
      uploadState: "idle",
      photoId: null,
      error: null,
      progress: 0,
    });
  },

  upload: async () => {
    const { selectedFile } = get();
    if (!selectedFile) {
      set({ error: "No file selected" });
      return;
    }

    try {
      // Step 1: Initialize upload
      set({ uploadState: "pending", error: null, progress: 0 });
      console.log("Initializing upload...", {
        filename: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });

      const initResult = await uploadClient.initUpload({
        filename: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });

      console.log("Upload initialized:", initResult);
      set({ photoId: initResult.photoId, progress: 10 });

      // Step 2: Upload file to R2 using presigned URL
      set({ uploadState: "uploading", progress: 20 });
      console.log("Uploading to R2...", initResult.presignedUrl);

      // Note: Don't set Content-Type header to avoid CORS preflight
      // The presigned URL already includes Content-Type in the signature
      const uploadResponse = await fetch(initResult.presignedUrl, {
        method: "PUT",
        body: selectedFile,
        // Don't set headers - let the presigned URL handle Content-Type
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("R2 upload failed:", uploadResponse.status, errorText);
        
        // Check for CORS errors
        if (uploadResponse.status === 403 || uploadResponse.status === 0) {
          throw new Error(
            "CORS error: R2 bucket needs CORS configuration. " +
            "Please configure CORS on your R2 bucket to allow requests from your domain."
          );
        }
        
        throw new Error(`Failed to upload file: ${uploadResponse.statusText} (${uploadResponse.status})`);
      }

      console.log("R2 upload successful");
      set({ progress: 90 });

      // Step 3: Complete upload
      console.log("Completing upload...", initResult.photoId);
      await uploadClient.completePhoto(initResult.photoId);
      console.log("Upload completed successfully");
      set({ uploadState: "completed", progress: 100 });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      set({
        uploadState: "error",
        error: errorMessage,
      });
    }
  },
}));

