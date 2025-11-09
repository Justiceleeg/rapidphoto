"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-4">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to RapidPhoto</CardTitle>
          <CardDescription>
          You are logged in as {user?.name || user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild className="flex-1">
            <Link href="/dashboard/upload">
              Upload Photo
            </Link>
          </Button>
          <Button
            onClick={handleSignOut}
            variant="destructive"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

