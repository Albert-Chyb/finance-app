import type { ResourceFieldConfig } from './resource-field-config.js';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { FilterOperator } from './filters/filter-operator.js';

export class ResourceField {
  public column: AnyPgColumn;

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
