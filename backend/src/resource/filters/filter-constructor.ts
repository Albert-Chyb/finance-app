import type { ResourceField } from '../resource-field.js';
import { Filter } from './filter.js';

export interface FilterConstructor {
  new (field: ResourceField, value: unknown): Filter;
}
