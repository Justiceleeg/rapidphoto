import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button, YStack, Text } from "tamagui";
import { Alert } from "react-native";

interface ImagePickerProps {
  onImageSelected: (uri: string, filename: string, mimeType: string, fileSize: number) => void;
}

export function ImagePickerComponent({ onImageSelected }: ImagePickerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "We need camera and photo library permissions to upload photos."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onImageSelected(
          asset.uri,
          asset.fileName || `photo_${Date.now()}.jpg`,
          asset.mimeType || "image/jpeg",
          asset.fileSize || 0
        );
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onImageSelected(
          asset.uri,
          asset.fileName || `photo_${Date.now()}.jpg`,
          asset.mimeType || "image/jpeg",
          asset.fileSize || 0
        );
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack space="$3">
      <Button
        onPress={pickImage}
        disabled={isLoading}
        backgroundColor="$blue9"
        size="$4"
      >
        {isLoading ? "Loading..." : "Choose from Library"}
      </Button>
      <Button
        onPress={takePhoto}
        disabled={isLoading}
        variant="outlined"
        borderColor="$gray8"
        size="$4"
      >
        {isLoading ? "Loading..." : "Take Photo"}
      </Button>
    </YStack>
  );
}

