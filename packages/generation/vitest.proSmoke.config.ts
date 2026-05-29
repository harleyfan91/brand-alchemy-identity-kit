import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

loadEnv({ path: resolve(import.meta.dirname, '../../.env') })

/** Live Anthropic smoke tests only — run via `npm run test:pro-smoke`. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
  },
})
