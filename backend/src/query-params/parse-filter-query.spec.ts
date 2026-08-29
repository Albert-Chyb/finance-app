import { describe, expect, it } from 'vitest';
import { parseFilterQuery } from './parse-filter-query.js';

describe('parseFilterQuery', () => {
  it('parses nested filter query parameters', () => {
    const params = new URLSearchParams(
      'filter[firstName][contains]=john&filter[status][eq]=active&filter[age][gte]=18',
    );

    expect(parseFilterQuery(params)).toEqual([
      { field: 'firstName', operator: 'contains', value: 'john' },
      { field: 'status', operator: 'eq', value: 'active' },
      { field: 'age', operator: 'gte', value: '18' },
    ]);
  });
});
