import type { Handler } from 'hono';
import type { Resource } from './resource.js';
import { db } from '../setup/db-connection.js';
import { parseResourceQuery } from '../query-params/parse-resource-query.js';
import type { AnyPgColumn, PgSelect } from 'drizzle-orm/pg-core';
import type { ResourceQueryRequest } from '../query-params/resource-query-request.js';

export class ResourceApi {
  constructor(public resource: Resource) {}

  get(): Handler {
    return async (ctx) => {
      const { searchParams } = new URL(ctx.req.raw.url);
      const q = db
        .select(this.buildSelectColumns())
        .from(this.resource.table)
        .$dynamic();
      const queryRequest = parseResourceQuery(searchParams);
      const result = await this.applyResourceQueryRequest(q, queryRequest);
      return ctx.json(result);
    };
  }

  private buildSelectColumns(): Record<string, AnyPgColumn> {
    return Object.fromEntries(
      Object.entries(this.resource.getFields()).map(([fieldName, field]) => [
        fieldName,
        field.column,
      ]),
    );
  }

  private applyResourceQueryRequest<T extends PgSelect>(
    builder: T,
    query: ResourceQueryRequest,
  ) {
    this.resource.resolvePagination(query.pagination).applyTo(builder);

    for (let sortRequest of query.sort)
      this.resource.resolveSort(sortRequest)?.applyTo(builder);

    for (let filterRequest of query.filters)
      this.resource.resolveFilter(filterRequest)?.applyTo(builder);

    return builder;
  }
}
