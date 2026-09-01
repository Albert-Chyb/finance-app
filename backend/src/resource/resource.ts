import { ResourceField } from './resource-field.js';
import type { ResourceConfig } from './resource-config.js';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { SortRequest } from '../query-params/parse-sort-query.js';
import { Sort } from './sort.js';
import type { PaginationRequest } from '../query-params/parse-pagination-query.js';
import { Pagination } from './pagination.js';
import type { FilterRequest } from '../query-params/parse-filter-query.js';
import { Filter } from './filters/filter.js';
import { getFilterConstructor } from './filters/get-filter-constructor.js';

export class Resource {
  public table: PgTable;
  public defaultSort: Sort;
  public identifierField: ResourceField;

  constructor(private config: ResourceConfig) {
    this.table = config.table;
    this.defaultSort = config.defaultSort;
    this.identifierField = config.identifierField;
  }

  getField(name: string): ResourceField | null {
    const field = this.config.fields[name];
    if (!field) return null;
    return field;
  }

  getFields(): Record<string, ResourceField> {
    return this.config.fields;
  }

  validateInsert(data: unknown) {
    return this.config.insertSchema.safeParse(data);
  }

  resolvePagination(paginationRequest: PaginationRequest): Pagination {
    const { pageIndex, pageSize } = paginationRequest;
    return new Pagination(pageIndex, pageSize);
  }

  resolveSort(sortRequest: SortRequest): Sort | null {
    const field = this.getField(sortRequest.field);
    if (!field || !field.isSortable()) return null;
    return new Sort(field, sortRequest.direction);
  }

  resolveFilter(filterRequest: FilterRequest): Filter | null {
    const field = this.getField(filterRequest.field);
    const operator = filterRequest.operator;
    if (!field || !field.isFilterableVia(operator)) return null;

    const Filter = getFilterConstructor(operator);
    if (!Filter) return null;
    return new Filter(field, filterRequest.value);
  }
}
