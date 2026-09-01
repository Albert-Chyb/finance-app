import { ResourceField } from './resource-field.js';
import { PgTable } from 'drizzle-orm/pg-core';
import type { Sort } from './sort.js';
import { z } from 'zod';

export interface ResourceConfig {
  table: PgTable;
  /* A field that uniquely identifies a record  */
  identifierField: ResourceField;
  defaultSort: Sort;
  fields: Record<string, ResourceField>;
  insertSchema: z.ZodObject;
}
