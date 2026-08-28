import type { Filter } from './parse-filter-query.js';
import type { Sort } from './parse-sort-query.js';
import type { Pagination } from './parse-pagination-query.js';

interface FieldQuery {
  filter?: Filter;
  sort?: Sort;
}

export type FieldQueries = Map<string, FieldQuery>;

export interface ResourceQuery {
  pagination: Pagination;
  fieldQueries: FieldQueries;
}
