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
import { Download, Trash2, Check, X, Sparkles } from "lucide-react";
import { TagInput } from "./TagInput";
import { photoClient } from "@/lib/api-client";

interface PhotoModalProps {
  photo: Photo | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (photoId: string) => void;
  onUpdateTags?: (photoId: string, tags: string[]) => void;
  onAcceptTag?: (photoId: string, tag: string) => void;
  onRejectTag?: (photoId: string, tag: string) => void;
}

export function PhotoModal({
  photo,
  open,
  onClose,
  onDelete,
  onUpdateTags,
  onAcceptTag,
  onRejectTag,
}: PhotoModalProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Reset editing state when modal closes (wrapped in handler to avoid setState in effect)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditingTags(false);
      onClose();
    }
  };

  if (!photo) return null;

  // Get first 3 AI-suggested tags
  const suggestedTags = photo.suggestedTags?.slice(0, 3) || [];

  const handleDownload = async () => {
    if (!photo.id || photo.status !== "completed") return;

    setIsDownloading(true);
    try {
      // Download the image as a blob through the API (avoids CORS issues)
      const blob = await photoClient.downloadPhoto(photo.id);
      
      // Create an object URL from the blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = photo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
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

          {/* AI Suggestions Section */}
          {suggestedTags.length > 0 && !isEditingTags && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-purple-500" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <div
                    key={tag}
                    className="group flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-1 text-sm dark:border-purple-800 dark:bg-purple-950"
                  >
                    <Sparkles className="size-3 text-purple-500" />
                    <span className="text-purple-700 dark:text-purple-300">{tag}</span>
                    <div className="ml-1 flex gap-0.5">
                      <button
                        onClick={() => onAcceptTag?.(photo.id, tag)}
                        className="rounded p-0.5 hover:bg-green-100 dark:hover:bg-green-900"
                        title="Accept tag"
                      >
                        <Check className="size-3 text-green-600 dark:text-green-400" />
                      </button>
                      <button
                        onClick={() => onRejectTag?.(photo.id, tag)}
                        className="rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-900"
                        title="Reject tag"
                      >
                        <X className="size-3 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={!photo.id || photo.status !== "completed" || isDownloading}
            >
              <Download className="mr-2 size-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

