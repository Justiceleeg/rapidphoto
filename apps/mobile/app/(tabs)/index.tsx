import { useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useUploadStore } from "@/lib/stores/upload-store";
import { ImagePickerComponent } from "@/components/upload/ImagePicker";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [isBatchMode, setIsBatchMode] = useState(false);
  const {
    selectedFile,
    selectedFiles,
    uploadState,
    upload,
    uploadBatch,
    reset,
    setSelectedFile,
    setSelectedFiles,
    error,
  } = useUploadStore();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    if (uploadState === "completed") {
      const message = isBatchMode
        ? `Successfully uploaded ${selectedFiles.length} photos!`
        : "Photo uploaded successfully!";
      Alert.alert("Success", message);
      // Reset after a delay to show success message
      setTimeout(() => {
        reset();
        setIsBatchMode(false);
      }, 2000);
    } else if (uploadState === "error" && error) {
      Alert.alert("Upload Failed", error);
    }
  }, [uploadState, error, reset, isBatchMode, selectedFiles.length]);

  const handleImageSelected = (
    uri: string,
    filename: string,
    mimeType: string,
    fileSize: number
  ) => {
    setSelectedFile({ uri, filename, mimeType, fileSize });
  };

  const handleImagesSelected = (
    images: Array<{ uri: string; filename: string; mimeType: string; fileSize: number }>
  ) => {
    setSelectedFiles(images);
  };

  const handleUpload = async () => {
    if (isBatchMode) {
      if (!selectedFiles || selectedFiles.length === 0) {
        Alert.alert("Error", "Please select files first");
        return;
      }
      try {
        await uploadBatch();
      } catch (error) {
        console.error("Batch upload error:", error);
      }
    } else {
      if (!selectedFile) {
        Alert.alert("Error", "Please select a file first");
        return;
      }
      try {
        await upload();
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const hasFiles = isBatchMode ? selectedFiles.length > 0 : selectedFile !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading" style={styles.title}>
          Upload Photo{isBatchMode ? "s" : ""}
        </Text>
        <Button
          onPress={handleSignOut}
          variant="ghost"
          size="sm"
          animation={false}
        >
          Logout
        </Button>
      </View>

      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <Button
          onPress={() => {
            setIsBatchMode(false);
            reset();
          }}
          variant={!isBatchMode ? "default" : "secondary"}
          style={[styles.modeButton, !isBatchMode && styles.modeButtonActive]}
          animation={false}
        >
          Single Upload
        </Button>
        <Button
          onPress={() => {
            setIsBatchMode(true);
            reset();
          }}
          variant={isBatchMode ? "default" : "secondary"}
          style={[styles.modeButton, isBatchMode && styles.modeButtonActive]}
          animation={false}
        >
          Batch Upload
        </Button>
      </View>

      {/* Image Picker */}
      <ImagePickerComponent
        onImageSelected={handleImageSelected}
        onImagesSelected={handleImagesSelected}
        allowMultiple={isBatchMode}
      />

      {/* Selected Files Info */}
      {isBatchMode && selectedFiles.length > 0 && (
        <View style={styles.selectedInfo}>
          <Text variant="body" style={styles.selectedText}>
            {selectedFiles.length} photo{selectedFiles.length !== 1 ? "s" : ""} selected
          </Text>
        </View>
      )}

      {/* Preview for single upload */}
      {!isBatchMode && selectedFile && (
        <ImagePreview />
      )}

      {/* Upload Controls */}
      {hasFiles && (
        <View style={styles.uploadControls}>
          <Button
            onPress={handleUpload}
            disabled={
              uploadState === "uploading" ||
              uploadState === "pending" ||
              uploadState === "completed"
            }
            loading={uploadState === "uploading" || uploadState === "pending"}
            style={styles.uploadButton}
            animation={false}
          >
            {uploadState === "uploading"
              ? "Uploading..."
              : uploadState === "pending"
              ? "Preparing..."
              : uploadState === "completed"
              ? "Upload Complete"
              : isBatchMode
              ? `Upload ${selectedFiles.length} Photos`
              : "Upload Photo"}
          </Button>
          {(uploadState === "idle" ||
            uploadState === "error" ||
            uploadState === "completed") && (
            <Button
              onPress={() => {
                reset();
              }}
              variant="outline"
              style={styles.clearButton}
              animation={false}
            >
              {uploadState === "completed" ? "Upload Another" : "Clear"}
            </Button>
          )}
        </View>
      )}

      {/* Progress Display for Batch Uploads */}
      {isBatchMode && uploadState !== "idle" && <UploadProgress />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  modeToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
  },
  modeButtonActive: {
    // Active state handled by variant
  },
  selectedInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f2f2f7",
    borderRadius: 8,
  },
  selectedText: {
    fontWeight: "bold",
  },
  uploadControls: {
    gap: 12,
    marginTop: 16,
  },
  uploadButton: {
    width: "100%",
  },
  clearButton: {
    width: "100%",
  },
});
