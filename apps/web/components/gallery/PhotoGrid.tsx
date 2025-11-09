"use client";

import Image from "next/image";
import { Photo } from "@rapidphoto/api-client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGrid({ photos, loading = false, onPhotoClick }: PhotoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="aspect-square overflow-hidden">
            <Skeleton className="size-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className="flex items-center justify-center p-12 text-center">
        <div>
          <p className="text-lg font-medium text-muted-foreground">No photos yet</p>
          <p className="text-sm text-muted-foreground">Upload some photos to see them here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <Card
          key={photo.id}
          className="group relative aspect-square cursor-pointer overflow-hidden transition-all hover:shadow-lg"
          onClick={() => onPhotoClick(photo)}
        >
          <div className="relative size-full">
          {/* Photo Image */}
          {photo.url && photo.status === "completed" ? (
            <Image
              src={photo.thumbnailUrl || photo.url} // Use thumbnail if available, fallback to full image
              alt={photo.filename}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">
                {photo.status === "pending" ? "Processing..." : "Failed"}
              </p>
            </div>
          )}
          </div>

          {/* Overlay with tags on hover */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-wrap gap-1">
                {photo.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/20 text-xs text-white backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
                {photo.tags.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-xs text-white backdrop-blur-sm"
                  >
                    +{photo.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Status badge for non-completed photos */}
          {photo.status !== "completed" && (
            <div className="absolute right-2 top-2">
              <Badge
                variant={photo.status === "pending" ? "default" : "destructive"}
                className="text-xs"
              >
                {photo.status}
              </Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

