"use client";

import { useEffect, useState, useRef } from "react";
import { YStack, XStack, Text, Progress, Card } from "tamagui";
import { useUploadStore } from "@/lib/stores/upload-store";

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
    <Card
      padding="$4"
      backgroundColor="$gray2"
      borderWidth={1}
      borderColor="$gray8"
      borderRadius="$4"
    >
      <YStack space="$4">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize="$6" fontWeight="bold">
            Upload Progress
          </Text>
          <XStack alignItems="center" space="$2">
            <Text
              fontSize="$3"
              color={isConnected ? "$green10" : "$gray10"}
            >
              {isConnected ? "● Connected" : "○ Disconnected"}
            </Text>
          </XStack>
        </XStack>

        <YStack space="$2">
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$4" color="$gray11">
              Overall Progress
            </Text>
            <Text fontSize="$4" fontWeight="bold">
              {currentProgress.completedPhotos + currentProgress.failedPhotos} /{" "}
              {currentProgress.totalPhotos}
            </Text>
          </XStack>
          <Progress
            value={progressPercentage}
            max={100}
            backgroundColor="$gray6"
            borderColor="$gray8"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor="$blue9"
            />
          </Progress>
        </YStack>

        <XStack space="$4" justifyContent="space-around">
          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$green10">
              {currentProgress.completedPhotos}
            </Text>
            <Text fontSize="$3" color="$gray10">
              Completed
            </Text>
          </YStack>
          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$red10">
              {currentProgress.failedPhotos}
            </Text>
            <Text fontSize="$3" color="$gray10">
              Failed
            </Text>
          </YStack>
          <YStack alignItems="center">
            <Text fontSize="$5" fontWeight="bold" color="$gray11">
              {currentProgress.totalPhotos -
                currentProgress.completedPhotos -
                currentProgress.failedPhotos}
            </Text>
            <Text fontSize="$3" color="$gray10">
              Pending
            </Text>
          </YStack>
        </XStack>

        {photoUploadsArray.length > 0 && (
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="bold" marginTop="$2">
              Individual Photos
            </Text>
            <YStack space="$2" maxHeight={300} overflow="scroll">
              {photoUploadsArray.map((upload, index) => {
                const statusColor =
                  upload.status === "completed"
                    ? "$green10"
                    : upload.status === "failed"
                    ? "$red10"
                    : upload.status === "uploading"
                    ? "$blue10"
                    : "$gray10";

                const statusIcon =
                  upload.status === "completed"
                    ? "✓"
                    : upload.status === "failed"
                    ? "✗"
                    : upload.status === "uploading"
                    ? "⟳"
                    : "○";

                return (
                  <Card
                    key={upload.file.name}
                    padding="$2"
                    backgroundColor="$gray1"
                    borderWidth={1}
                    borderColor="$gray7"
                    borderRadius="$2"
                  >
                    <XStack alignItems="center" space="$2">
                      <Text fontSize="$4" color={statusColor}>
                        {statusIcon}
                      </Text>
                      <YStack flex={1} space="$1">
                        <Text fontSize="$3" numberOfLines={1}>
                          {upload.file.name}
                        </Text>
                        {upload.error && (
                          <Text fontSize="$2" color="$red10">
                            {upload.error}
                          </Text>
                        )}
                      </YStack>
                      <Text fontSize="$2" color="$gray10">
                        {upload.status}
                      </Text>
                    </XStack>
                  </Card>
                );
              })}
            </YStack>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}

