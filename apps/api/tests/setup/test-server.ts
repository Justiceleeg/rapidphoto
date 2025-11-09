/**
 * Test server setup utilities
 * Provides functions to start/stop a test server with the actual Hono app
 */

import { createApp } from "../../src/app.js";
import { serve } from "@hono/node-server";
import type { Server } from "node:http";

export interface TestServer {
  url: string;
  close: () => Promise<void>;
}

/**
 * Start a test server with the Hono app
 * @param port Optional port number (default: random available port)
 * @returns Test server instance with URL and cleanup function
 */
export async function startTestServer(port?: number): Promise<TestServer> {
  const app = createApp();
  
  // Use provided port or let the system assign one
  const serverPort = port || 0;
  
  return new Promise((resolve, reject) => {
    let server: Server | null = null;
    
    try {
      server = serve(
        {
          fetch: app.fetch,
          port: serverPort,
        },
        (info) => {
          const url = `http://localhost:${info.port}`;
          resolve({
            url,
            close: async () => {
              if (server) {
                await new Promise<void>((resolveClose) => {
                  server!.close(() => {
                    resolveClose();
                  });
                });
              }
            },
          });
        }
      ) as Server;
    } catch (error) {
      reject(error);
    }
  });
}

