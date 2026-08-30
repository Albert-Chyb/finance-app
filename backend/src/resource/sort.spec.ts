import { drizzle } from 'drizzle-orm/node-postgres';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { ResourceField } from './resource-field.js';
import { Sort } from './sort.js';

const records = pgTable('test_records', {
  id: integer().primaryKey(),
  name: text().notNull(),
});

describe('Sort', () => {
  it('applies ascending order to the selected field', () => {
    const query = createQuery();

    new Sort(createNameField(), 'asc').applyTo(query.$dynamic());

    expect(query.toSQL()).toMatchObject({
      sql: expect.stringContaining('order by "test_records"."name"'),
      params: [],
    });
  });

  it('applies descending order to the selected field', () => {
    const query = createQuery();

    new Sort(createNameField(), 'desc').applyTo(query.$dynamic());

    expect(query.toSQL()).toMatchObject({
      sql: expect.stringContaining('order by "test_records"."name" desc'),
      params: [],
    });
  });
});

function createQuery() {
  return drizzle.mock().select().from(records);
}

function createNameField() {
  return new ResourceField({
    column: records.name,
    isSortable: true,
    allowedFilters: [],
  });
}
