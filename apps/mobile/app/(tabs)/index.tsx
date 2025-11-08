import { useRouter } from "expo-router";
import { YStack, Text, H1, Button } from "tamagui";
import { authClient } from "@/lib/auth-client";
import { useUploadStore } from "@/lib/stores/upload-store";
import { ImagePickerComponent } from "@/components/upload/ImagePicker";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const {
    selectedFile,
    uploadState,
    upload,
    reset,
    setSelectedFile,
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
      Alert.alert("Success", "Photo uploaded successfully!");
      // Reset after a delay to show success message
      setTimeout(() => {
        reset();
      }, 2000);
    } else if (uploadState === "error" && error) {
      Alert.alert("Upload Failed", error);
    }
  }, [uploadState, error, reset]);

  const handleImageSelected = (
    uri: string,
    filename: string,
    mimeType: string,
    fileSize: number
  ) => {
    setSelectedFile({ uri, filename, mimeType, fileSize });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    try {
      await upload();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <H1 fontSize="$9" fontWeight="bold" marginBottom="$4">
        Upload Photo
      </H1>

      <ImagePickerComponent onImageSelected={handleImageSelected} />

      {selectedFile && (
        <>
          <ImagePreview />
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
                ? "Uploading..."
                : uploadState === "pending"
                ? "Preparing..."
                : uploadState === "completed"
                ? "Upload Complete"
                : "Upload Photo"}
            </Button>
            {(uploadState === "idle" ||
              uploadState === "error" ||
              uploadState === "completed") && (
              <Button
                onPress={reset}
                variant="outlined"
                borderColor="$gray8"
                size="$4"
              >
                {uploadState === "completed" ? "Upload Another" : "Clear"}
              </Button>
            )}
          </YStack>
        </>
      )}
    </YStack>
  );
}
