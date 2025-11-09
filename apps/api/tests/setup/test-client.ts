/**
 * Client simulation helpers
 * Provides utilities to simulate client requests with authentication
 */

export interface TestClient {
  baseUrl: string;
  cookies: string[];
  request: (
    path: string,
    options?: RequestInit
  ) => Promise<Response>;
  signup: (email: string, password: string, name: string) => Promise<Response>;
  signin: (email: string, password: string) => Promise<Response>;
  signout: () => Promise<Response>;
  getMe: () => Promise<Response>;
}

/**
 * Create a test client with cookie management
 * @param baseUrl Base URL of the test server
 * @returns Test client instance
 */
export function createTestClient(baseUrl: string): TestClient {
  const cookies: string[] = [];

  /**
   * Extract and store cookies from a response
   */
  function extractCookies(response: Response): void {
    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders) {
      for (const cookie of setCookieHeaders) {
        // Check if cookie is being cleared (Max-Age=0 or Expires in past)
        const isClearing = cookie.includes("Max-Age=0") || 
                          cookie.includes("Expires=Thu, 01 Jan 1970") ||
                          cookie.includes("Expires=Wed, 31 Dec 1969");
        
        // Extract cookie name and value
        const match = cookie.match(/^([^=]+)=([^;]+)/);
        if (match) {
          const cookieName = match[1];
          const cookieValue = match[2];
          
          // Remove existing cookie with same name
          const existingIndex = cookies.findIndex((c) =>
            c.startsWith(`${cookieName}=`)
          );
          if (existingIndex >= 0) {
            cookies.splice(existingIndex, 1);
          }
          
          // Only add cookie if it's not being cleared and has a value
          if (!isClearing && cookieValue && cookieValue !== "") {
            cookies.push(`${cookieName}=${cookieValue}`);
          }
        }
      }
    }
  }

  /**
   * Make an HTTP request with cookie management
   */
  async function request(
    path: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${baseUrl}${path}`;
    const cookieHeader = cookies.length > 0 ? cookies.join("; ") : undefined;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    extractCookies(response);
    return response;
  }

  /**
   * Sign up a new user
   */
  async function signup(
    email: string,
    password: string,
    name: string
  ): Promise<Response> {
    return request("/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });
  }

  /**
   * Sign in an existing user
   */
  async function signin(email: string, password: string): Promise<Response> {
    return request("/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  /**
   * Sign out the current user
   */
  async function signout(): Promise<Response> {
    return request("/api/auth/sign-out", {
      method: "POST",
    });
  }

  /**
   * Get current user info
   */
  async function getMe(): Promise<Response> {
    return request("/api/me", {
      method: "GET",
    });
  }

  return {
    baseUrl,
    cookies,
    request,
    signup,
    signin,
    signout,
    getMe,
  };
}

/**
 * Upload a file to a presigned URL
 * @param presignedUrl The presigned URL from the API
 * @param content File content as Buffer or string
 * @param contentType MIME type of the file
 */
export async function uploadToPresignedUrl(
  presignedUrl: string,
  content: Buffer | string,
  contentType: string = "image/jpeg"
): Promise<Response> {
  const buffer = typeof content === "string" ? Buffer.from(content) : content;
  
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload to presigned URL: ${response.status} ${response.statusText}`
    );
  }

  return response;
}

