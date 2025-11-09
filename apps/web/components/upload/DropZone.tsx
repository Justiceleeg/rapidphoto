"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "@/lib/stores/upload-store";
import { cn } from "@/lib/utils";

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
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/50",
          (uploadState === "uploading" || uploadState === "pending") && "opacity-50",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center">
          <p className={cn(
            "text-base",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )}>
          {isDragActive
            ? "Drop the photos here"
            : "Drag and drop photos here, or click to select (up to 100)"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
        Supported formats: JPG, PNG, GIF, WEBP (max 10MB per file, up to 100 files)
        </p>
      </div>
    </div>
  );
}

