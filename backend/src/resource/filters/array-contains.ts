import type { PgSelect } from 'drizzle-orm/pg-core';
import { arrayContains } from 'drizzle-orm';
import { Filter } from './filter.js';

export class ArrayContainsFilter extends Filter {
  applyTo<T extends PgSelect>(builder: T) {
    builder.where(arrayContains(this.field.column, this.value));
  }
}
