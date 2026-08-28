import { parsePaginationQuery } from './parse-pagination-query.js';
import { parseSortQuery, type Sort } from './parse-sort-query.js';
import { type Filter, parseFilterQuery } from './parse-filter-query.js';
import { type FieldQueries, type ResourceQuery } from './resource-query.js';

export function parseResourceQuery(
  searchParams: URLSearchParams,
): ResourceQuery {
  const pagination = parsePaginationQuery(searchParams);
  const sorts = parseSortQuery(searchParams);
  const filters = parseFilterQuery(searchParams);

  return {
    pagination,
    fieldQueries: createFieldQueries(sorts, filters),
  };
}

function createFieldQueries(sorts: Sort[], filters: Filter[]): FieldQueries {
  const map: FieldQueries = new Map();
  for (const sort of sorts) {
    map.set(sort.field, { sort: sort });
  }
  for (const filter of filters) {
    if (!map.has(filter.field)) map.set(filter.field, { filter });
    else {
      const fieldQuery = map.get(filter.field);
      if (fieldQuery) fieldQuery.filter = filter;
    }
  }
  return map;
}
