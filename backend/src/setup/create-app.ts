import { Hono } from 'hono';
import { createDb } from './db-connection.js';
import { setupRoutes } from './setup-routes.js';

export function createApp(connectionString = process.env.DATABASE_URL!) {
  const app = new Hono();
  setupRoutes(app, createDb(connectionString));
  return app;
}
