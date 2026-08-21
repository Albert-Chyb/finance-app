import { integer, snakeCase, timestamp, check } from 'drizzle-orm/pg-core';
import { wallets } from './wallets.js';
import { sql } from 'drizzle-orm';

export const transfers = snakeCase.table(
  'transfers',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sourceWalletId: integer()
      .notNull()
      .references(() => wallets.id),
    targetWalletId: integer()
      .notNull()
      .references(() => wallets.id),
    amount: integer().notNull(),
    date: timestamp().notNull().defaultNow(),
  },
  (table) => [
    check('transfers_amount_greater_than_zero', sql`${table.amount} > 0`),
    check(
      'transfers_source_and_target_wallets_are_different',
      sql`${table.sourceWalletId} <> ${table.targetWalletId}`,
    ),
  ],
);
