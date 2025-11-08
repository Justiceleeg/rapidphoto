import Constants from "expo-constants";

// For local development, you may need to use your computer's IP address instead of localhost
// Example: 'http://192.168.1.100:4000' (replace with your actual IP)
// To find your IP: On Mac/Linux run `ipconfig getifaddr en0` or `ifconfig`
const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "https://api-production-18fb.up.railway.app";

// Use the API URL as the origin since Better Auth validates against trustedOrigins
// The API URL should be in the trustedOrigins list
const requestOrigin = apiUrl;

console.log("API URL:", apiUrl);
console.log("Request Origin:", requestOrigin);

// Better-auth React hooks don't work well in React Native
// We'll use a simpler fetch-based approach
export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/sign-in/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: requestOrigin,
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ message: "Login failed" }));
          return {
            data: null,
            error: new Error(error.message || "Login failed"),
          };
        }

        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        console.error("Sign in error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Network error. Please check your connection and try again.";
        return { data: null, error: new Error(errorMessage) };
      }
    },
  },
  signUp: {
    email: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/sign-up/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: requestOrigin,
          },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ message: "Registration failed" }));
          return {
            data: null,
            error: new Error(error.message || "Registration failed"),
          };
        }

        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        console.error("Sign up error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Network error. Please check your connection and try again.";
        return { data: null, error: new Error(errorMessage) };
      }
    },
  },
  signOut: async () => {
    try {
      await fetch(`${apiUrl}/api/auth/signout`, {
        method: "POST",
        headers: {
          Origin: requestOrigin,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
};
