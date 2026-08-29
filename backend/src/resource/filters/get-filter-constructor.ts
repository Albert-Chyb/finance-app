import type { FilterOperator } from '../../query-params/parse-filter-query.js';
import { ArrayContainsFilter } from './array-contains.js';
import { TextContainsFilter } from './text-contains.js';
import type { FilterConstructor } from './filter-constructor.js';
import { EqualsFilter } from './equals.js';

const map: { [K in FilterOperator]: FilterConstructor } = {
  'array-contains': ArrayContainsFilter,
  'text-contains': TextContainsFilter,
  eq: EqualsFilter,
};

export function getFilterConstructor(
  operator: FilterOperator,
): FilterConstructor | null {
  return map[operator] ?? null;
}
