"use client";

import { useMemo } from "react";
import { YStack, XStack, Text, Image, Button } from "tamagui";
import { useUploadStore } from "@/lib/stores/upload-store";

export function ImagePreview() {
  const { selectedFile, uploadState, progress, error } = useUploadStore();

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  if (!selectedFile) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <YStack
      borderWidth={1}
      borderColor="$gray8"
      borderRadius="$4"
      padding="$4"
      space="$4"
      backgroundColor="$background"
    >
      <XStack alignItems="center" space="$4">
        {previewUrl && (
          <Image
            source={{ uri: previewUrl }}
            width={120}
            height={120}
            borderRadius="$3"
            objectFit="cover"
          />
        )}
        <YStack flex={1} space="$2">
          <Text fontSize="$5" fontWeight="600">
            {selectedFile.name}
          </Text>
          <Text fontSize="$3" color="$gray11">
            {formatFileSize(selectedFile.size)}
          </Text>
          {uploadState === "pending" && (
            <Text fontSize="$3" color="$blue11">
              Preparing upload...
            </Text>
          )}
          {uploadState === "uploading" && (
            <YStack space="$2">
              <Text fontSize="$3" color="$blue11">
                Uploading... {progress}%
              </Text>
              <YStack
                height={4}
                backgroundColor="$gray4"
                borderRadius="$2"
                overflow="hidden"
              >
                <YStack
                  height="100%"
                  backgroundColor="$blue9"
                  width={`${progress}%`}
                  transition="width 0.3s"
                />
              </YStack>
            </YStack>
          )}
          {uploadState === "completed" && (
            <Text fontSize="$3" color="$green11">
              Upload completed successfully!
            </Text>
          )}
          {uploadState === "error" && error && (
            <Text fontSize="$3" color="$red11">
              Error: {error}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}

