"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { YStack, XStack, Input, Button, Label, Text, H1 } from "tamagui";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn(email, password);
      if (result.data) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.error?.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <YStack
      backgroundColor="$background"
      padding="$4"
      borderRadius="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={4}
      space="$4"
    >
      <H1 textAlign="center" marginBottom="$2">Login</H1>
      <form onSubmit={handleSubmit} id="login-form">
        <YStack space="$4">
          <YStack space="$2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
          </YStack>
          <YStack space="$2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
            />
          </YStack>
          <Button
            disabled={isLoading}
            backgroundColor="$blue9"
            size="$4"
            onPress={(e) => {
              e.preventDefault?.();
              handleSubmit(e as any);
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </YStack>
      </form>
      <XStack justifyContent="center" marginTop="$4">
        <Text fontSize="$3" color="$gray10">
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "$blue10" }}>
            Register
          </Link>
        </Text>
      </XStack>
    </YStack>
  );
}

