"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { photoClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  // Get photo count from first page query
  const { data: photosData } = useQuery({
    queryKey: ["photos", 1, 20, [], false],
    queryFn: () => photoClient.getPhotos({ page: 1, limit: 20 }),
    enabled: isAuthenticated,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const photoCount = photosData?.pagination.total || 0;

  return (
    <header className="border-b bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">RapidPhoto</h2>
          {user && (
            <p className="text-sm text-muted-foreground">
              {user.name || user.email}
            </p>
          )}
          {photosData && (
            <p className="text-sm text-muted-foreground">
              {photoCount} photo{photoCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <nav className="flex items-center gap-2">
          <Button
            asChild
            variant={pathname === "/upload" ? "default" : "ghost"}
            size="sm"
          >
            {pathname === "/upload" ? (
              <Link href="/">Gallery</Link>
            ) : (
              <Link href="/upload">Upload</Link>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  );
}
