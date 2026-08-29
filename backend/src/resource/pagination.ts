import type { PgSelect } from 'drizzle-orm/pg-core';

export class Pagination {
  constructor(
    public pageIndex: number,
    public pageSize: number,
  ) {}

  applyTo<T extends PgSelect>(builder: T) {
    builder.limit(this.pageSize).offset((this.pageIndex - 1) * this.pageSize);
  }
}
