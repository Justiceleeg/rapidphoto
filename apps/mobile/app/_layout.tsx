import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, YStack, Text, H3 } from "tamagui";
import { ErrorBoundary } from "react-error-boundary";
import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function ErrorFallback({ error }: { error: Error }) {
  return (
    <YStack flex={1} padding="$5" backgroundColor="$background">
      <H3 marginBottom="$3" color="$color">
        Something went wrong:
      </H3>
      <Text fontSize="$4" color="$red10" marginBottom="$3">
        {error.message}
      </Text>
      <Text fontSize="$2" color="$gray10" fontFamily="$mono">
        {error.stack}
      </Text>
    </YStack>
  );
}

export default function RootLayout() {
  try {
    return (
      <SafeAreaProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
            <QueryClientProvider client={queryClient}>
              <Slot />
            </QueryClientProvider>
          </TamaguiProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    );
  } catch (error) {
    console.error("Root layout error:", error);
    return (
      <YStack flex={1} padding="$5" backgroundColor="$background">
        <H3 marginBottom="$3" color="$color">
          Failed to render app:
        </H3>
        <Text fontSize="$4" color="$red10">
          {String(error)}
        </Text>
      </YStack>
    );
  }
}
