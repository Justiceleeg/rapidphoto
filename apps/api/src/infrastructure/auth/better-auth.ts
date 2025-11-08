import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/connection.js';
import { env } from '../../config/env.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  secret: env.authSecret,
  baseURL: env.authUrl,
  trustedOrigins: [
    ...env.allowedOrigins,
    'http://localhost:4000', // API
    'rapidphoto://', // Mobile app scheme
    'exp://', // Expo development scheme
  ],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});

