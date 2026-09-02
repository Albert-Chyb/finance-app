import type { Hono } from 'hono';
import routes from '../routes/index.js';

export function setupRoutes(app: Hono) {
  app.route('/api', routes);
}
