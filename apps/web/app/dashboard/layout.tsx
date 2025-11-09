"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUploadCacheInvalidation } from "@/lib/hooks/use-upload-cache-invalidation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Set up cache invalidation for uploads (refreshes gallery when uploads complete)
  useUploadCacheInvalidation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/upload", label: "Upload" },
    { href: "/dashboard/gallery", label: "Gallery" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 h-16 flex items-center justify-between">
          <h2 className="text-xl font-semibold">RapidPhoto</h2>
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant={pathname === link.href ? "default" : "ghost"}
                size="sm"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
}

