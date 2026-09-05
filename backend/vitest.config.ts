import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './src/tests/setup/global.ts',
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
