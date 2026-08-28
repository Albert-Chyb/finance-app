import { Hono } from 'hono';
import { db } from '../setup/db-connection.js';
import { categories } from '../db/schemas/categories.js';
import {
  FieldQueryConfig,
  ResourceQueryConfig,
} from '../query-params/resource-query-config.js';
import { applyResourceQuery } from '../query-params/apply-resource-query.js';
import { parseResourceQuery } from '../query-params/parse-resource-query.js';

const categoriesRoutes = new Hono();

const categoriesQueryConfig = new ResourceQueryConfig({
  name: new FieldQueryConfig({
    column: categories.name,
    isSortable: true,
    allowedFilters: ['eq'],
  }),
  createdAt: new FieldQueryConfig({
    column: categories.createdAt,
    isSortable: true,
    allowedFilters: ['eq'],
  }),
  color: new FieldQueryConfig({
    column: categories.color,
    isSortable: true,
    allowedFilters: ['eq'],
  }),
});

categoriesRoutes.get('/', async (ctx) => {
  const result = await applyResourceQuery(
    db.select().from(categories).$dynamic(),
    parseResourceQuery(new URLSearchParams(ctx.req.raw.url)),
    categoriesQueryConfig,
  );
  return ctx.json(result);
});

export default categoriesRoutes;
