import { QueryBuilder, snakeCase } from 'drizzle-orm/pg-core';
import { transactions } from './transactions.js';
import { sql } from 'drizzle-orm';

const transactionYear = sql`extract(year from ${transactions.date})`.as('year');
const transactionMonth = sql`extract(month from ${transactions.date})`.as(
  'month',
);
const qb = new QueryBuilder();

const monthlyTotals = qb
  .select({
    year: transactionYear,
    month: transactionMonth,

    totalIncome: sql<number>`
        coalesce(
            sum(case when ${transactions.amount} > 0 then ${transactions.amount} else 0 end), 
            0
        )
    `.as('total_income'),

    totalExpenses: sql<number>`
        coalesce(
            sum(case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end),    
            0
        )
    `.as('total_expenses'),

    incomeCount:
      sql<number>`count(case when ${transactions.amount} > 0 then 1 end)`.as(
        'income_count',
      ),

    expensesCount:
      sql<number>`count(case when ${transactions.amount} < 0 then 1 end)`.as(
        'expenses_count',
      ),
  })
  .from(transactions)
  .groupBy(transactionYear, transactionMonth)
  .as('monthly_totals');

export const monthlyStatistics = snakeCase.view('monthly_statistics').as((qb) =>
  qb
    .select({
      year: monthlyTotals.year,
      month: monthlyTotals.month,
      totalIncome: monthlyTotals.totalIncome,
      totalExpenses: monthlyTotals.totalExpenses,
      incomeCount: monthlyTotals.incomeCount,
      expensesCount: monthlyTotals.expensesCount,
      transactionsCount:
        sql<number>`${monthlyTotals.incomeCount} + ${monthlyTotals.expensesCount}`.as(
          'transactions_count',
        ),
      netIncome:
        sql<number>`${monthlyTotals.totalIncome} + ${monthlyTotals.totalExpenses}`.as(
          'net_income',
        ),
    })
    .from(monthlyTotals),
);
