// Example: &sort=lastName:asc,createdAt:desc

// Handle whitespace around comma-separated sort expressions.
// Example: &sort=lastName:asc , createdAt:desc
// Trim each expression after splitting.

// Handle consecutive commas.
// Example: &sort=lastName:asc,,createdAt:desc
// Ignore empty expressions after splitting.

// Handle whitespace around the field and direction.
// Example: lastName : asc
// Trim both values after splitting.

// Normalize the direction to lowercase.
// Example: lastName:ASC
// Treat the direction as "asc".

// Handle a missing field name.
// Example: :asc
// Ignore sort expressions without a field name.

// Handle a missing direction.
// Example: lastName:
// Use the default sort direction.

// Handle an invalid direction.
// Example: lastName:a
// Use the default sort direction.

// Handle a missing colon and direction.
// Example: lastName
// Treat the entire value as the field name and use the default direction.

export type SortDirection = 'asc' | 'desc';

export const SORT_QUERY_PARAM_KEY = 'sort';

const DEFAULT_SORT_DIRECTION: SortDirection = 'asc';

export interface SortRequest {
  field: string;
  direction: SortDirection;
}

/**
 * Splits a sort parameter into individual sort expressions.
 *
 * Example:
 *   "lastName:asc, createdAt:desc"
 *   → ["lastName:asc", "createdAt:desc"]
 *
 * Empty expressions are ignored.
 */
function splitSortExpressions(paramValue: string): string[] {
  return paramValue
    .split(',')
    .map((expression) => expression.trim())
    .filter(Boolean);
}

/**
 * Extracts the field name and direction from a sort expression.
 *
 * Example:
 *   "lastName : ASC"
 *   → { field: "lastName", direction: "ASC" }
 */
function parseSortExpression(expression: string): {
  field: string;
  direction?: string;
} {
  const [field, direction] = expression.split(':');

  return {
    field: field.trim(),
    direction: direction?.trim(),
  };
}

/**
 * Normalizes a sort direction.
 *
 * Missing or invalid directions use the default direction.
 */
function normalizeSortDirection(direction?: string): SortDirection {
  const normalizedDirection = direction?.toLowerCase();

  if (normalizedDirection === 'asc' || normalizedDirection === 'desc') {
    return normalizedDirection;
  }

  return DEFAULT_SORT_DIRECTION;
}

/**
 * Converts the `sort` query parameter into sort objects.
 *
 * The parser tolerates common formatting errors, such as extra whitespace,
 * empty comma-separated expressions, missing directions, and invalid directions.
 *
 * Example input:
 *   lastName:asc, createdAt:desc
 *
 * Example output:
 *   [
 *     { field: 'lastName', direction: 'asc' },
 *     { field: 'createdAt', direction: 'desc' }
 *   ]
 */
export function parseSortQuery(searchParams: URLSearchParams): SortRequest[] {
  const paramValue = searchParams.get(SORT_QUERY_PARAM_KEY) ?? '';

  return splitSortExpressions(paramValue)
    .map(parseSortExpression)
    .filter(({ field }) => field.length > 0)
    .map(({ field, direction }) => ({
      field,
      direction: normalizeSortDirection(direction),
    }));
}
