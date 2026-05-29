import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

// Repo-root `.env` (ANTHROPIC_API_KEY, etc.) for integration tests.
loadEnv({ path: resolve(import.meta.dirname, '../../.env') })

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['src/**/*.integration.test.ts'],
    server: {
      deps: {
        inline: ['@react-pdf/renderer', '@identity-kit/pdf-chrome'],
      },
    },
  },
})
