import { Hono } from 'hono';
import { db } from '../setup/db-connection.js';
import { categories } from '../db/schemas/categories.js';
import { Resource } from '../resource/resource.js';
import { applyResourceQuery } from '../query-params/apply-resource-query.js';
import { parseResourceQuery } from '../query-params/parse-resource-query.js';
import { ResourceField } from '../resource/resource-field.js';

const categoriesRoutes = new Hono();

const categoriesResource = new Resource({
  table: categories,
  fields: {
    name: new ResourceField({
      column: categories.name,
      isSortable: true,
      allowedFilters: ['eq'],
    }),
    createdAt: new ResourceField({
      column: categories.createdAt,
      isSortable: true,
      allowedFilters: ['eq'],
    }),
    color: new ResourceField({
      column: categories.color,
      isSortable: true,
      allowedFilters: ['eq'],
    }),
  },
});

categoriesRoutes.get('/', async (ctx) => {
  const result = await applyResourceQuery(
    db.select().from(categories).$dynamic(),
    parseResourceQuery(new URLSearchParams(ctx.req.raw.url)),
    categoriesResource,
  );
  return ctx.json(result);
});

export default categoriesRoutes;
