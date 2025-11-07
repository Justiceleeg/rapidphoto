import { Context, Next } from 'hono';
import { auth } from './better-auth.js';

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

