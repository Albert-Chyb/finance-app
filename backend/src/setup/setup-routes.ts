import type { Hono } from 'hono';
import type { createDb } from './db-connection.js';
import { createRoutes } from '../routes/index.js';

export function setupRoutes(app: Hono, db: ReturnType<typeof createDb>) {
  app.route('/api', createRoutes(db));
}
