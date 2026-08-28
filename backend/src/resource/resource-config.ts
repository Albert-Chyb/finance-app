import { ResourceField } from './resource-field.js';
import { PgTable } from 'drizzle-orm/pg-core';

export interface ResourceConfig {
  table: PgTable;
  fields: Record<string, ResourceField>;
}
