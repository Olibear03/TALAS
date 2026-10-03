import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Fresh in-memory IndexedDB per test file via fake-indexeddb.
    setupFiles: ['./src/data/__tests__/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
})
