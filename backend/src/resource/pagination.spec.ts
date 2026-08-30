import { drizzle } from 'drizzle-orm/node-postgres';
import { describe, expect, it } from 'vitest';
import { Pagination } from './pagination.js';
import { pgTable } from 'drizzle-orm/pg-core';

describe('Pagination', () => {
  it('applies page size in the limit clause', () => {
    const query = createQuery();

    new Pagination(1, 25).applyTo(query.$dynamic());

    expect(query.toSQL()).toMatchObject({
      sql: expect.stringContaining('limit $1'),
      params: [25],
    });
  });

  it('applies current page in the offset clause', () => {
    const query = createQuery();

    new Pagination(3, 25).applyTo(query.$dynamic());

    expect(query.toSQL()).toMatchObject({
      sql: expect.stringContaining('offset $2'),
      params: [25, 50],
    });
  });
});

function createQuery() {
  return drizzle.mock().select().from(pgTable('a', {}));
}
