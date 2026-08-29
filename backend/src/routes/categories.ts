import { Hono } from 'hono';
import { categories } from '../db/schemas/categories.js';
import { Resource } from '../resource/resource.js';
import { ResourceField } from '../resource/resource-field.js';
import { ResourceApi } from '../resource/resource-api.js';

const categoriesRoutes = new Hono();

const categoriesResource = new Resource({
  table: categories,
  fields: {
    id: new ResourceField({
      column: categories.id,
      isSortable: true,
      allowedFilters: ['eq'],
    }),
    name: new ResourceField({
      column: categories.name,
      isSortable: true,
      allowedFilters: ['text-contains'],
    }),
    createdAt: new ResourceField({
      column: categories.createdAt,
      isSortable: true,
      allowedFilters: [],
    }),
    color: new ResourceField({
      column: categories.color,
      isSortable: true,
      allowedFilters: ['array-contains'],
    }),
  },
});

const resourceApi = new ResourceApi(categoriesResource);

categoriesRoutes.get('/', resourceApi.get());

export default categoriesRoutes;
