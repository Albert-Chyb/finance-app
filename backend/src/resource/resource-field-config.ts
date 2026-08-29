import type { AnyPgColumn } from 'drizzle-orm/pg-core';

import type { FilterOperator } from './filters/filter-operator.js';

export interface ResourceFieldConfig {
  column: AnyPgColumn;
  isSortable: boolean;
  allowedFilters: FilterOperator[];
}
