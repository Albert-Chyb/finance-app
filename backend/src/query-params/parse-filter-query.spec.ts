import { describe, expect, it } from 'vitest';
import { parseFilterQuery } from './parse-filter-query.js';

describe('parseFilterQuery', () => {
  it('parses nested filter query parameters', () => {
    const params = new URLSearchParams(
      'filter[firstName][text-contains]=john&filter[status][eq]=active&filter[age][eq]=18',
    );

    expect(parseFilterQuery(params)).toEqual([
      { field: 'firstName', operator: 'text-contains', value: 'john' },
      { field: 'status', operator: 'eq', value: 'active' },
      { field: 'age', operator: 'eq', value: '18' },
    ]);
  });
});
