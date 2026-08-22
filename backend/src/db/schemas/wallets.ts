import {
  integer,
  timestamp,
  snakeCase,
  text,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const wallets = snakeCase.table(
  'wallets',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    initialBalance: integer().notNull().default(0),
  },
  (table) => [
    check('wallets_name_not_blank', sql`length(trim(${table.name})) > 0`),
    check('wallets_name_max_length', sql`length(trim(${table.name})) <= 50`),
    check(
      'wallets_initial_balance_greather_or_equal_to_zero',
      sql`${table.initialBalance} >= 0`,
    ),
  ],
);
