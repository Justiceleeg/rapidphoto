import { create } from "zustand";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { uploadClient } from "../api-client";

export type UploadState = "idle" | "pending" | "uploading" | "completed" | "error";
export type PhotoUploadStatus = "pending" | "uploading" | "completed" | "failed";

export interface SelectedFile {
  uri: string;
  filename: string;
  mimeType: string;
  fileSize: number;
}

export interface PhotoUploadProgress {
  photoId: string;
  filename: string;
  status: PhotoUploadStatus;
  progress: number;
  error?: string;
}

interface UploadStore {
  // Single upload state (backward compatible)
  selectedFile: SelectedFile | null;
  uploadState: UploadState;
  photoId: string | null;
  error: string | null;
  progress: number;

  // Batch upload state
  selectedFiles: SelectedFile[];
  jobId: string | null;
  photoProgresses: Map<string, PhotoUploadProgress>;
  totalPhotos: number;
  completedPhotos: number;
  failedPhotos: number;

  // Actions
  setSelectedFile: (file: SelectedFile | null) => void;
  setSelectedFiles: (files: SelectedFile[]) => void;
  reset: () => void;
  upload: () => Promise<void>;
  uploadBatch: () => Promise<void>;
  updatePhotoProgress: (photoId: string, status: PhotoUploadStatus, progress: number, error?: string) => void;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  // Single upload state
  selectedFile: null,
  uploadState: "idle",
  photoId: null,
  error: null,
  progress: 0,

  // Batch upload state
  selectedFiles: [],
  jobId: null,
  photoProgresses: new Map(),
  totalPhotos: 0,
  completedPhotos: 0,
  failedPhotos: 0,

  setSelectedFile: (file: SelectedFile | null) => {
    set({
      selectedFile: file,
      selectedFiles: [],
      uploadState: file ? "idle" : "idle",
      error: null,
      progress: 0,
      jobId: null,
      photoProgresses: new Map(),
      totalPhotos: 0,
      completedPhotos: 0,
      failedPhotos: 0,
    });
  },

  setSelectedFiles: (files: SelectedFile[]) => {
    set({
      selectedFiles: files,
      selectedFile: null,
      uploadState: "idle",
      error: null,
      progress: 0,
      jobId: null,
      photoProgresses: new Map(),
      totalPhotos: files.length,
      completedPhotos: 0,
      failedPhotos: 0,
    });
  },

  reset: () => {
    set({
      selectedFile: null,
      selectedFiles: [],
      uploadState: "idle",
      photoId: null,
      error: null,
      progress: 0,
      jobId: null,
      photoProgresses: new Map(),
      totalPhotos: 0,
      completedPhotos: 0,
      failedPhotos: 0,
    });
  },

  updatePhotoProgress: (photoId: string, status: PhotoUploadStatus, progress: number, error?: string) => {
    const state = get();
    const newProgresses = new Map(state.photoProgresses);
    const existing = newProgresses.get(photoId);
    
    newProgresses.set(photoId, {
      photoId,
      filename: existing?.filename || "",
      status,
      progress,
      error,
    });

    // Update counters
    let completedPhotos = 0;
    let failedPhotos = 0;
    newProgresses.forEach((p) => {
      if (p.status === "completed") completedPhotos++;
      if (p.status === "failed") failedPhotos++;
    });

    set({
      photoProgresses: newProgresses,
      completedPhotos,
      failedPhotos,
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

      // Type guard to check if it's a single upload response
      if ("photoId" in initResult && typeof initResult.photoId === "string" && !("jobId" in initResult)) {
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

        // Step 3: Complete upload
        console.log("Completing upload...", initResult.photoId);
        await uploadClient.completePhoto(initResult.photoId);
        console.log("Upload completed successfully");
        set({ uploadState: "completed", progress: 100 });
      }
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
    if (!selectedFiles || selectedFiles.length === 0) {
      set({ error: "No files selected" });
      return;
    }

    try {
      // Step 1: Initialize batch upload
      set({ uploadState: "pending", error: null, progress: 0 });
      console.log("Initializing batch upload...", {
        count: selectedFiles.length,
        files: selectedFiles.map((f) => f.filename),
      });

      const initData = selectedFiles.map((file) => ({
        filename: file.filename,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      }));

      const initResult = await uploadClient.initUpload(initData);

      // Type guard to check if it's a batch upload response
      if ("jobId" in initResult && "photoIds" in initResult && "presignedUrls" in initResult) {
        console.log("Batch upload initialized:", {
          jobId: initResult.jobId,
          photoCount: initResult.photoIds.length,
        });

        set({ jobId: initResult.jobId, uploadState: "uploading" });

        // Initialize progress tracking for all photos
        const initialProgresses = new Map<string, PhotoUploadProgress>();
        initResult.presignedUrls.forEach((urlData, index) => {
          initialProgresses.set(urlData.photoId, {
            photoId: urlData.photoId,
            filename: selectedFiles[index].filename,
            status: "pending",
            progress: 0,
          });
        });
        set({ photoProgresses: initialProgresses });

        // Step 2: Upload all files to R2 in parallel
        const uploadPromises = initResult.presignedUrls.map(async (urlData, index) => {
          const selectedFile = selectedFiles[index];
          const { photoId, presignedUrl } = urlData;

          try {
            // Update status to uploading
            get().updatePhotoProgress(photoId, "uploading", 10);

            // Create a File object from the URI
            const file = new File(selectedFile.uri);

            console.log(`Uploading photo ${photoId} to R2...`);
            const uploadResponse = await fetch(presignedUrl, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": selectedFile.mimeType,
              },
            });

            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              console.error(`R2 upload failed for ${photoId}:`, uploadResponse.status, errorText);
              
              // Mark as failed and notify backend
              get().updatePhotoProgress(photoId, "failed", 0, `Upload failed: ${uploadResponse.statusText}`);
              await uploadClient.failPhoto(photoId).catch(console.error);
              return;
            }

            console.log(`R2 upload successful for ${photoId}`);
            get().updatePhotoProgress(photoId, "uploading", 90);

            // Complete the upload
            console.log(`Completing upload for ${photoId}...`);
            await uploadClient.completePhoto(photoId);
            console.log(`Upload completed successfully for ${photoId}`);
            get().updatePhotoProgress(photoId, "completed", 100);
          } catch (error) {
            console.error(`Upload error for ${photoId}:`, error);
            const errorMessage = error instanceof Error ? error.message : "Upload failed";
            get().updatePhotoProgress(photoId, "failed", 0, errorMessage);
            await uploadClient.failPhoto(photoId).catch(console.error);
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);

        // Check final status
        const finalState = get();
        if (finalState.failedPhotos > 0) {
          set({
            uploadState: "error",
            error: `${finalState.failedPhotos} of ${finalState.totalPhotos} photos failed to upload`,
          });
        } else {
          set({ uploadState: "completed", progress: 100 });
        }
      }
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
}));

