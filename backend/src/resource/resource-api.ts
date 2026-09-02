import type { Handler } from 'hono';
import type { Resource } from './resource.js';
import type { createDb } from '../setup/db-connection.js';
import { parseResourceQuery } from '../query-params/parse-resource-query.js';
import type { AnyPgColumn, PgSelect } from 'drizzle-orm/pg-core';
import type { ResourceQueryRequest } from '../query-params/resource-query-request.js';
import { HTTPException } from 'hono/http-exception';
import { eq } from 'drizzle-orm';

export class ResourceApi {
  constructor(
    public resource: Resource,
    private db: ReturnType<typeof createDb>,
  ) {}

  get(): Handler {
    return async (ctx) => {
      const { searchParams } = new URL(ctx.req.raw.url);
      const q = this.db
        .select(this.buildSelectColumns())
        .from(this.resource.table)
        .$dynamic();
      const queryRequest = parseResourceQuery(searchParams);
      const result = await this.applyResourceQueryRequest(q, queryRequest);
      return ctx.json(result);
    };
  }

  post(): Handler {
    return async (c) => {
      const body = await c.req.json();
      const { error, data } = this.resource.validateInsert(body);
      if (error) throw new HTTPException(400, error);
      const result = await this.db.insert(this.resource.table).values(data);
      return c.json(result);
    };
  }

  put(): Handler {
    return async (c) => {
      const id = c.req.param('id');
      if (!id)
        throw new Error('The endpoint path does not contain id parameter');

      const body = await c.req.json();
      const { error, data } = this.resource.validateInsert(body);
      if (error) throw new HTTPException(400, error);

      const updatedRecord = await this.db
        .update(this.resource.table)
        .set(data)
        .where(eq(this.resource.identifierField.column, id))
        .returning();
      return c.json(updatedRecord);
    };
  }

  patch(): Handler {
    return async (c) => {
      const id = c.req.param('id');
      if (!id)
        throw new Error('The endpoint path does not contain id parameter');

      const body = await c.req.json();
      const { error, data } = this.resource.validatePatch(body);
      if (error) throw new HTTPException(400, error);
      if (Object.keys(data).length === 0)
        throw new HTTPException(400, {
          message: 'Patch body must not be empty',
        });

      const updatedRecord = await this.db
        .update(this.resource.table)
        .set(data)
        .where(eq(this.resource.identifierField.column, id))
        .returning();
      return c.json(updatedRecord);
    };
  }

  delete(): Handler {
    return async (c) => {
      const id = c.req.param('id');
      if (!id)
        throw new Error('The endpoint path does not contain id parameter');
      const deletedRecord = await this.db
        .delete(this.resource.table)
        .where(eq(this.resource.identifierField.column, id))
        .returning();
      return c.json(deletedRecord);
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

    this.applySortRequest(query, builder);

    for (let filterRequest of query.filters)
      this.resource.resolveFilter(filterRequest)?.applyTo(builder);

    return builder;
  }

  private applySortRequest<T extends PgSelect>(
    query: ResourceQueryRequest,
    builder: T,
  ) {
    let isSortApplied = false;
    for (let sortRequest of query.sort) {
      const sort = this.resource.resolveSort(sortRequest);
      if (sort) {
        isSortApplied = true;
        sort.applyTo(builder);
      }
    }
    if (!isSortApplied) this.resource.defaultSort.applyTo(builder);
  }
}
