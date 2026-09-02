import { drizzle } from 'drizzle-orm/node-postgres';

export function createDb(connectionString: string) {
  return drizzle(connectionString);
}

export type DbConnection = ReturnType<typeof createDb>;
