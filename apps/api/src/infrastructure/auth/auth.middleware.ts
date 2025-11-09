import { Context, Next } from 'hono';
import { auth } from './better-auth.js';

/**
 * Authentication middleware for Hono
 * Validates user session and attaches user/session data to context
 * Returns 401 Unauthorized if no valid session is found
 * 
 * @param c - Hono context
 * @param next - Next middleware function
 * @returns JSON error response if unauthorized, otherwise continues to next middleware
 */
export async function authMiddleware(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Attach user and session to context
  c.set('user', session.user);
  c.set('session', session.session);
  
  await next();
}

