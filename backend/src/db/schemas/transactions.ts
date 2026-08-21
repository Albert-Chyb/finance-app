import { integer, timestamp, snakeCase, check } from 'drizzle-orm/pg-core';
import { categories } from './categories.js';
import { wallets } from './wallets.js';
import { sql } from 'drizzle-orm';

export const transactions = snakeCase.table(
  'transactions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    categoryId: integer()
      .notNull()
      .references(() => categories.id),
    walletId: integer()
      .notNull()
      .references(() => wallets.id),
    date: timestamp().notNull().defaultNow(),
    amount: integer().notNull(),
  },
  (table) => [check('transaction_amount_not_zero', sql`${table.amount} <> 0`)],
);
