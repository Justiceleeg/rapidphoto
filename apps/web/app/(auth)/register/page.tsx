"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    } catch {
      toast.error("An error occurred during registration");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Register</CardTitle>
        <CardDescription className="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} id="register-form">
          <div className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
                type="text"
              value={name}
                onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
                required
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
                type="email"
              value={email}
                onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
                required
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
                type="password"
              value={password}
                onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
                required
            />
            </div>
          <Button
              type="submit"
            disabled={isLoading}
              className="w-full"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          </div>
      </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
