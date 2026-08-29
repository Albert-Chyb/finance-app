import { Filter } from './filter.js';
import type { PgSelect } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

export class EqualsFilter extends Filter {
  applyTo<T extends PgSelect>(builder: T) {
    builder.where(eq(this.field.column, this.value));
  }
}
