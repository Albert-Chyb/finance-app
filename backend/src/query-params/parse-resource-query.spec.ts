import { describe, expect, it } from 'vitest';
import { parseResourceQuery } from './parse-resource-query.js';

describe('parseTableQuery', () => {
  it('parses the query params', () => {
    const params = new URLSearchParams();
    params.set('sort', 'name:asc');
    params.set('pageIndex', '1');
    params.set('pageSize', '10');
    params.set('filter[name][eq]', 'john');

    expect(parseResourceQuery(params)).toEqual({
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
      fieldQueries: new Map([
        [
          'name',
          {
            sort: {
              direction: 'asc',
              field: 'name',
            },
            filter: {
              field: 'name',
              operator: 'eq',
              value: 'john',
            },
          },
        ],
      ]),
    });
  });

  //   TODO: Test scenario when a field has only sort or filter.
});
