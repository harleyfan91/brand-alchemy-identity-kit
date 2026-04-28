import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    server: {
      deps: {
        inline: ['@react-pdf/renderer', '@identity-kit/pdf-chrome'],
      },
    },
  },
})
