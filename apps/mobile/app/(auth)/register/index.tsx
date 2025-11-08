import { useState } from "react";
import { useRouter } from "expo-router";
import { YStack, XStack, Input, Button, Label, Text, H1 } from "tamagui";
import { authClient } from "@/lib/auth-client";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({ email, password, name });
      if (result.data) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$4"
      justifyContent="center"
      space="$4"
    >
      <H1 textAlign="center" marginBottom="$2">
        Register
      </H1>
      <YStack space="$4">
        <YStack space="$2">
          <Label>Name</Label>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            autoComplete="name"
          />
        </YStack>
        <YStack space="$2">
          <Label>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </YStack>
        <YStack space="$2">
          <Label>Password</Label>
          <Input
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoCapitalize="none"
            autoComplete="password"
          />
        </YStack>
        <Button
          disabled={isLoading}
          backgroundColor="$blue9"
          size="$4"
          onPress={handleSubmit}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </YStack>
      <XStack justifyContent="center" marginTop="$4">
        <Text fontSize="$3" color="$gray10">
          Already have an account?{" "}
          <Text
            color="$blue10"
            onPress={() => router.push("/(auth)/login")}
            textDecorationLine="underline"
          >
            Login
          </Text>
        </Text>
      </XStack>
    </YStack>
  );
}
