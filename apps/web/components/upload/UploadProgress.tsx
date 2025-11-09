"use client";

import { useEffect, useState, useRef } from "react";
import { useUploadStore } from "@/lib/stores/upload-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressEvent {
  jobId: string;
  completedPhotos: number;
  failedPhotos: number;
  totalPhotos: number;
  status: string;
  type?: string;
}

interface UploadProgressProps {
  jobId: string | null;
}

export function UploadProgress({ jobId }: UploadProgressProps) {
  const { photoUploads, totalPhotos, completedPhotos, failedPhotos } =
    useUploadStore();
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!jobId) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const sseUrl = `${apiUrl}/api/upload-progress/${jobId}`;

    console.log("Connecting to SSE endpoint:", sseUrl);

    // Create EventSource connection
    const eventSource = new EventSource(sseUrl, {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ProgressEvent;
        console.log("SSE progress update:", data);

        // Ignore ping messages
        if (data.type === "ping") {
          return;
        }

        setProgress(data);
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setIsConnected(false);
      // EventSource will automatically try to reconnect
    };

    // Cleanup on unmount
    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [jobId]);

  if (!jobId) {
    return null;
  }

  const currentProgress = progress || {
    completedPhotos,
    failedPhotos,
    totalPhotos,
    status: "pending",
  };

  const progressPercentage =
    currentProgress.totalPhotos > 0
      ? ((currentProgress.completedPhotos + currentProgress.failedPhotos) /
          currentProgress.totalPhotos) *
        100
      : 0;

  const photoUploadsArray = Object.values(photoUploads);

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upload Progress</CardTitle>
          <p className={cn(
            "text-sm",
            isConnected ? "text-green-600" : "text-muted-foreground"
          )}>
            {isConnected ? "● Connected" : "○ Disconnected"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-sm font-semibold">
              {currentProgress.completedPhotos + currentProgress.failedPhotos} /{" "}
              {currentProgress.totalPhotos}
            </p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex justify-around gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              {currentProgress.completedPhotos}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-destructive">
              {currentProgress.failedPhotos}
            </p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-muted-foreground">
              {currentProgress.totalPhotos -
                currentProgress.completedPhotos -
                currentProgress.failedPhotos}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {photoUploadsArray.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold mt-2">Individual Photos</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {photoUploadsArray.map((upload) => {
                const statusColor =
                  upload.status === "completed"
                    ? "text-green-600"
                    : upload.status === "failed"
                    ? "text-destructive"
                    : upload.status === "uploading"
                    ? "text-primary"
                    : "text-muted-foreground";

                const statusIcon =
                  upload.status === "completed"
                    ? "✓"
                    : upload.status === "failed"
                    ? "✗"
                    : upload.status === "uploading"
                    ? "⟳"
                    : "○";

                return (
                  <Card key={upload.file.name} className="p-2 bg-background">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", statusColor)}>
                        {statusIcon}
                      </p>
                      <div className="flex-1 space-y-1 min-w-0">
                        <p className="text-xs truncate">
                          {upload.file.name}
                        </p>
                        {upload.error && (
                          <p className="text-xs text-destructive">
                            {upload.error}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {upload.status}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

