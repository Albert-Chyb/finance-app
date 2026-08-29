export interface FilterRequest {
  field: string;
  operator: string;
  value: unknown;
}

const FILTER_PARAM_PATTERN = /^filter\[([^\]]+)\]\[([^\]]+)\]$/;

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

    filters.push({
      field,
      operator,
      value,
    });
  }

  return filters;
}
