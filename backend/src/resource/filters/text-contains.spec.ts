import { describe, expect, it } from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { ResourceField } from '../resource-field.js';
import { TextContainsFilter } from './text-contains.js';

const table = pgTable('a', {
  col: integer().primaryKey(),
  name: text().notNull(),
});

function createQuery() {
  return drizzle.mock().select().from(table).$dynamic();
}

function createField() {
  return new ResourceField({
    column: table.name,
    isSortable: true,
    allowedFilters: [],
  });
}

describe('ArrayContainsFilter', () => {
  it('applies ilike filter to the selected column', () => {
    const query = createQuery();
    const field = createField();
    const filter = new TextContainsFilter(field, 'search_text');

    filter.applyTo(query);

    expect(query.toSQL()).toMatchObject({
      sql: expect.stringContaining('ilike $1'),
      params: ['%search_text%'],
    });
  });
});
