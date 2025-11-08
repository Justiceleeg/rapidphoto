"use client";

import { YStack } from "tamagui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <YStack
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
    >
      <YStack maxWidth={400} width="100%" space="$4" padding="$4">
        {children}
      </YStack>
    </YStack>
  );
}

