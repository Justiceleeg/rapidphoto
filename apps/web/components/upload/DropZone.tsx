"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { YStack, Text, XStack } from "tamagui";
import { useUploadStore } from "@/lib/stores/upload-store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function DropZone() {
  const { setSelectedFile, uploadState } = useUploadStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    [setSelectedFile]
  );

  const onDropRejected = useCallback((fileRejections: any[]) => {
    const rejection = fileRejections[0];
    if (rejection.errors.some((e: any) => e.code === "file-too-large")) {
      alert("File is too large. Maximum size is 10MB.");
    } else if (rejection.errors.some((e: any) => e.code === "file-invalid-type")) {
      alert("Invalid file type. Please select an image file (jpg, png, gif, webp).");
    } else {
      alert("File rejected. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled: uploadState === "uploading" || uploadState === "pending",
  });

  return (
    <div {...getRootProps()}>
      <YStack
        borderWidth={2}
        borderStyle="dashed"
        borderColor={isDragActive ? "$blue9" : "$gray8"}
        borderRadius="$4"
        padding="$6"
        backgroundColor={isDragActive ? "$blue2" : "$gray2"}
        cursor="pointer"
        opacity={uploadState === "uploading" || uploadState === "pending" ? 0.5 : 1}
        transition="all 0.2s"
        hoverStyle={{
          borderColor: "$blue9",
          backgroundColor: "$blue2",
        }}
      >
        <input {...getInputProps()} />
      <XStack alignItems="center" justifyContent="center" space="$3">
        <Text fontSize="$6" color={isDragActive ? "$blue11" : "$gray11"}>
          {isDragActive
            ? "Drop the photo here"
            : "Drag and drop a photo here, or click to select"}
        </Text>
      </XStack>
      <Text
        fontSize="$3"
        color="$gray10"
        textAlign="center"
        marginTop="$2"
      >
        Supported formats: JPG, PNG, GIF, WEBP (max 10MB)
      </Text>
      </YStack>
    </div>
  );
}

