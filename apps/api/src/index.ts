import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { env } from './config/env.js';

const app = new Hono();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

serve({
  fetch: app.fetch,
  port: env.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

