"use client";

import { useState } from "react";
import Image from "next/image";
import { Photo } from "@rapidphoto/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";
import { TagInput } from "./TagInput";

interface PhotoModalProps {
  photo: Photo | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (photoId: string) => void;
  onUpdateTags?: (photoId: string, tags: string[]) => void;
}

export function PhotoModal({
  photo,
  open,
  onClose,
  onDelete,
  onUpdateTags,
}: PhotoModalProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);

  // Reset editing state when modal closes (wrapped in handler to avoid setState in effect)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditingTags(false);
      onClose();
    }
  };

  if (!photo) return null;

  const handleDownload = () => {
    if (photo.url) {
      const link = document.createElement("a");
      link.href = photo.url;
      link.download = photo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate">{photo.filename}</DialogTitle>
          <DialogDescription>
            View and manage your photo details, tags, and metadata.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo Image */}
          {photo.url && photo.status === "completed" ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={photo.url}
                alt={photo.filename}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">
                {photo.status === "pending" ? "Processing..." : "Failed to load"}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
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
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(photo.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tags</span>
              {!isEditingTags && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingTags(true)}
                >
                  Edit Tags
                </Button>
              )}
            </div>

            {isEditingTags ? (
              <div className="space-y-2">
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
                  onClick={() => setIsEditingTags(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {photo.tags && photo.tags.length > 0 ? (
                  photo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (onDelete && confirm("Are you sure you want to delete this photo?")) {
                  onDelete(photo.id);
                  onClose();
                }
              }}
              disabled={!onDelete}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={!photo.url || photo.status !== "completed"}
            >
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

