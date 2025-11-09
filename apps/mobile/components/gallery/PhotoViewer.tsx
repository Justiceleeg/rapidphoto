import { useState } from "react";
import { Modal, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, Linking } from "react-native";
import { Photo } from "@rapidphoto/api-client";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useColor } from "@/hooks/useColor";
import { X, Trash2, Download, Sparkles, Check } from "lucide-react-native";
import { TagInput } from "./TagInput";

interface PhotoViewerProps {
  photo: Photo | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (photoId: string) => void;
  onUpdateTags?: (photoId: string, tags: string[]) => void;
  onAcceptTag?: (photoId: string, tag: string) => void;
  onRejectTag?: (photoId: string, tag: string) => void;
}

export function PhotoViewer({
  photo,
  open,
  onClose,
  onDelete,
  onUpdateTags,
  onAcceptTag,
  onRejectTag,
}: PhotoViewerProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const backgroundColor = useColor("background");
  const cardColor = useColor("card");
  const foregroundColor = useColor("foreground");
  const mutedForegroundColor = useColor("mutedForeground");
  const borderColor = useColor("border");
  const destructiveColor = useColor("destructive");

  if (!photo) return null;

  // Get first 3 AI-suggested tags
  const suggestedTags = photo.suggestedTags?.slice(0, 3) || [];

  const handleDownload = async () => {
    if (!photo.url) {
      Alert.alert("Error", "Photo URL not available");
      return;
    }

    try {
      // Open the photo URL in the browser for download
      const canOpen = await Linking.canOpenURL(photo.url);
      if (canOpen) {
        await Linking.openURL(photo.url);
      } else {
        Alert.alert("Error", "Cannot open photo URL");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to open photo");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete(photo.id);
              onClose();
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setIsEditingTags(false);
    onClose();
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <Text variant="heading" style={styles.title} numberOfLines={1}>
            {photo.filename}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={foregroundColor} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Photo Image */}
          {photo.url && photo.status === "completed" ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: photo.url }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ) : (
            <Card style={styles.placeholderCard}>
              <View style={styles.placeholderContainer}>
                <Text variant="body" style={{ color: mutedForegroundColor }}>
                  {photo.status === "pending" ? "Processing..." : "Failed to load"}
                </Text>
              </View>
            </Card>
          )}

          {/* Metadata */}
          <Card style={styles.metadataCard}>
            <CardContent style={styles.metadataContent}>
              <View style={styles.metadataRow}>
                <Text variant="body" style={{ color: mutedForegroundColor }}>
                  Status:
                </Text>
                <Badge
                  variant={
                    photo.status === "completed"
                      ? "default"
                      : photo.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {photo.status}
                </Badge>
              </View>
              <View style={styles.metadataRow}>
                <Text variant="body" style={{ color: mutedForegroundColor }}>
                  Created:
                </Text>
                <Text variant="body">
                  {new Date(photo.createdAt).toLocaleString()}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card style={styles.tagsCard}>
            <CardHeader>
              <View style={styles.tagsHeader}>
                <CardTitle>Tags</CardTitle>
                {!isEditingTags && (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setIsEditingTags(true)}
                    animation={false}
                  >
                    Edit Tags
                  </Button>
                )}
              </View>
            </CardHeader>
            <CardContent>
              {isEditingTags ? (
                <View style={styles.editTagsContainer}>
                  <TagInput
                    value={photo.tags || []}
                    onChange={(newTags) => {
                      // Ensure newTags is always a valid array
                      if (!Array.isArray(newTags)) {
                        console.error("Tags must be an array", newTags);
                        return;
                      }
                      
                      // Auto-save when tags change (filter out empty/whitespace tags)
                      if (onUpdateTags) {
                        // Filter and validate tags - ensure all are strings
                        const validTags = newTags
                          .filter((tag) => typeof tag === "string" && tag.trim().length > 0 && tag.length <= 50)
                          .map((tag) => tag.trim());
                        
                        // Always send an array (even if empty) - API expects an array
                        onUpdateTags(photo.id, validTags);
                      }
                    }}
                    placeholder="Add tags..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setIsEditingTags(false)}
                    animation={false}
                  >
                    Done
                  </Button>
                </View>
              ) : (
                <View style={styles.tagsContainer}>
                  {photo.tags && photo.tags.length > 0 ? (
                    <View style={styles.tagsList}>
                      {photo.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </View>
                  ) : (
                    <Text variant="body" style={{ color: mutedForegroundColor }}>
                      No tags yet
                    </Text>
                  )}
                </View>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestions Section */}
          {suggestedTags.length > 0 && !isEditingTags && (
            <Card style={styles.suggestionsCard}>
              <CardHeader>
                <View style={styles.suggestionsHeader}>
                  <Sparkles size={16} color="#a855f7" strokeWidth={2} />
                  <CardTitle>AI Suggestions</CardTitle>
                </View>
              </CardHeader>
              <CardContent>
                <View style={styles.suggestionsList}>
                  {suggestedTags.map((tag) => (
                    <View key={tag} style={styles.suggestionBadge}>
                      <Sparkles size={12} color="#a855f7" strokeWidth={2} />
                      <Text style={styles.suggestionText}>{tag}</Text>
                      <TouchableOpacity
                        onPress={() => onAcceptTag?.(photo.id, tag)}
                        style={styles.suggestionButton}
                      >
                        <Check size={14} color="#16a34a" strokeWidth={2.5} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => onRejectTag?.(photo.id, tag)}
                        style={styles.suggestionButton}
                      >
                        <X size={14} color="#dc2626" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { borderTopColor: borderColor }]}>
          <Button
            variant="destructive"
            size="sm"
            onPress={handleDelete}
            disabled={!onDelete}
            animation={false}
            icon={Trash2}
          >
            Delete
          </Button>
          <Button
            variant="default"
            size="sm"
            onPress={handleDownload}
            disabled={!photo.url || photo.status !== "completed"}
            animation={false}
            icon={Download}
          >
            Download
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: 60, // Account for status bar
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderCard: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  metadataCard: {
    width: "100%",
  },
  metadataContent: {
    gap: 12,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagsCard: {
    width: "100%",
  },
  tagsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagsContainer: {
    width: "100%",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  editTagsContainer: {
    gap: 12,
  },
  suggestionsCard: {
    width: "100%",
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  suggestionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#faf5ff", // purple-50 equivalent
    borderColor: "#e9d5ff", // purple-200 equivalent
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 14,
    color: "#7c3aed", // purple-600 equivalent
  },
  suggestionButton: {
    padding: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
});

