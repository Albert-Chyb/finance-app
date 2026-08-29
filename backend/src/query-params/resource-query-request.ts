import type { FilterRequest } from './parse-filter-query.js';
import type { SortRequest } from './parse-sort-query.js';
import type { PaginationRequest } from './parse-pagination-query.js';

export interface ResourceQueryRequest {
  pagination: PaginationRequest;
  sort: SortRequest[];
  filters: FilterRequest[];
}
