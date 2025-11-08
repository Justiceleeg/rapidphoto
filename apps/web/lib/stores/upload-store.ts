"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { uploadClient } from "../api-client";
import type {
  InitUploadResponse,
  InitBatchUploadResponse,
} from "@rapidphoto/api-client";

export type UploadState = "idle" | "pending" | "uploading" | "completed" | "error";

export type PhotoUploadStatus = "pending" | "uploading" | "completed" | "failed";

export interface PhotoUpload {
  file: File;
  photoId: string | null;
  status: PhotoUploadStatus;
  progress: number;
  error: string | null;
}

interface UploadStore {
  // Single upload (backward compatible)
  selectedFile: File | null;
  uploadState: UploadState;
  photoId: string | null;
  error: string | null;
  progress: number;

  // Batch upload
  selectedFiles: File[];
  jobId: string | null;
  photoUploads: Record<string, PhotoUpload>; // key: file name, value: upload info
  totalPhotos: number;
  completedPhotos: number;
  failedPhotos: number;

  // Actions
  setSelectedFile: (file: File | null) => void;
  setSelectedFiles: (files: File[]) => void;
  reset: () => void;
  upload: () => Promise<void>;
  uploadBatch: () => Promise<void>;
  updatePhotoStatus: (
    fileName: string,
    updates: Partial<PhotoUpload>
  ) => void;
  failPhoto: (photoId: string) => Promise<void>;
}

export const useUploadStore = create<UploadStore>()(
  subscribeWithSelector((set, get) => ({
  // Single upload
  selectedFile: null,
  uploadState: "idle",
  photoId: null,
  error: null,
  progress: 0,

  // Batch upload
  selectedFiles: [],
  jobId: null,
  photoUploads: {},
  totalPhotos: 0,
  completedPhotos: 0,
  failedPhotos: 0,

  setSelectedFile: (file: File | null) => {
    set({
      selectedFile: file,
      uploadState: file ? "idle" : "idle",
      error: null,
      progress: 0,
      selectedFiles: file ? [file] : [],
    });
  },

  setSelectedFiles: (files: File[]) => {
    const photoUploads: Record<string, PhotoUpload> = {};
    files.forEach((file) => {
      photoUploads[file.name] = {
        file,
        photoId: null,
        status: "pending",
        progress: 0,
        error: null,
      };
    });
    console.log(`setSelectedFiles: Setting ${files.length} files`, {
      fileNames: files.map((f) => f.name),
      photoUploadsKeys: Object.keys(photoUploads),
    });
    
    // Create new array reference to ensure Zustand detects the change
    const newSelectedFiles = [...files];
    
    set((state) => ({
      ...state,
      selectedFiles: newSelectedFiles,
      jobId: null,
      photoUploads,
      totalPhotos: files.length,
      completedPhotos: 0,
      failedPhotos: 0,
      error: null,
    }));
    
    console.log(`setSelectedFiles: State updated, selectedFiles.length should be ${files.length}`);
  },

  updatePhotoStatus: (fileName: string, updates: Partial<PhotoUpload>) => {
    const { photoUploads } = get();
    const current = photoUploads[fileName];
    if (current) {
      const updated = { ...current, ...updates };
      set({
        photoUploads: {
          ...photoUploads,
          [fileName]: updated,
        },
      });

      // Update counts
      const allUploads = Object.values({ ...photoUploads, [fileName]: updated });
      let completed = 0;
      let failed = 0;
      allUploads.forEach((upload) => {
        if (upload.status === "completed") completed++;
        if (upload.status === "failed") failed++;
      });
      set({ completedPhotos: completed, failedPhotos: failed });
    }
  },

  reset: () => {
    set({
      selectedFile: null,
      uploadState: "idle",
      photoId: null,
      error: null,
      progress: 0,
      selectedFiles: [],
      jobId: null,
      photoUploads: {},
      totalPhotos: 0,
      completedPhotos: 0,
      failedPhotos: 0,
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

      const initResult = (await uploadClient.initUpload({
        filename: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      })) as InitUploadResponse;

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

        throw new Error(
          `Failed to upload file: ${uploadResponse.statusText} (${uploadResponse.status})`
        );
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

  uploadBatch: async () => {
    const { selectedFiles } = get();
    if (selectedFiles.length === 0) {
      set({ error: "No files selected" });
      return;
    }

    try {
      // Step 1: Initialize batch upload
      set({ uploadState: "pending", error: null });
      console.log("Initializing batch upload...", {
        fileCount: selectedFiles.length,
      });

      const photos = selectedFiles.map((file) => ({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }));

      const initResult = (await uploadClient.initUpload(
        photos
      )) as InitBatchUploadResponse;

      console.log("Batch upload initialized:", initResult);
      set({ jobId: initResult.jobId });

      // Step 2: Upload all files to R2
      set({ uploadState: "uploading" });

      // Match files to presigned URLs by index (backend returns in same order)
      const uploadPromises = initResult.presignedUrls.map(
        async (presignedData, index) => {
          const fileToUpload = selectedFiles[index];
          
          if (!fileToUpload) {
            console.error("File not found for index:", index, "photoId:", presignedData.photoId);
            return;
          }

          const fileName = fileToUpload.name;

          // Update status to uploading
          get().updatePhotoStatus(fileName, {
            photoId: presignedData.photoId,
            status: "uploading",
            progress: 0,
          });

          try {
            console.log("Uploading to R2...", {
              fileName,
              photoId: presignedData.photoId,
            });

            const uploadResponse = await fetch(presignedData.presignedUrl, {
              method: "PUT",
              body: fileToUpload,
            });

            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              console.error("R2 upload failed:", {
                fileName,
                photoId: presignedData.photoId,
                status: uploadResponse.status,
                error: errorText,
              });

              // Report failure
              await get().failPhoto(presignedData.photoId);
              get().updatePhotoStatus(fileName, {
                status: "failed",
                error: `Upload failed: ${uploadResponse.statusText}`,
              });
              return;
            }

            console.log("R2 upload successful:", {
              fileName,
              photoId: presignedData.photoId,
            });

            // Complete the photo
            await uploadClient.completePhoto(presignedData.photoId);
            get().updatePhotoStatus(fileName, {
              status: "completed",
              progress: 100,
            });
          } catch (error) {
            console.error("Upload error:", {
              fileName,
              photoId: presignedData.photoId,
              error,
            });
            const errorMessage =
              error instanceof Error ? error.message : "Upload failed";
            await get().failPhoto(presignedData.photoId);
            get().updatePhotoStatus(fileName, {
              status: "failed",
              error: errorMessage,
            });
          }
        }
      );

      await Promise.all(uploadPromises);
      console.log("Batch upload completed");
      set({ uploadState: "completed" });
    } catch (error) {
      console.error("Batch upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Batch upload failed";
      set({
        uploadState: "error",
        error: errorMessage,
      });
    }
  },

  failPhoto: async (photoId: string) => {
    try {
      await uploadClient.failPhoto(photoId);
    } catch (error) {
      console.error("Failed to report photo failure:", error);
    }
    },
  }))
);

