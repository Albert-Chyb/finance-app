import { Hono } from 'hono';
import { setupRoutes } from './routes.js';

export function createApp() {
  const app = new Hono();
  setupRoutes(app);
  return app;
}
