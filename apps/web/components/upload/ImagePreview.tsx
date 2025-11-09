"use client";

import { useMemo } from "react";
import { useUploadStore } from "@/lib/stores/upload-store";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
        {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-30 h-30 rounded-md object-cover"
              style={{ width: 120, height: 120 }}
          />
        )}
          <div className="flex-1 space-y-2">
            <p className="text-lg font-semibold">
            {selectedFile.name}
            </p>
            <p className="text-sm text-muted-foreground">
            {formatFileSize(selectedFile.size)}
            </p>
          {uploadState === "pending" && (
              <p className="text-sm text-primary">
              Preparing upload...
              </p>
          )}
          {uploadState === "uploading" && (
              <div className="space-y-2">
                <p className="text-sm text-primary">
                Uploading... {progress}%
                </p>
                <Progress value={progress} className="h-1" />
              </div>
          )}
          {uploadState === "completed" && (
              <p className="text-sm text-green-600">
              Upload completed successfully!
              </p>
          )}
          {uploadState === "error" && error && (
              <p className="text-sm text-destructive">
              Error: {error}
              </p>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

