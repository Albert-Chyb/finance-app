import type { PgSelect } from 'drizzle-orm/pg-core';
import type { ResourceField } from './resource-field.js';
import { asc, desc } from 'drizzle-orm';
import type { SortDirection } from './sort-direction.js';

export class Sort {
  constructor(
    public field: ResourceField,
    public direction: SortDirection,
  ) {}

  applyTo<T extends PgSelect>(builder: T) {
    builder.orderBy(
      this.direction === 'asc'
        ? asc(this.field.column)
        : desc(this.field.column),
    );
  }
}
