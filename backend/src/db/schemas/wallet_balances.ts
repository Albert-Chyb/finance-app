import { QueryBuilder, snakeCase } from 'drizzle-orm/pg-core';
import { wallets } from './wallets.js';
import { eq, sql, sum } from 'drizzle-orm';
import { transactions } from './transactions.js';
import { transfers } from './transfers.js';

const qb = new QueryBuilder();

const totalTransactionsAmount = qb
  .select({
    total: sum(transactions.amount),
  })
  .from(transactions)
  .where(eq(transactions.walletId, wallets.id));

const totalOutgoingTransfers = qb
  .select({
    total: sum(transfers.amount),
  })
  .from(transfers)
  .where(eq(transfers.sourceWalletId, wallets.id));

const totalIncomingTransfers = qb
  .select({
    total: sum(transfers.amount),
  })
  .from(transfers)
  .where(eq(transfers.targetWalletId, wallets.id));

const balance = sql`
    ${wallets.initialBalance}
    + coalesce(${totalTransactionsAmount}, 0)
    + coalesce(${totalIncomingTransfers}, 0)
    - coalesce(${totalOutgoingTransfers}, 0)
`.as('balance');

export const walletBalances = snakeCase.view('wallet_balances').as((qb) =>
  qb
    .select({
      wallet_id: wallets.id.as('wallet_id'),
      balance,
    })
    .from(wallets),
);
