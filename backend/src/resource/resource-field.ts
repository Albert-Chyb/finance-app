import type { FilterOperator } from '../query-params/parse-filter-query.js';
import type { ResourceFieldConfig } from './resource-field-config.js';
import type { AnyColumn } from 'drizzle-orm';

export class ResourceField {
  public column: AnyColumn;

  constructor(private config: ResourceFieldConfig) {
    this.column = config.column;
  }

  isSortable(): boolean {
    return this.config.isSortable;
  }

  isFilterableVia(operator: FilterOperator): boolean {
    return (
      this.config.allowedFilters.length > 0 &&
      this.config.allowedFilters.includes(operator)
    );
  }
}
