import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshControl, StyleSheet, Alert } from "react-native";
import { photoClient } from "@/lib/api-client";
import { Photo } from "@rapidphoto/api-client";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoViewer } from "@/components/gallery/PhotoViewer";
import { TagSearch } from "@/components/gallery/TagSearch";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useColor } from "@/hooks/useColor";

export default function GalleryScreen() {
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [includeSuggested, setIncludeSuggested] = useState(false);
  // Pending state for checkbox that doesn't trigger refetch
  const [pendingIncludeSuggested, setPendingIncludeSuggested] = useState(false);
  const queryClient = useQueryClient();
  const limit = 20;

  const backgroundColor = useColor("background");
  const foregroundColor = useColor("foreground");
  const destructiveColor = useColor("destructive");
  const mutedForegroundColor = useColor("mutedForeground");

  // Fetch photos with tag search
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["photos", page, limit, searchTags, includeSuggested],
    queryFn: () => {
      // When search is blank, show all photos (don't pass tags or includeSuggested)
      if (searchTags.length === 0) {
        return photoClient.getPhotos({ page, limit });
      }
      // When tags are selected, explicitly pass includeSuggested (true or false)
      // When false, only search user tags; when true, search both user and AI-suggested tags
      return photoClient.getPhotos({
        page,
        limit,
        tags: searchTags,
        includeSuggested: includeSuggested, // Explicitly pass false when unchecked
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => photoClient.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to delete photo");
    },
  });

  // Update tags mutation
  const updateTagsMutation = useMutation({
    mutationFn: ({ photoId, tags }: { photoId: string; tags: string[] }) => {
      if (!Array.isArray(tags)) {
        throw new Error("Tags must be an array");
      }
      return photoClient.updatePhotoTags(photoId, tags);
    },
    onSuccess: (updatedPhoto) => {
      // Merge updated data with existing photo (preserve the URL)
      if (selectedPhoto && selectedPhoto.id === updatedPhoto.id) {
        setSelectedPhoto({
          ...selectedPhoto,
          ...updatedPhoto,
          url: selectedPhoto.url, // Keep the existing presigned URL
        });
      }

      // Update the photo in the cache without refetching
      queryClient.setQueryData(
        ["photos", page, limit, searchTags, includeSuggested],
        (oldData: { photos: Photo[]; pagination: unknown } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            photos: oldData.photos.map((photo: Photo) =>
              photo.id === updatedPhoto.id
                ? { ...photo, ...updatedPhoto, url: photo.url } // Preserve existing URL
                : photo
            ),
          };
        }
      );
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to update tags");
    },
  });

  // Accept AI tag mutation
  const acceptTagMutation = useMutation({
    mutationFn: ({ photoId, tag }: { photoId: string; tag: string }) =>
      photoClient.acceptTag(photoId, tag),
    onMutate: async ({ photoId, tag }) => {
      // Optimistically update the UI
      if (selectedPhoto && selectedPhoto.id === photoId) {
        const updatedPhoto = {
          ...selectedPhoto,
          tags: [...(selectedPhoto.tags || []), tag],
          suggestedTags: (selectedPhoto.suggestedTags || []).filter((t) => t !== tag),
        };
        setSelectedPhoto(updatedPhoto);

        // Update cache
        queryClient.setQueryData(
          ["photos", page, limit, searchTags, includeSuggested],
          (oldData: { photos: Photo[]; pagination: unknown } | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              photos: oldData.photos.map((photo: Photo) =>
                photo.id === photoId ? updatedPhoto : photo
              ),
            };
          }
        );
      }
    },
    onSuccess: () => {
      // Toast/Alert handled by optimistic update
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to accept tag");
      // Refetch on error to sync state
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  // Reject AI tag mutation
  const rejectTagMutation = useMutation({
    mutationFn: ({ photoId, tag }: { photoId: string; tag: string }) =>
      photoClient.rejectTag(photoId, tag),
    onMutate: async ({ photoId, tag }) => {
      // Optimistically update the UI
      if (selectedPhoto && selectedPhoto.id === photoId) {
        const updatedPhoto = {
          ...selectedPhoto,
          suggestedTags: (selectedPhoto.suggestedTags || []).filter((t) => t !== tag),
        };
        setSelectedPhoto(updatedPhoto);

        // Update cache
        queryClient.setQueryData(
          ["photos", page, limit, searchTags, includeSuggested],
          (oldData: { photos: Photo[]; pagination: unknown } | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              photos: oldData.photos.map((photo: Photo) =>
                photo.id === photoId ? updatedPhoto : photo
              ),
            };
          }
        );
      }
    },
    onSuccess: () => {
      // Toast/Alert handled by optimistic update
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to reject tag");
      // Refetch on error to sync state
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDelete = (photoId: string) => {
    deletePhotoMutation.mutate(photoId);
  };

  const handleUpdateTags = (photoId: string, tags: string[]) => {
    if (!Array.isArray(tags)) {
      console.error("Tags must be an array", tags);
      Alert.alert("Error", "Invalid tags format");
      return;
    }
    updateTagsMutation.mutate({ photoId, tags });
  };

  const handleAcceptTag = (photoId: string, tag: string) => {
    acceptTagMutation.mutate({ photoId, tag });
  };

  const handleRejectTag = (photoId: string, tag: string) => {
    rejectTagMutation.mutate({ photoId, tag });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearSearch = () => {
    setSearchTags([]);
    setIncludeSuggested(false);
    setPendingIncludeSuggested(false);
    setPage(1); // Reset to first page when clearing search
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Card style={styles.errorCard}>
          <View style={styles.errorContainer}>
            <Text variant="title" style={[styles.errorTitle, { color: destructiveColor }]}>
              Error loading photos
            </Text>
            <Text variant="body" style={{ color: mutedForegroundColor }}>
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text variant="heading" style={styles.title}>
          Gallery
        </Text>
        {data && (
          <Text variant="body" style={{ color: mutedForegroundColor }}>
            {data.pagination.total} photo{data.pagination.total !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Tag Search */}
      <TagSearch
        tags={searchTags}
        includeSuggested={pendingIncludeSuggested}
        onTagsChange={(tags) => {
          setSearchTags(tags);
          // Apply pending includeSuggested when tags change (search is executed)
          setIncludeSuggested(pendingIncludeSuggested);
          setPage(1); // Reset to first page when search changes
        }}
        onIncludeSuggestedChange={(include) => {
          setPendingIncludeSuggested(include);
          // If tags are already selected, apply the checkbox change immediately
          // This ensures the search respects the checkbox state
          if (searchTags.length > 0) {
            setIncludeSuggested(include);
            setPage(1); // Reset to first page when filter changes
          }
          // If no tags are selected yet, the checkbox state will be applied when tags are submitted
        }}
        onClear={handleClearSearch}
      />

      <View style={styles.content}>
        <PhotoGrid
          photos={data?.photos || []}
          loading={isLoading}
          onPhotoClick={handlePhotoClick}
          refreshing={isRefetching}
          onRefresh={handleRefresh}
        />
      </View>

      {/* Photo Viewer Modal */}
      <PhotoViewer
        photo={selectedPhoto}
        open={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
        onUpdateTags={handleUpdateTags}
        onAcceptTag={handleAcceptTag}
        onRejectTag={handleRejectTag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Account for status bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  errorCard: {
    margin: 16,
    padding: 48,
  },
  errorContainer: {
    alignItems: "center",
    gap: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});

