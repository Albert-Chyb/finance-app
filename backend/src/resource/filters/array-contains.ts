import type { PgSelect } from 'drizzle-orm/pg-core';
import { arrayOverlaps } from 'drizzle-orm';
import { Filter } from './filter.js';

export class ArrayContainsFilter extends Filter {
  applyTo<T extends PgSelect>(builder: T) {
    builder.where(arrayOverlaps(this.field.column, this.value));
  }
}
