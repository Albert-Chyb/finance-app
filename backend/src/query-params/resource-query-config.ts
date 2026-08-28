import type { AnyColumn } from 'drizzle-orm';
import type { FilterOperator } from './parse-filter-query.js';

export class FieldQueryConfig {
  constructor(
    private config: {
      column: AnyColumn;
      isSortable: boolean;
      allowedFilters: FilterOperator[];
    },
  ) {}

  get column() {
    return this.config.column;
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

export class ResourceQueryConfig {
  constructor(private config: Record<string, FieldQueryConfig>) {}

  getFieldConfig(fieldName: string): FieldQueryConfig | null {
    const fieldConfig = this.config[fieldName];
    if (!fieldConfig) return null;
    return fieldConfig;
  }
}
