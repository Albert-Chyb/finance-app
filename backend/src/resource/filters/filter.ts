import type { ResourceField } from '../resource-field.js';
import type { PgSelect } from 'drizzle-orm/pg-core';

export abstract class Filter {
  constructor(
    public field: ResourceField,
    public value: unknown,
  ) {}

  abstract applyTo<T extends PgSelect>(builder: T): void;
}
