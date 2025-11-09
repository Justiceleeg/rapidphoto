"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { photoClient } from "@/lib/api-client";
import { Photo } from "@rapidphoto/api-client";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoModal } from "@/components/gallery/PhotoModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const limit = 20;

  // Fetch photos
  const { data, isLoading, error } = useQuery({
    queryKey: ["photos", page, limit],
    queryFn: () => photoClient.getPhotos({ page, limit }),
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
        ["photos", page, limit],
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

      toast.success("Tags updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tags");
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
      toast.error("Invalid tags format");
      return;
    }
    updateTagsMutation.mutate({ photoId, tags });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery</h1>
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.pagination.total} photo
            {data.pagination.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

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
      />
    </div>
  );
}
