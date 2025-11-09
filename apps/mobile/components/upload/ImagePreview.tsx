import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { useUploadStore } from "@/lib/stores/upload-store";
import { Image, StyleSheet } from "react-native";
import { Progress } from "@/components/ui/progress-simple";

export function ImagePreview() {
  const { selectedFile, uploadState, progress, error } = useUploadStore();

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
    <View style={styles.container}>
      <View style={styles.content}>
        {selectedFile.uri && (
          <Image
            source={{ uri: selectedFile.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.info}>
          <Text variant="body" style={styles.filename}>
            {selectedFile.filename}
          </Text>
          <Text variant="caption" style={styles.fileSize}>
            {formatFileSize(selectedFile.fileSize)}
          </Text>
          {uploadState === "pending" && (
            <Text variant="caption" style={styles.statusPending}>
              Preparing upload...
            </Text>
          )}
          {uploadState === "uploading" && (
            <View style={styles.uploadingContainer}>
              <Text variant="caption" style={styles.statusUploading}>
                Uploading... {progress}%
              </Text>
              <Progress value={progress} style={styles.progress} />
            </View>
          )}
          {uploadState === "completed" && (
            <Text variant="caption" style={styles.statusCompleted}>
              Upload completed successfully!
            </Text>
          )}
          {uploadState === "error" && error && (
            <Text variant="caption" style={styles.statusError}>
              Error: {error}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#c6c6c8",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    backgroundColor: "#fff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  filename: {
    fontWeight: "600",
  },
  fileSize: {
    color: "#71717a",
  },
  statusPending: {
    color: "#3b82f6",
  },
  uploadingContainer: {
    gap: 8,
  },
  statusUploading: {
    color: "#3b82f6",
  },
  progress: {
    height: 4,
  },
  statusCompleted: {
    color: "#22c55e",
  },
  statusError: {
    color: "#ef4444",
  },
});
