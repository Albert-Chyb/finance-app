import { parsePaginationQuery } from './parse-pagination-query.js';
import { parseSortQuery } from './parse-sort-query.js';
import { parseFilterQuery } from './parse-filter-query.js';
import { type ResourceQueryRequest } from './resource-query-request.js';

export function parseResourceQuery(
  searchParams: URLSearchParams,
): ResourceQueryRequest {
  const pagination = parsePaginationQuery(searchParams);
  const sort = parseSortQuery(searchParams);
  const filters = parseFilterQuery(searchParams);

  return {
    pagination,
    sort,
    filters,
  };
}
