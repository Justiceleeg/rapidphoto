import { useEffect, useRef, useState } from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { useUploadStore } from "@/lib/stores/upload-store";
import { API_URL } from "@/lib/api-client";
import { ScrollView, View } from "react-native";
import * as Progress from "react-native-progress";

interface ProgressEvent {
  jobId: string;
  completedPhotos: number;
  failedPhotos: number;
  totalPhotos: number;
  status: "pending" | "in-progress" | "completed" | "failed";
  type?: "ping";
}

export function UploadProgress() {
  const jobId = useUploadStore((state) => state.jobId);
  const totalPhotos = useUploadStore((state) => state.totalPhotos);
  const completedPhotos = useUploadStore((state) => state.completedPhotos);
  const failedPhotos = useUploadStore((state) => state.failedPhotos);
  const photoProgresses = useUploadStore((state) => state.photoProgresses);
  
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let isActive = true;

    const connectSSE = async () => {
      try {
        setConnectionStatus("connecting");
        
        // Create a new AbortController for this connection
        abortControllerRef.current = new AbortController();
        
        const url = `${API_URL}/api/upload-progress/${jobId}`;
        
        console.log("Connecting to SSE:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
          },
          credentials: "include",
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status} ${response.statusText}`);
        }

        // React Native's fetch doesn't support streaming response bodies
        // So we'll gracefully handle this limitation
        if (!response.body) {
          console.log("SSE streaming not supported on React Native - using local progress tracking");
          setConnectionStatus("connected");
          // Note: Progress is tracked locally via the upload store
          // SSE is optional for mobile since we have client-side progress tracking
          return;
        }

        setConnectionStatus("connected");
        console.log("SSE connected successfully");

        // Read the stream (this likely won't execute on React Native)
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (isActive) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log("SSE stream ended");
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete messages (separated by double newlines)
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || ""; // Keep the incomplete message in the buffer

          for (const message of messages) {
            if (!message.trim()) continue;

            // Parse SSE message format: "data: {...}"
            const lines = message.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.substring(6);
                try {
                  const event: ProgressEvent = JSON.parse(data);
                  
                  // Skip ping events
                  if (event.type === "ping") {
                    continue;
                  }

                  console.log("Received progress event:", event);
                  
                  // Note: For now, we're just logging these events
                  // The actual progress updates are handled by the upload store
                  // during the upload process.
                } catch (error) {
                  console.error("Failed to parse SSE message:", error, data);
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("SSE connection aborted");
          return;
        }
        
        console.log("SSE not available (React Native limitation) - using local progress tracking");
        setConnectionStatus("connected");
        // Note: On React Native, we rely on client-side progress tracking
        // The upload store provides real-time progress updates without SSE
      }
    };

    connectSSE();

    // Cleanup function
    return () => {
      isActive = false;
      setConnectionStatus("disconnected");
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [jobId]);

  if (!jobId) {
    return null;
  }

  // Calculate overall progress based on individual photo progress
  const photoProgressArray = Array.from(photoProgresses.values());
  const overallProgressRaw = totalPhotos > 0 
    ? photoProgressArray.reduce((sum, photo) => {
        // Completed photos count as 100%, failed as 100% (done but failed), others use their progress
        if (photo.status === "completed" || photo.status === "failed") {
          return sum + 100;
        }
        return sum + photo.progress;
      }, 0) / totalPhotos
    : 0;
  
  // Round to nearest integer for iOS compatibility and clamp between 0-100
  const overallProgress = Math.min(100, Math.max(0, Math.round(overallProgressRaw)));

  return (
    <YStack space="$4" marginTop="$4">
      {/* Overall Progress */}
      <Card padding="$4" backgroundColor="$gray2" borderRadius="$4">
        <YStack space="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="bold">
              Upload Progress
            </Text>
            <Text fontSize="$5" color="$gray11">
              {overallProgress}%
            </Text>
          </XStack>
          
          <Progress.Bar 
            progress={overallProgress / 100} 
            width={null}
            height={12}
            color="#3b82f6"
            unfilledColor="#e5e7eb"
            borderRadius={6}
            borderWidth={0}
          />

          <XStack justifyContent="space-between">
            <Text fontSize="$3" color="$gray11">
              Total: {totalPhotos}
            </Text>
            <Text fontSize="$3" color="$green10">
              Completed: {completedPhotos}
            </Text>
            <Text fontSize="$3" color="$red10">
              Failed: {failedPhotos}
            </Text>
          </XStack>

          {connectionStatus !== "connected" && (
            <Text fontSize="$2" color="$orange10">
              {connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
            </Text>
          )}
        </YStack>
      </Card>

      {/* Individual Photo Progress */}
      {photoProgressArray.length > 0 && (
        <Card padding="$4" backgroundColor="$gray2" borderRadius="$4">
          <YStack space="$3">
            <Text fontSize="$5" fontWeight="bold" marginBottom="$2">
              Photo Details
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <YStack space="$2">
                {photoProgressArray.map((photo) => (
                  <Card
                    key={photo.photoId}
                    padding="$3"
                    backgroundColor="$background"
                    borderRadius="$3"
                  >
                    <YStack space="$2">
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$3" flex={1} numberOfLines={1}>
                          {photo.filename}
                        </Text>
                        <Text
                          fontSize="$2"
                          fontWeight="bold"
                          color={
                            photo.status === "completed"
                              ? "$green10"
                              : photo.status === "failed"
                              ? "$red10"
                              : photo.status === "uploading"
                              ? "$blue10"
                              : "$gray10"
                          }
                        >
                          {photo.status.toUpperCase()}
                        </Text>
                      </XStack>
                      
                      {photo.status === "uploading" && (
                        <Progress.Bar 
                          progress={Math.round(photo.progress) / 100} 
                          width={null}
                          height={6}
                          color="#3b82f6"
                          unfilledColor="#e5e7eb"
                          borderRadius={3}
                          borderWidth={0}
                        />
                      )}
                      
                      {photo.error && (
                        <Text fontSize="$2" color="$red10">
                          {photo.error}
                        </Text>
                      )}
                    </YStack>
                  </Card>
                ))}
              </YStack>
            </ScrollView>
          </YStack>
        </Card>
      )}
    </YStack>
  );
}
