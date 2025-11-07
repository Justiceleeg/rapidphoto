// Load .env file first, before any other imports
import './config/dotenv.js';

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { env } from './config/env.js';
import authRoutes from './infrastructure/http/routes/auth.routes.js';

const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Mount auth routes
app.route('/api/auth', authRoutes);

serve({
  fetch: app.fetch,
  port: env.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

