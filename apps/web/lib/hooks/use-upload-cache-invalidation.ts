"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setInvalidatePhotosCallback } from "@/lib/stores/upload-store";

/**
 * Hook to set up cache invalidation for photos when uploads complete
 * Call this in your root layout or any page that uses the upload store
 */
export function useUploadCacheInvalidation() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up the callback to invalidate photos queries
    setInvalidatePhotosCallback(() => {
      console.log("[useUploadCacheInvalidation] Invalidating photos cache");
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    });

    // Clean up on unmount
    return () => {
      setInvalidatePhotosCallback(null);
    };
  }, [queryClient]);
}

