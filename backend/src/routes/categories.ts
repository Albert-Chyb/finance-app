import { Hono } from 'hono';
import { categories } from '../db/schemas/categories.js';
import { Resource } from '../resource/resource.js';
import { ResourceField } from '../resource/resource-field.js';
import { ResourceApi } from '../resource/resource-api.js';
import { Sort } from '../resource/sort.js';

const categoriesRoutes = new Hono();

const idField = new ResourceField({
  column: categories.id,
  isSortable: true,
  allowedFilters: ['eq'],
});

const categoriesResource = new Resource({
  table: categories,
  defaultSort: new Sort(idField, 'asc'),
  fields: {
    id: idField,
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
