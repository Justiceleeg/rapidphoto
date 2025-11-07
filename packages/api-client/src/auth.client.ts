/**
 * Authentication client methods
 * 
 * Note: For authentication, we're using Better-Auth's React client directly.
 * This file provides a wrapper for consistency with other API clients,
 * but the web app uses Better-Auth's built-in client.
 */

import { ApiClient } from './client';

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

export class AuthClient {
  constructor(private client: ApiClient) {}

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/auth/signup', data);
  }

  /**
   * Sign in a user
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/auth/signin', data);
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    return this.client.post<void>('/api/auth/signout');
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthResponse | null> {
    try {
      return await this.client.get<AuthResponse>('/api/auth/session');
    } catch {
      return null;
    }
  }
}

