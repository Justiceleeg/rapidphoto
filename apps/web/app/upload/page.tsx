"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUploadStore } from "@/lib/stores/upload-store";
import { useUploadCacheInvalidation } from "@/lib/hooks/use-upload-cache-invalidation";
import { DropZone } from "@/components/upload/DropZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Set up cache invalidation for uploads
  useUploadCacheInvalidation();

  const store = useUploadStore();
  const {
    selectedFile,
    selectedFiles,
    uploadState,
    jobId,
    completedPhotos,
    failedPhotos,
    photoUploads,
    upload,
    uploadBatch,
    reset,
    error,
  } = store;

  const isBatchUpload = selectedFiles.length > 1;
  const hasFiles = selectedFile !== null || selectedFiles.length > 0;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (uploadState === "completed") {
      if (isBatchUpload) {
        const successCount = completedPhotos;
        const failCount = failedPhotos;
        if (failCount === 0) {
          toast.success(`All ${successCount} photos uploaded successfully!`);
        } else {
          toast.success(
            `${successCount} photos uploaded successfully, ${failCount} failed.`
          );
        }
      } else {
        toast.success("Photo uploaded successfully!");
      }
      // Reset after a delay to show success message
      setTimeout(() => {
        reset();
      }, 3000);
    } else if (uploadState === "error" && error) {
      toast.error(`Upload failed: ${error}`);
    }
  }, [uploadState, error, reset, isBatchUpload, completedPhotos, failedPhotos]);

  const handleUpload = async () => {
    if (isBatchUpload) {
      if (selectedFiles.length === 0) {
        toast.error("Please select files first");
        return;
      }
      try {
        await uploadBatch();
      } catch (error) {
        console.error("Batch upload error:", error);
      }
    } else {
      if (!selectedFile) {
        toast.error("Please select a file first");
        return;
      }
      try {
        await upload();
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-y-4 max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-2">
          Upload {isBatchUpload ? "Photos" : "Photo"}
        </h1>

        <DropZone />

        {isBatchUpload && selectedFiles.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
            <Button
              onClick={handleUpload}
              disabled={
                uploadState === "uploading" ||
                uploadState === "pending" ||
                uploadState === "completed"
              }
              className="w-full"
            >
              {uploadState === "uploading"
                ? "Uploading..."
                : uploadState === "pending"
                ? "Preparing..."
                : uploadState === "completed"
                ? "Upload Complete"
                : `Upload ${selectedFiles.length} Photos`}
            </Button>
            {(uploadState === "idle" ||
              uploadState === "error" ||
              uploadState === "completed") && (
              <Button
                onClick={reset}
                variant="outline"
                className="w-full"
              >
                {uploadState === "completed" ? "Upload More" : "Clear"}
              </Button>
            )}
          </div>
        )}

        {isBatchUpload && jobId && <UploadProgress jobId={jobId} />}

        {!isBatchUpload && selectedFile && (
          <>
            <ImagePreview />
            <div className="space-y-3">
              <Button
                onClick={handleUpload}
                disabled={
                  uploadState === "uploading" ||
                  uploadState === "pending" ||
                  uploadState === "completed"
                }
                className="w-full"
              >
                {uploadState === "uploading"
                  ? "Uploading..."
                  : uploadState === "pending"
                  ? "Preparing..."
                  : uploadState === "completed"
                  ? "Upload Complete"
                  : "Upload Photo"}
              </Button>
              {(uploadState === "idle" ||
                uploadState === "error" ||
                uploadState === "completed") && (
                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full"
                >
                  {uploadState === "completed" ? "Upload Another" : "Clear"}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

