import {
  snakeCase,
  integer,
  text,
  timestamp,
  check,
} from 'drizzle-orm/pg-core';
import { categoryColor } from './category_color_enum.js';
import { sql } from 'drizzle-orm';

export const categories = snakeCase.table(
  'categories',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    color: categoryColor(),
  },
  (table) => [
    check('categories_name_not_blank', sql`length(trim(${table.name})) > 0`),
    check('categories_name_max_length', sql`length(trim(${table.name})) <= 50`),
  ],
);
