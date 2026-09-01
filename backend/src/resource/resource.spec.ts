import { describe, expect, it } from 'vitest';
import { Resource } from './resource.js';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { ResourceField } from './resource-field.js';
import { Sort } from './sort.js';
import type { PaginationRequest } from '../query-params/parse-pagination-query.js';
import { Pagination } from './pagination.js';
import type { SortRequest } from '../query-params/parse-sort-query.js';
import type { FilterRequest } from '../query-params/parse-filter-query.js';
import { EqualsFilter } from './filters/equals.js';
import { z } from 'zod';

const table = pgTable('a', {
  id: integer().primaryKey(),
  name: text().notNull(),
});

const idField = new ResourceField({
  column: table.id,
  isSortable: true,
  allowedFilters: ['eq'],
});

const nameField = new ResourceField({
  column: table.name,
  isSortable: false,
  allowedFilters: [],
});

function createResource() {
  return new Resource({
    table,
    identifierField: idField,
    insertSchema: z.object(),
    defaultSort: new Sort(idField, 'asc'),
    fields: {
      id: idField,
      name: nameField,
    },
  });
}

describe('Resource', () => {
  describe('getField', () => {
    it('returns returns resource field if present', () => {
      const resource = createResource();

      expect(resource.getField('id')).toEqual(idField);
    });

    it('returns null if field is missing', () => {
      const resource = createResource();

      expect(resource.getField('a')).toBeNull();
    });
  });

  describe('getFields', () => {
    it('returns map of all present fields', () => {
      const resource = createResource();

      expect(resource.getFields()).toEqual({
        id: idField,
        name: nameField,
      });
    });
  });

  describe('resolvePagination', () => {
    it('creates an instance of Pagination class from pagination request', () => {
      const paginationReq: PaginationRequest = {
        pageIndex: 1,
        pageSize: 25,
      };
      const resource = createResource();

      expect(resource.resolvePagination(paginationReq)).toEqual(
        new Pagination(1, 25),
      );
    });
  });

  describe('resolveSort', () => {
    it('creates an instance of Sort class from pagination request', () => {
      const sortReq: SortRequest = {
        field: 'id',
        direction: 'desc',
      };
      const resource = createResource();

      expect(resource.resolveSort(sortReq)).toEqual(new Sort(idField, 'desc'));
    });

    it('returns null if field is not sortable', () => {
      const sortReq: SortRequest = {
        field: 'name',
        direction: 'desc',
      };
      const resource = createResource();

      expect(resource.resolveSort(sortReq)).toBeNull();
    });
  });

  describe('resolveFilter', () => {
    it('creates an instance of Filter class from request', () => {
      const filterReq: FilterRequest = {
        field: 'id',
        operator: 'eq',
        value: 1,
      };
      const resource = createResource();

      expect(resource.resolveFilter(filterReq)).toEqual(
        new EqualsFilter(idField, 1),
      );
    });

    it('returns null if requested operator is not allowed', () => {
      const filterReq: FilterRequest = {
        field: 'id',
        operator: 'array-contains',
        value: 1,
      };
      const resource = createResource();

      expect(resource.resolveFilter(filterReq)).toBeNull();
    });
  });
});
