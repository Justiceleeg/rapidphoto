export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  authSecret: process.env.AUTH_SECRET || '',
  authUrl: process.env.AUTH_URL || 'http://localhost:4000',
} as const;

