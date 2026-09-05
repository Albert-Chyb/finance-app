import { setupDatabase } from './database.js';

export default async function setup() {
  const teardownDatabase = await setupDatabase();

  return async () => {
    await teardownDatabase();
  };
}
