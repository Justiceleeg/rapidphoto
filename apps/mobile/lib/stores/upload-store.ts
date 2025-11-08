import { create } from "zustand";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { uploadClient } from "../api-client";

export type UploadState = "idle" | "pending" | "uploading" | "completed" | "error";

export interface SelectedFile {
  uri: string;
  filename: string;
  mimeType: string;
  fileSize: number;
}

interface UploadStore {
  selectedFile: SelectedFile | null;
  uploadState: UploadState;
  photoId: string | null;
  error: string | null;
  progress: number;

  // Actions
  setSelectedFile: (file: SelectedFile | null) => void;
  reset: () => void;
  upload: () => Promise<void>;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  selectedFile: null,
  uploadState: "idle",
  photoId: null,
  error: null,
  progress: 0,

  setSelectedFile: (file: SelectedFile | null) => {
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
        filename: selectedFile.filename,
        fileSize: selectedFile.fileSize,
        mimeType: selectedFile.mimeType,
      });

      const initResult = await uploadClient.initUpload({
        filename: selectedFile.filename,
        fileSize: selectedFile.fileSize,
        mimeType: selectedFile.mimeType,
      }).catch((error) => {
        console.error("Init upload error details:", {
          error,
          message: error.message,
          stack: error.stack,
        });
        throw error;
      });

      console.log("Upload initialized:", initResult);
      set({ photoId: initResult.photoId, progress: 10 });

      // Step 2: Upload file to R2 using presigned URL with expo/fetch
      set({ uploadState: "uploading", progress: 20 });
      console.log("Uploading to R2...", initResult.presignedUrl);

      // Create a File object from the URI
      const file = new File(selectedFile.uri);
      
      const uploadResponse = await fetch(initResult.presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": selectedFile.mimeType,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("R2 upload failed:", uploadResponse.status, errorText);
        throw new Error(`Failed to upload file: ${uploadResponse.statusText} (${uploadResponse.status})`);
      }

      console.log("R2 upload successful");
      set({ progress: 90 });

      // Step 4: Complete upload
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

