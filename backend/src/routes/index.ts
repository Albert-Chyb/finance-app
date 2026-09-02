import { Hono } from 'hono';
import type { DbConnection } from '../setup/db-connection.js';
import { createCategoriesRoutes } from './categories.js';

export function createRoutes(db: DbConnection) {
  const routes = new Hono();

  routes.route('/categories', createCategoriesRoutes(db));

  return routes;
}
