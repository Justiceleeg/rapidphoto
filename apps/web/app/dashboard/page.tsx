"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { YStack, Text, H1, Button } from "tamagui";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <YStack padding="$4">
      <YStack
        borderWidth={4}
        borderStyle="dashed"
        borderColor="$gray6"
        borderRadius="$4"
        padding="$4"
        space="$4"
      >
        <H1 fontSize="$9" fontWeight="bold" marginBottom="$2">
          Welcome to RapidPhoto
        </H1>
        <Text fontSize="$4" color="$gray11" marginBottom="$3">
          You are logged in as {user?.name || user?.email}
        </Text>
        <Button
          onClick={handleSignOut}
          theme="red"
          size="$4"
        >
          Sign Out
        </Button>
      </YStack>
    </YStack>
  );
}

