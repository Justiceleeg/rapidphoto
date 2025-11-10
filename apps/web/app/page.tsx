"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUploadStore } from "@/lib/stores/upload-store";
import { useUploadCacheInvalidation } from "@/lib/hooks/use-upload-cache-invalidation";
import { photoClient } from "@/lib/api-client";
import { Photo } from "@rapidphoto/api-client";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoModal } from "@/components/gallery/PhotoModal";
import { TagSearch } from "@/components/gallery/TagSearch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [includeSuggested, setIncludeSuggested] = useState(false);
  const [pendingIncludeSuggested, setPendingIncludeSuggested] = useState(false);
  const queryClient = useQueryClient();
  const limit = 20;

  // Set up cache invalidation for uploads
  useUploadCacheInvalidation();

  // Upload store - must be called before any early returns
  const uploadStore = useUploadStore();
  const {
    setSelectedFile,
    setSelectedFiles,
    upload,
    uploadBatch,
    uploadState,
  } = uploadStore;

  // Fetch photos with tag search - enabled only when authenticated
  const { data, isLoading, error } = useQuery({
    queryKey: ["photos", page, limit, searchTags, includeSuggested],
    queryFn: () => {
      if (searchTags.length === 0) {
        return photoClient.getPhotos({ page, limit });
      }
      return photoClient.getPhotos({
        page,
        limit,
        tags: searchTags,
        includeSuggested: includeSuggested,
      });
    },
    enabled: isAuthenticated && !authLoading,
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => photoClient.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast.success("Photo deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete photo");
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
      if (selectedPhoto && selectedPhoto.id === updatedPhoto.id) {
        setSelectedPhoto({
          ...selectedPhoto,
          ...updatedPhoto,
          url: selectedPhoto.url,
        });
      }

      queryClient.setQueryData(
        ["photos", page, limit, searchTags, includeSuggested],
        (oldData: { photos: Photo[]; pagination: unknown } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            photos: oldData.photos.map((photo: Photo) =>
              photo.id === updatedPhoto.id
                ? { ...photo, ...updatedPhoto, url: photo.url }
                : photo
            ),
          };
        }
      );

      toast.success("Tags updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tags");
    },
  });

  // Accept AI tag mutation
  const acceptTagMutation = useMutation({
    mutationFn: ({ photoId, tag }: { photoId: string; tag: string }) =>
      photoClient.acceptTag(photoId, tag),
    onMutate: async ({ photoId, tag }) => {
      if (selectedPhoto && selectedPhoto.id === photoId) {
        const updatedPhoto = {
          ...selectedPhoto,
          tags: [...(selectedPhoto.tags || []), tag],
          suggestedTags: (selectedPhoto.suggestedTags || []).filter((t) => t !== tag),
        };
        setSelectedPhoto(updatedPhoto);

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
      toast.success("Tag accepted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept tag");
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  // Reject AI tag mutation
  const rejectTagMutation = useMutation({
    mutationFn: ({ photoId, tag }: { photoId: string; tag: string }) =>
      photoClient.rejectTag(photoId, tag),
    onMutate: async ({ photoId, tag }) => {
      if (selectedPhoto && selectedPhoto.id === photoId) {
        const updatedPhoto = {
          ...selectedPhoto,
          suggestedTags: (selectedPhoto.suggestedTags || []).filter((t) => t !== tag),
        };
        setSelectedPhoto(updatedPhoto);

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
      toast.success("Tag rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject tag");
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  // Drag and drop handler
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (acceptedFiles.length === 1) {
        setSelectedFile(acceptedFiles[0]);
        upload().then(() => {
          queryClient.invalidateQueries({ queryKey: ["photos"] });
        });
      } else {
        setSelectedFiles(acceptedFiles);
        uploadBatch().then(() => {
          queryClient.invalidateQueries({ queryKey: ["photos"] });
        });
      }
    },
    [setSelectedFile, setSelectedFiles, upload, uploadBatch, queryClient]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 100,
    multiple: true,
    disabled: uploadState === "uploading" || uploadState === "pending",
    noClick: true, // Don't open file picker on click
  });

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
      toast.error("Invalid tags format");
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

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (data && page < data.pagination.totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearSearch = () => {
    setSearchTags([]);
    setIncludeSuggested(false);
    setPendingIncludeSuggested(false);
    setPage(1);
  };

  if (error) {
    return (
      <Card className="flex items-center justify-center p-12 text-center">
        <div>
          <p className="text-lg font-medium text-destructive">
            Error loading photos
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div {...getRootProps()} className="min-h-screen">
      <input {...getInputProps()} />
      <div
        className={cn(
          "min-h-screen transition-all",
          isDragActive && "bg-primary/5"
        )}
      >
        <div className="space-y-6 p-4">
          {/* Tag Search */}
          <TagSearch
            tags={searchTags}
            includeSuggested={pendingIncludeSuggested}
            onTagsChange={(tags) => {
              setSearchTags(tags);
              setIncludeSuggested(pendingIncludeSuggested);
              setPage(1);
            }}
            onIncludeSuggestedChange={(include) => {
              setPendingIncludeSuggested(include);
              if (searchTags.length > 0) {
                setIncludeSuggested(include);
                setPage(1);
              }
            }}
            onClear={handleClearSearch}
          />

          {isDragActive && (
            <Card className="border-2 border-dashed border-primary bg-primary/5 p-12 text-center">
              <p className="text-lg font-medium text-primary">
                Drop photos here to upload
              </p>
            </Card>
          )}

          <PhotoGrid
            photos={data?.photos || []}
            loading={isLoading}
            onPhotoClick={handlePhotoClick}
          />

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <Card className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= data.pagination.totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {data.pagination.limit * (data.pagination.page - 1) + 1}-
                {Math.min(
                  data.pagination.limit * data.pagination.page,
                  data.pagination.total
                )}{" "}
                of {data.pagination.total}
              </p>
            </Card>
          )}

          {/* Photo Modal */}
          <PhotoModal
            photo={selectedPhoto}
            open={isModalOpen}
            onClose={handleCloseModal}
            onDelete={handleDelete}
            onUpdateTags={handleUpdateTags}
            onAcceptTag={handleAcceptTag}
            onRejectTag={handleRejectTag}
          />
        </div>
      </div>
    </div>
  );
}
