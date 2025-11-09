import { Photo } from "@rapidphoto/api-client";
import { FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, RefreshControl } from "react-native";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useColor } from "@/hooks/useColor";
import { SimpleSpinner } from "@/components/ui/spinner-simple";

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  onPhotoClick: (photo: Photo) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const numColumns = 3;
const gap = 8;

export function PhotoGrid({ photos, loading = false, onPhotoClick, refreshing = false, onRefresh }: PhotoGridProps) {
  // All hooks must be called at the top, before any conditional returns
  const { width } = Dimensions.get("window");
  const itemSize = (width - gap * (numColumns + 1)) / numColumns;
  const mutedColor = useColor("muted");
  const mutedForegroundColor = useColor("mutedForeground");
  const cardColor = useColor("card");
  const foregroundColor = useColor("foreground");
  const destructiveColor = useColor("destructive");
  const backgroundColor = useColor("background");
  const tintColor = useColor("primary");

  if (loading) {
    return (
      <View style={styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} style={[styles.photoCard, { width: itemSize, height: itemSize }]}>
            <View style={styles.loadingContainer}>
              <SimpleSpinner size="sm" />
            </View>
          </Card>
        ))}
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <View style={styles.emptyContainer}>
          <Text variant="title" style={[styles.emptyText, { color: mutedForegroundColor }]}>
            No photos yet
          </Text>
          <Text variant="body" style={[styles.emptySubtext, { color: mutedForegroundColor }]}>
            Upload some photos to see them here
          </Text>
        </View>
      </Card>
    );
  }

  const renderPhoto = ({ item: photo }: { item: Photo }) => {
    return (
      <TouchableOpacity
        onPress={() => onPhotoClick(photo)}
        activeOpacity={0.7}
        style={[styles.photoCard, { width: itemSize, height: itemSize }]}
      >
        <Card style={styles.card}>
          {photo.url && photo.status === "completed" ? (
            <Image
              source={{ uri: photo.url }}
              style={styles.photoImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: mutedColor }]}>
              <Text variant="caption" style={{ color: mutedForegroundColor }}>
                {photo.status === "pending" ? "Processing..." : "Failed"}
              </Text>
            </View>
          )}

          {/* Status badge for non-completed photos */}
          {photo.status !== "completed" && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    photo.status === "pending" ? foregroundColor : destructiveColor,
                },
              ]}
            >
              <Text
                variant="caption"
                style={[
                  styles.statusText,
                  {
                    color:
                      photo.status === "pending"
                        ? backgroundColor
                        : cardColor,
                  },
                ]}
              >
                {photo.status}
              </Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tintColor}
            colors={[tintColor]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: gap,
    gap: gap,
  },
  row: {
    gap: gap,
  },
  photoCard: {
    marginBottom: gap,
  },
  card: {
    width: "100%",
    height: "100%",
    padding: 0,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    margin: 16,
    padding: 48,
  },
  emptyContainer: {
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
  },
});

