import { integer, snakeCase, text, check, date } from 'drizzle-orm/pg-core';
import { intervalUnit } from './interval_unit.js';
import { categories } from './categories.js';
import { wallets } from './wallets.js';
import { sql } from 'drizzle-orm';

export const recurringPayments = snakeCase.table(
  'recurring_payments',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    lastPaymentDate: date().notNull(),
    intervalCount: integer().notNull(),
    intervalUnit: intervalUnit().notNull(),
    categoryId: integer()
      .notNull()
      .references(() => categories.id),
    walletId: integer()
      .notNull()
      .references(() => wallets.id),
    amount: integer().notNull(),
  },
  (table) => [
    check(
      'recurring_payments_name_not_blank',
      sql`length(trim(${table.name})) > 0`,
    ),
    check(
      'recurring_payments_name_max_length',
      sql`length(trim(${table.name})) <= 50`,
    ),
    check('interval_count_gt_zero', sql`${table.intervalCount} > 0`),
    check('amount_not_equal_to_zero', sql`${table.amount} <> 0`),
  ],
);
