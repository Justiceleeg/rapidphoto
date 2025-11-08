import { useState, useEffect } from 'react';
import { authClient } from '../auth-client';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session on mount
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const result = await authClient.getSession();
        if (result.data) {
          setSession(result.data);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  return {
    user: session?.user || null,
    session: session || null,
    isAuthenticated: !!session?.user,
    isLoading,
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

