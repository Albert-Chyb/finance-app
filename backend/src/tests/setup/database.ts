import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export async function setupDatabase() {
  const container = await new PostgreSqlContainer('postgres:17')
    .withDatabase('postgres')
    .withUser('postgres')
    .withPassword('postgres')
    .start();
  const connectionString = container.getConnectionUri();
  process.env.DATABASE_URL = connectionString;
  const pool = new Pool({
    connectionString,
  });
  const db = drizzle({ client: pool });
  await migrate(db, {
    migrationsFolder: './drizzle',
  });

  return async () => {
    await pool.end();
    await container.stop();
  };
}
