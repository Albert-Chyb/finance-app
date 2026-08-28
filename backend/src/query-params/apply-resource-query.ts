import type { PgSelect } from 'drizzle-orm/pg-core';
import type { Sort } from './parse-sort-query.js';
import type { Pagination } from './parse-pagination-query.js';
import type { Filter } from './parse-filter-query.js';
import {
  type AnyColumn,
  arrayContains,
  asc,
  desc,
  eq,
  gt,
  gte,
  lt,
  lte,
} from 'drizzle-orm';
import { type ResourceQueryConfig } from './resource-query-config.js';
import type { ResourceQuery } from './resource-query.js';

export function applyResourceQuery<T extends PgSelect>(
  qb: T,
  query: ResourceQuery,
  config: ResourceQueryConfig,
) {
  applyPagination(qb, query.pagination);

  for (const [fieldName, fieldQuery] of query.fieldQueries) {
    const fieldConfig = config.getFieldConfig(fieldName);
    if (!fieldConfig) continue;

    if (fieldQuery.sort && fieldConfig.isSortable())
      applySort(qb, fieldQuery.sort, fieldConfig.column);

    if (
      fieldQuery.filter &&
      fieldConfig.isFilterableVia(fieldQuery.filter.operator)
    )
      applyFilter(qb, fieldQuery.filter, fieldConfig.column);
  }

  return qb;
}

function applyPagination<T extends PgSelect>(qb: T, pagination: Pagination) {
  const { pageSize, pageIndex } = pagination;
  qb.limit(pageSize).offset((pageIndex - 1) * pageSize);
}

function applySort<T extends PgSelect>(qb: T, sort: Sort, column: AnyColumn) {
  qb.orderBy(sort.direction === 'asc' ? asc(column) : desc(column));
}

function applyFilter<T extends PgSelect>(
  qb: T,
  filter: Filter,
  column: AnyColumn,
) {
  switch (filter.operator) {
    case 'gt':
      qb.where(gt(column, filter.value));
      break;
    case 'gte':
      qb.where(gte(column, filter.value));
      break;
    case 'lt':
      qb.where(lt(column, filter.value));
      break;
    case 'lte':
      qb.where(lte(column, filter.value));
      break;
    case 'eq':
      qb.where(eq(column, filter.value));
      break;
    case 'neq':
      qb.where(eq(column, filter.value));
      break;
    case 'contains':
      qb.where(arrayContains(column, filter.value));
      break;
  }
}
