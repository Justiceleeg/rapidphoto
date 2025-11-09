# Code Reference

> **Note**: This document contains historical code references. The Tamagui sections are outdated. The app now uses shadcn/ui (web) and BNA UI (mobile). Refer to `docs/STYLING.md` for current styling conventions and component patterns.

This file contains all code examples referenced in the task list. Organized by category for easy lookup.

## Monorepo Setup

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### root-package-json

```json
{
  "name": "rapidphoto",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel -r dev",
    "dev:web": "pnpm --filter @rapidphoto/web dev",
    "dev:mobile": "pnpm --filter @rapidphoto/mobile dev",
    "dev:api": "pnpm --filter @rapidphoto/api dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  }
}
```

### gitignore

```
node_modules/
.env
.env.local
dist/
build/
.next/
.expo/
*.log
.DS_Store
```

## Shared Package

### shared-tsconfig

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Backend API

### basic-hono-app

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/health', (c) => c.json({ status: 'ok' }));

serve({ fetch: app.fetch, port: 4000 });
console.log('Server running on http://localhost:4000');
```

### drizzle-schema

```typescript
// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Upload Jobs table
export const uploadJobs = pgTable('upload_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  totalPhotos: integer('total_photos').notNull(),
  completedPhotos: integer('completed_photos').default(0),
  failedPhotos: integer('failed_photos').default(0),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at')
});

// Photos table
export const photos = pgTable('photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  uploadJobId: uuid('upload_job_id').references(() => uploadJobs.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  r2Key: text('r2_key').notNull(),
  r2Url: text('r2_url'),
  thumbnailKey: text('thumbnail_key'),
  status: varchar('status', { length: 50 }).notNull(),
  tags: text('tags').array(),
  uploadedAt: timestamp('uploaded_at'),
  createdAt: timestamp('created_at').defaultNow()
});
```

### database-connection

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### drizzle-config

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
```

### better-auth-setup

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../database/connection';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  }
});
```

### r2-service

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class R2Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generatePresignedUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async deleteObject(key: string): Promise<void> {
    // Implement delete
  }

  getObjectUrl(key: string): string {
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  }
}
```

### init-upload-handler

```typescript
export class InitUploadHandler {
  constructor(
    private uploadJobRepo: UploadJobRepository,
    private photoRepo: PhotoRepository,
    private r2Service: R2Service
  ) {}

  async handle(command: InitUploadCommand): Promise<InitUploadResult> {
    // 1. Create upload job
    const job = await this.uploadJobRepo.create({
      userId: command.userId,
      totalPhotos: command.photos.length,
      status: 'pending'
    });

    // 2. Create photo records and generate presigned URLs
    const uploads = await Promise.all(
      command.photos.map(async (photo) => {
        const photoId = crypto.randomUUID();
        const r2Key = `uploads/${command.userId}/${photoId}`;

        await this.photoRepo.create({
          id: photoId,
          uploadJobId: job.id,
          userId: command.userId,
          fileName: photo.fileName,
          fileSize: photo.fileSize,
          mimeType: photo.mimeType,
          r2Key: r2Key,
          status: 'pending'
        });

        const presignedUrl = await this.r2Service.generatePresignedUrl(
          r2Key,
          photo.mimeType
        );

        return { photoId, presignedUrl, r2Key };
      })
    );

    return { jobId: job.id, uploads };
  }
}
```

## Frontend Web

### next-config

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rapidphoto/shared', '@rapidphoto/api-client'],
  images: {
    domains: ['your-r2-domain.r2.dev'],
  },
};

module.exports = nextConfig;
```

### react-query-providers

```typescript
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### tamagui-config

#### Web (Next.js) - tamagui.config.ts

```typescript
import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const appConfig = createTamagui(config);

export default appConfig;

export type Conf = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
```

#### Web (Next.js) - next.config.ts (with Tamagui plugin)

```typescript
import { tamaguiPlugin } from '@tamagui/vite-plugin';
import { defineConfig } from 'next/config';

export default defineConfig({
  transpilePackages: ['@rapidphoto/shared', '@rapidphoto/api-client'],
  images: {
    domains: ['your-r2-domain.r2.dev'],
  },
  vitePlugins: [
    tamaguiPlugin({
      config: './tamagui.config.ts',
      components: ['tamagui'],
      useReactNativeWeb: true,
    }),
  ],
});
```

#### Web - Root Layout with TamaguiProvider

```typescript
import { TamaguiProvider } from '@tamagui/core';
import config from '../tamagui.config';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TamaguiProvider config={config}>
          {children}
        </TamaguiProvider>
      </body>
    </html>
  );
}
```

#### Mobile (React Native) - tamagui.config.ts

```typescript
import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const appConfig = createTamagui(config);

export default appConfig;

export type Conf = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
```

#### Mobile - Root Layout with TamaguiProvider

```typescript
import { TamaguiProvider } from '@tamagui/core';
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      {/* Your app content */}
    </TamaguiProvider>
  );
}
```

**Note**: The same `tamagui.config.ts` can be shared between web and mobile for a unified design system.

## Mobile

### expo-config

```json
{
  "expo": {
    "name": "RapidPhoto",
    "slug": "rapidphoto",
    "scheme": "rapidphoto",
    "plugins": [
      "expo-router"
    ],
    "ios": {
      "bundleIdentifier": "com.rapidphoto.app"
    },
    "android": {
      "package": "com.rapidphoto.app",
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    }
  }
}
```

---

**Note**: This is a sample. The full file would contain all code examples from the original task list, organized by category.

