import { ResourceField } from './resource-field.js';
import { PgTable } from 'drizzle-orm/pg-core';
import type { Sort } from './sort.js';

export interface ResourceConfig {
  table: PgTable;
  defaultSort: Sort;
  fields: Record<string, ResourceField>;
}
