import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { FilterOperator } from '../query-params/parse-filter-query.js';

export interface ResourceFieldConfig {
  column: AnyPgColumn;
  isSortable: boolean;
  allowedFilters: FilterOperator[];
}
