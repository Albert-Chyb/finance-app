import { Hono } from 'hono';
import { db } from '../setup/db-connection.js';
import { categories } from '../db/schemas/categories.js';

const categoriesRoutes = new Hono();

categoriesRoutes.get('/', async (ctx) => {
  const result = await db.select().from(categories);
  return ctx.json(result);
});

export default categoriesRoutes;
