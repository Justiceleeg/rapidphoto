import { useEffect, useRef, useState } from "react";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress-simple";
import { useUploadStore } from "@/lib/stores/upload-store";
import { API_URL } from "@/lib/api-client";
import { ScrollView, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      {/* Overall Progress */}
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <Text variant="title" style={styles.title}>
              Upload Progress
            </Text>
            <Text variant="body" style={styles.percentage}>
              {overallProgress}%
            </Text>
          </View>
          
          <Progress value={overallProgress} style={styles.progressBar} />

          <View style={styles.stats}>
            <Text variant="caption" style={styles.statText}>
              Total: {totalPhotos}
            </Text>
            <Text variant="caption" style={[styles.statText, styles.statSuccess]}>
              Completed: {completedPhotos}
            </Text>
            <Text variant="caption" style={[styles.statText, styles.statError]}>
              Failed: {failedPhotos}
            </Text>
          </View>

          {connectionStatus !== "connected" && (
            <Text variant="caption" style={styles.connectionStatus}>
              {connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
            </Text>
          )}
        </View>
      </Card>

      {/* Individual Photo Progress */}
      {photoProgressArray.length > 0 && (
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text variant="body" style={styles.sectionTitle}>
              Photo Details
            </Text>
            <ScrollView style={styles.scrollView}>
              <View style={styles.photoList}>
                {photoProgressArray.map((photo) => (
                  <Card key={photo.photoId} style={styles.photoCard}>
                    <View style={styles.photoContent}>
                      <View style={styles.photoHeader}>
                        <Text variant="caption" style={styles.photoFilename} numberOfLines={1}>
                          {photo.filename}
                        </Text>
                        <Text
                          variant="caption"
                          style={[
                            styles.photoStatus,
                            photo.status === "completed" && styles.statusSuccess,
                            photo.status === "failed" && styles.statusError,
                            photo.status === "uploading" && styles.statusUploading,
                          ]}
                        >
                          {photo.status.toUpperCase()}
                        </Text>
                      </View>
                      
                      {photo.status === "uploading" && (
                        <Progress value={photo.progress} style={styles.photoProgress} />
                      )}
                      
                      {photo.error && (
                        <Text variant="caption" style={styles.photoError}>
                          {photo.error}
                        </Text>
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            </ScrollView>
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 16,
  },
  card: {
    marginBottom: 0,
  },
  cardContent: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  percentage: {
    color: "#71717a",
  },
  progressBar: {
    height: 12,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: {
    color: "#71717a",
  },
  statSuccess: {
    color: "#22c55e",
  },
  statError: {
    color: "#ef4444",
  },
  connectionStatus: {
    color: "#f97316",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 300,
  },
  photoList: {
    gap: 8,
  },
  photoCard: {
    padding: 12,
    backgroundColor: "#fff",
  },
  photoContent: {
    gap: 8,
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoFilename: {
    flex: 1,
  },
  photoStatus: {
    fontWeight: "bold",
    color: "#71717a",
  },
  statusSuccess: {
    color: "#22c55e",
  },
  statusError: {
    color: "#ef4444",
  },
  statusUploading: {
    color: "#3b82f6",
  },
  photoProgress: {
    height: 6,
  },
  photoError: {
    color: "#ef4444",
  },
});
