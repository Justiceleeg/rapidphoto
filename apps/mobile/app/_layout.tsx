import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "react-error-boundary";
import { View, Text, StyleSheet } from "react-native";
import { ThemeProvider } from "@/theme/theme-provider";

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
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong:</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorStack}>{error.stack}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  errorMessage: {
    fontSize: 16,
    color: "#dc2626",
    marginBottom: 16,
  },
  errorStack: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
