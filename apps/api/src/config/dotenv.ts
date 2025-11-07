import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the api directory
// When running with tsx, __dirname will be src/config/, so go up two levels to apps/api/
const envPath = resolve(__dirname, '../../.env');
const result = config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Could not load .env file from ${envPath}:`, result.error.message);
} else if (result.parsed) {
  console.log(`Loaded ${Object.keys(result.parsed).length} environment variables from .env`);
}

