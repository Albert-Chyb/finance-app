import { describe, expect, it } from 'vitest';
import { ResourceField } from './resource-field.js';
import { integer, pgTable } from 'drizzle-orm/pg-core';

const table = pgTable('a', { a: integer().primaryKey() });

describe('ResourceField', () => {
  describe('isSortable', () => {
    it('returns true if field is configured as sortable', () => {
      const field = new ResourceField({
        column: table.a,
        isSortable: true,
        allowedFilters: [],
      });

      expect(field.isSortable()).toBe(true);
    });

    it('returns false if field is configured as not sortable', () => {
      const field = new ResourceField({
        column: table.a,
        isSortable: false,
        allowedFilters: [],
      });

      expect(field.isSortable()).toBe(false);
    });
  });

  describe('isFilterableVia', () => {
    it('returns false if no operators were allowed', () => {
      const field = new ResourceField({
        column: table.a,
        isSortable: false,
        allowedFilters: [],
      });

      expect(field.isFilterableVia('eq')).toBe(false);
    });

    it('returns false if given operator is not allowed', () => {
      const field = new ResourceField({
        column: table.a,
        isSortable: false,
        allowedFilters: ['array-contains'],
      });

      expect(field.isFilterableVia('eq')).toBe(false);
    });

    it('returns true if given operator is allowed', () => {
      const field = new ResourceField({
        column: table.a,
        isSortable: false,
        allowedFilters: ['eq'],
      });

      expect(field.isFilterableVia('eq')).toBe(true);
    });
  });
});
