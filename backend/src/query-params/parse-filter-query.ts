export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

const FILTER_PARAM_PATTERN = /^filter\[([^\]]+)\]\[([^\]]+)\]$/;
const NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;
const FILTER_OPERATORS: readonly FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'contains',
];

function isFilterOperator(operator: string): operator is FilterOperator {
  return FILTER_OPERATORS.includes(operator as FilterOperator);
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
export function parseFilterQuery(searchParams: URLSearchParams): Filter[] {
  const filters: Filter[] = [];

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
