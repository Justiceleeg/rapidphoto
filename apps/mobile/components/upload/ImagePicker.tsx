import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Alert, StyleSheet } from "react-native";

interface ImagePickerProps {
  onImageSelected?: (uri: string, filename: string, mimeType: string, fileSize: number) => void;
  onImagesSelected?: (images: Array<{ uri: string; filename: string; mimeType: string; fileSize: number }>) => void;
  allowMultiple?: boolean;
}

export function ImagePickerComponent({ 
  onImageSelected, 
  onImagesSelected, 
  allowMultiple = false 
}: ImagePickerProps) {
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
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: allowMultiple,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (allowMultiple && onImagesSelected) {
          // Handle multiple selection
          const images = result.assets.map((asset) => ({
            uri: asset.uri,
            filename: asset.fileName || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
            mimeType: asset.mimeType || "image/jpeg",
            fileSize: asset.fileSize || 0,
          }));
          onImagesSelected(images);
        } else if (onImageSelected) {
          // Handle single selection
          const asset = result.assets[0];
          onImageSelected(
            asset.uri,
            asset.fileName || `photo_${Date.now()}.jpg`,
            asset.mimeType || "image/jpeg",
            asset.fileSize || 0
          );
        }
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
        mediaTypes: ["images"],
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
    <View style={styles.container}>
      <Button
        onPress={pickImage}
        disabled={isLoading}
        loading={isLoading}
        style={styles.button}
      >
        {isLoading ? "Loading..." : allowMultiple ? "Choose Photos from Library" : "Choose from Library"}
      </Button>
      {!allowMultiple && (
        <Button
          onPress={takePhoto}
          disabled={isLoading}
          variant="outline"
          style={styles.button}
        >
          {isLoading ? "Loading..." : "Take Photo"}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
