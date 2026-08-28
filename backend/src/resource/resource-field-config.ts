import type { AnyColumn } from 'drizzle-orm';
import type { FilterOperator } from '../query-params/parse-filter-query.js';

export interface ResourceFieldConfig {
  column: AnyColumn;
  isSortable: boolean;
  allowedFilters: FilterOperator[];
}
