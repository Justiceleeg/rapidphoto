"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { YStack, XStack, Input, Button, Label, Text, H1 } from "tamagui";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUp(email, password, name);
      if (result.data) {
        toast.success("Registration successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.error?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
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
      <H1 textAlign="center" marginBottom="$2">
        Register
      </H1>
      <form onSubmit={handleSubmit} id="register-form">
        <YStack space="$4">
          <YStack space="$2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </YStack>
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
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </YStack>
      </form>
      <XStack justifyContent="center" marginTop="$4">
        <Text fontSize="$3" color="$gray10">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "$blue10" }}>
            Login
          </Link>
        </Text>
      </XStack>
    </YStack>
  );
}
