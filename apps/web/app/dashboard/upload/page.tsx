"use client";

import { useEffect } from "react";
import { useUploadStore } from "@/lib/stores/upload-store";
import { DropZone } from "@/components/upload/DropZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { YStack, Button, H1 } from "tamagui";
import { toast } from "sonner";

export default function UploadPage() {
  const {
    selectedFile,
    uploadState,
    upload,
    reset,
    error,
  } = useUploadStore();

  useEffect(() => {
    if (uploadState === "completed") {
      toast.success("Photo uploaded successfully!");
      // Reset after a delay to show success message
      setTimeout(() => {
        reset();
      }, 2000);
    } else if (uploadState === "error" && error) {
      toast.error(`Upload failed: ${error}`);
    }
  }, [uploadState, error, reset]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      console.log("Starting upload...");
      await upload();
    } catch (error) {
      console.error("Upload error in handleUpload:", error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <YStack padding="$4" space="$4" maxWidth={800} width="100%">
      <H1 fontSize="$9" fontWeight="bold" marginBottom="$2">
        Upload Photo
      </H1>

      <DropZone />

      {selectedFile && (
        <>
          <ImagePreview />
          <YStack space="$3">
            <Button
              onPress={handleUpload}
              disabled={
                !selectedFile ||
                uploadState === "uploading" ||
                uploadState === "pending" ||
                uploadState === "completed"
              }
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

