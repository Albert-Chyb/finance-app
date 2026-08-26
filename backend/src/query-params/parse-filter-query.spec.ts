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
      { field: 'age', operator: 'gte', value: 18 },
    ]);
  });

  it('ignores query parameters that are not filters', () => {
    const params = new URLSearchParams(
      'page=2&filter[status][eq]=active&sort=createdAt:desc',
    );

    expect(parseFilterQuery(params)).toEqual([
      { field: 'status', operator: 'eq', value: 'active' },
    ]);
  });

  it('ignores filters with unsupported operators', () => {
    const params = new URLSearchParams(
      'filter[status][matches]=active&filter[age][gte]=18',
    );

    expect(parseFilterQuery(params)).toEqual([
      { field: 'age', operator: 'gte', value: 18 },
    ]);
  });

  it('keeps non-numeric values as strings', () => {
    const params = new URLSearchParams('filter[code][eq]=001A');

    expect(parseFilterQuery(params)).toEqual([
      { field: 'code', operator: 'eq', value: '001A' },
    ]);
  });
});
