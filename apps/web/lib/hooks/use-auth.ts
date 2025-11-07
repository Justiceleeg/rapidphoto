"use client";

import { authClient } from "../auth-client";

export function useAuth() {
  const session = authClient.useSession();

  return {
    user: session.data?.user || null,
    session: session.data || null,
    isAuthenticated: !!session.data?.user,
    isLoading: session.isPending,
    signIn: async (email: string, password: string) => {
      try {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        return result;
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
    signUp: async (email: string, password: string, name: string) => {
      try {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });
        return result;
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },
    signOut: async () => {
      try {
        await authClient.signOut();
      } catch (error) {
        console.error("Sign out error:", error);
      }
    },
  };
}

