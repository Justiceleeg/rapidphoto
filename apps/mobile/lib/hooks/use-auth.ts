import { useState } from 'react';
import { authClient } from '../auth-client';

export function useAuth() {
  const [session, setSession] = useState<any>(null);

  return {
    user: session?.user || null,
    session: session || null,
    isAuthenticated: !!session?.user,
    isLoading: false,
    signIn: async (email: string, password: string) => {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      if (result.data) {
        setSession(result.data);
      }
      return result;
    },
    signUp: async (email: string, password: string, name: string) => {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (result.data) {
        setSession(result.data);
      }
      return result;
    },
    signOut: async () => {
      await authClient.signOut();
      setSession(null);
    },
  };
}

