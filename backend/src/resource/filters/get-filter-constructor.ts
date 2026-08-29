import { ArrayContainsFilter } from './array-contains.js';
import { TextContainsFilter } from './text-contains.js';
import type { FilterConstructor } from './filter-constructor.js';
import { EqualsFilter } from './equals.js';
import type { FilterOperator } from './filter-operator.js';

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
