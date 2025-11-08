import { useRouter } from "expo-router";
import { YStack, Text, H1, Button } from "tamagui";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <YStack
        borderWidth={4}
        borderStyle="dashed"
        borderColor="$gray6"
        borderRadius="$4"
        padding="$4"
        marginTop="$5"
        space="$4"
      >
        <H1 fontSize="$9" fontWeight="bold" marginBottom="$2">
          Welcome to RapidPhoto
        </H1>
        <Text fontSize="$4" color="$gray11" marginBottom="$3">
          You are logged in
        </Text>
        <Button onPress={handleSignOut} backgroundColor="$red9" size="$4">
          Sign Out
        </Button>
      </YStack>
    </YStack>
  );
}
