import { useRouter } from "expo-router";
import { YStack, Text, H1, Button, XStack } from "tamagui";
import { authClient } from "@/lib/auth-client";
import { useUploadStore } from "@/lib/stores/upload-store";
import { ImagePickerComponent } from "@/components/upload/ImagePicker";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

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
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <H1 fontSize="$9" fontWeight="bold" marginBottom="$4">
        Upload Photo{isBatchMode ? "s" : ""}
      </H1>

      {/* Mode Toggle */}
      <XStack space="$3" marginBottom="$4">
        <Button
          onPress={() => {
            setIsBatchMode(false);
            reset();
          }}
          backgroundColor={!isBatchMode ? "$blue9" : "$gray5"}
          color={!isBatchMode ? "$white" : "$gray11"}
          flex={1}
          size="$4"
        >
          Single Upload
        </Button>
        <Button
          onPress={() => {
            setIsBatchMode(true);
            reset();
          }}
          backgroundColor={isBatchMode ? "$blue9" : "$gray5"}
          color={isBatchMode ? "$white" : "$gray11"}
          flex={1}
          size="$4"
        >
          Batch Upload
        </Button>
      </XStack>

      {/* Image Picker */}
      <ImagePickerComponent
        onImageSelected={handleImageSelected}
        onImagesSelected={handleImagesSelected}
        allowMultiple={isBatchMode}
      />

      {/* Selected Files Info */}
      {isBatchMode && selectedFiles.length > 0 && (
        <YStack marginTop="$4" padding="$3" backgroundColor="$gray2" borderRadius="$4">
          <Text fontSize="$4" fontWeight="bold">
            {selectedFiles.length} photo{selectedFiles.length !== 1 ? "s" : ""} selected
          </Text>
        </YStack>
      )}

      {/* Preview for single upload */}
      {!isBatchMode && selectedFile && (
        <ImagePreview />
      )}

      {/* Upload Controls */}
      {hasFiles && (
        <YStack space="$3" marginTop="$4">
          <Button
            onPress={handleUpload}
            disabled={
              uploadState === "uploading" ||
              uploadState === "pending" ||
              uploadState === "completed"
            }
            backgroundColor="$blue9"
            size="$4"
          >
            {uploadState === "uploading"
              ? isBatchMode
                ? "Uploading..."
                : "Uploading..."
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
              variant="outlined"
              borderColor="$gray8"
              size="$4"
            >
              {uploadState === "completed" ? "Upload Another" : "Clear"}
            </Button>
          )}
        </YStack>
      )}

      {/* Progress Display for Batch Uploads */}
      {isBatchMode && uploadState !== "idle" && <UploadProgress />}
    </YStack>
  );
}
