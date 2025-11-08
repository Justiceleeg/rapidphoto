"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUploadStore } from "@/lib/stores/upload-store";
import { DropZone } from "@/components/upload/DropZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { YStack, Button, Text, H1 } from "tamagui";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const store = useUploadStore();
  const {
    selectedFile,
    selectedFiles,
    uploadState,
    jobId,
    totalPhotos,
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

  // Debug logging
  useEffect(() => {
    console.log("Upload page state:", {
      selectedFile: selectedFile?.name,
      selectedFilesCount: selectedFiles.length,
      isBatchUpload,
      hasFiles,
      photoUploadsCount: Object.keys(photoUploads || {}).length,
      shouldShowBatchUI: isBatchUpload && selectedFiles.length > 0,
      uploadState,
    });
  }, [
    selectedFile,
    selectedFiles,
    isBatchUpload,
    hasFiles,
    photoUploads,
    uploadState,
  ]);

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
      <YStack minHeight="100vh" alignItems="center" justifyContent="center">
        <Text fontSize="$6">Loading...</Text>
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <YStack padding="$4" space="$4" maxWidth={800} width="100%">
      <H1 fontSize="$9" fontWeight="bold" marginBottom="$2">
        Upload {isBatchUpload ? "Photos" : "Photo"}
      </H1>

      <DropZone />

      {isBatchUpload && selectedFiles.length > 0 && (
        <YStack space="$3">
          <Text fontSize="$4" color="$gray11">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </Text>
          <Button
            onPress={handleUpload}
            disabled={
              uploadState === "uploading" ||
              uploadState === "pending" ||
              uploadState === "completed"
            }
            backgroundColor="$blue9"
            size="$4"
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
              onPress={reset}
              variant="outlined"
              borderColor="$gray8"
              size="$4"
            >
              {uploadState === "completed" ? "Upload More" : "Clear"}
            </Button>
          )}
        </YStack>
      )}

      {isBatchUpload && jobId && <UploadProgress jobId={jobId} />}

      {!isBatchUpload && selectedFile && (
        <>
          <ImagePreview />
          <YStack space="$3">
            <Button
              onPress={handleUpload}
              disabled={
                uploadState === "uploading" ||
                uploadState === "pending" ||
                uploadState === "completed"
              }
              backgroundColor="$blue9"
              size="$4"
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
                onPress={reset}
                variant="outlined"
                borderColor="$gray8"
                size="$4"
              >
                {uploadState === "completed" ? "Upload Another" : "Clear"}
              </Button>
            )}
          </YStack>
        </>
      )}
    </YStack>
  );
}
