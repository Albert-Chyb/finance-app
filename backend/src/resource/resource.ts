import { ResourceField } from './resource-field.js';
import type { ResourceConfig } from './resource-config.js';
import type { PgTable } from 'drizzle-orm/pg-core';

export class Resource {
  public table: PgTable;

  constructor(private config: ResourceConfig) {
    this.table = config.table;
  }

  getField(name: string): ResourceField | null {
    const field = this.config.fields[name];
    if (!field) return null;
    return field;
  }
}
