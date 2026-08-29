import type { FilterOperator } from '../../query-params/parse-filter-query.js';
import { ArrayContainsFilter } from './array-contains.js';
import { TextContainsFilter } from './text-contains.js';
import type { FilterConstructor } from './filter-constructor.js';

export function getFilterConstructor(
  operator: FilterOperator,
): FilterConstructor | null {
  switch (operator) {
    case 'array-contains':
      return ArrayContainsFilter;

    case 'text-contains':
      return TextContainsFilter;

    default:
      return null;
  }
}
