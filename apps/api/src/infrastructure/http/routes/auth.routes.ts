import { Hono } from 'hono';
import { auth } from '../../auth/better-auth.js';

const authRoutes = new Hono();

// Mount Better-Auth API routes
authRoutes.on(['POST', 'GET'], '/*', (c) => {
  return auth.handler(c.req.raw);
});

export default authRoutes;

