"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { YStack, XStack, Text, H2 } from "tamagui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <YStack minHeight="100vh" alignItems="center" justifyContent="center">
        <Text fontSize="$6">Loading...</Text>
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <YStack minHeight="100vh" backgroundColor="$gray2">
      <YStack
        backgroundColor="$background"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={2}
      >
        <XStack
          maxWidth={1280}
          width="100%"
          marginHorizontal="auto"
          paddingHorizontal="$4"
          paddingVertical="$3"
          justifyContent="space-between"
          alignItems="center"
          height={64}
        >
          <H2 fontSize="$6" fontWeight="600">
            RapidPhoto
          </H2>
          <XStack space="$4" alignItems="center">
            <Text fontSize="$3" color="$gray11">
              {user?.name || user?.email}
            </Text>
          </XStack>
        </XStack>
      </YStack>
      <YStack
        maxWidth={1280}
        width="100%"
        marginHorizontal="auto"
        paddingVertical="$4"
        paddingHorizontal="$4"
      >
        {children}
      </YStack>
    </YStack>
  );
}

