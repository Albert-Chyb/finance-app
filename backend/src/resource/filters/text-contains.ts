import type { PgSelect } from 'drizzle-orm/pg-core';
import { ilike } from 'drizzle-orm';
import { Filter } from './filter.js';

export class TextContainsFilter extends Filter {
  applyTo<T extends PgSelect>(builder: T) {
    builder.where(ilike(this.field.column, `%${this.value}%`));
  }
}
