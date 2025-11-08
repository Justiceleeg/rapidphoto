"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { YStack, Text, XStack } from "tamagui";
import { useUploadStore } from "@/lib/stores/upload-store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 100;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function DropZone() {
  const { setSelectedFile, setSelectedFiles, uploadState } = useUploadStore();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      console.log("onDrop called:", {
        acceptedCount: acceptedFiles.length,
        rejectedCount: fileRejections.length,
      });

      if (fileRejections.length > 0) {
        console.warn("Some files were rejected:", fileRejections);
        const rejectionMessages = fileRejections.map((rejection) => {
          const errors = rejection.errors.map((e: any) => e.code).join(", ");
          return `${rejection.file.name}: ${errors}`;
        });
        console.warn("Rejection details:", rejectionMessages);
      }

      if (acceptedFiles.length > 0) {
        console.log(`Processing ${acceptedFiles.length} accepted file(s)`);
        if (acceptedFiles.length === 1) {
          // Single file - use backward compatible method
          console.log("Setting single file:", acceptedFiles[0].name);
          setSelectedFile(acceptedFiles[0]);
        } else {
          // Multiple files - use batch method
          console.log(`Setting ${acceptedFiles.length} files for batch upload`);
          setSelectedFiles(acceptedFiles);
        }
      } else {
        console.warn("No files were accepted");
        if (fileRejections.length > 0) {
          const firstRejection = fileRejections[0];
          const errorCode = firstRejection.errors[0]?.code;
          if (errorCode === "too-many-files") {
            alert(`Too many files. Maximum is ${MAX_FILES} files.`);
          } else if (errorCode === "file-too-large") {
            alert("Some files are too large. Maximum size is 10MB per file.");
          } else if (errorCode === "file-invalid-type") {
            alert("Some files have invalid types. Please select image files (jpg, png, gif, webp).");
          } else {
            alert(`Files were rejected: ${errorCode || "Unknown error"}`);
          }
        }
      }
    },
    [setSelectedFile, setSelectedFiles]
  );

  const onDropRejected = useCallback((fileRejections: any[]) => {
    console.warn("onDropRejected called:", fileRejections.length, "rejections");
    fileRejections.forEach((rejection) => {
      console.warn("Rejected file:", rejection.file.name, "errors:", rejection.errors);
    });

    const firstRejection = fileRejections[0];
    if (!firstRejection) return;

    const errorCode = firstRejection.errors[0]?.code;
    if (errorCode === "too-many-files") {
      alert(`Too many files. Maximum is ${MAX_FILES} files.`);
    } else if (errorCode === "file-too-large") {
      alert("Some files are too large. Maximum size is 10MB per file.");
    } else if (errorCode === "file-invalid-type") {
      alert("Some files have invalid types. Please select image files (jpg, png, gif, webp).");
    } else {
      alert(`Files were rejected: ${errorCode || "Unknown error"}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    multiple: true,
    disabled: uploadState === "uploading" || uploadState === "pending",
    noClick: false,
    noKeyboard: false,
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
            ? "Drop the photos here"
            : "Drag and drop photos here, or click to select (up to 100)"}
        </Text>
      </XStack>
      <Text
        fontSize="$3"
        color="$gray10"
        textAlign="center"
        marginTop="$2"
      >
        Supported formats: JPG, PNG, GIF, WEBP (max 10MB per file, up to 100 files)
      </Text>
      </YStack>
    </div>
  );
}

