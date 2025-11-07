import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../../config/env.js';
import * as schema from './schema.js';

// For schema generation, we can use a dummy connection string
const databaseUrl = env.databaseUrl || 'postgresql://dummy:dummy@localhost:5432/dummy';

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });

