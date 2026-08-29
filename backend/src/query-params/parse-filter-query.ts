import {
  type FilterOperator,
  filterOperatorSchema,
} from '../resource/filters/filter-operator.js';

export interface FilterRequest {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

const FILTER_PARAM_PATTERN = /^filter\[([^\]]+)\]\[([^\]]+)\]$/;
const NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;

function isFilterOperator(operator: string): operator is FilterOperator {
  const { success } = filterOperatorSchema.safeParse(operator);
  return success;
}

function parseFilterValue(value: string): string | number {
  if (!NUMBER_PATTERN.test(value)) {
    return value;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : value;
}

/**
 * Converts nested filter query parameters into filter objects.
 *
 * Example input:
 *   filter[firstName][contains]=john&filter[age][gte]=18
 *
 * Example output:
 *   [
 *     { field: 'firstName', operator: 'contains', value: 'john' },
 *     { field: 'age', operator: 'gte', value: 18 }
 *   ]
 */
export function parseFilterQuery(
  searchParams: URLSearchParams,
): FilterRequest[] {
  const filters: FilterRequest[] = [];

  for (const [key, value] of searchParams) {
    const match = FILTER_PARAM_PATTERN.exec(key);

    if (!match) {
      continue;
    }

    const [, field, operator] = match;

    if (!isFilterOperator(operator)) {
      continue;
    }

    filters.push({
      field,
      operator,
      value: parseFilterValue(value),
    });
  }

  return filters;
}
