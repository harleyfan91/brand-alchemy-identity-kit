import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Dev-only explorer for `src/pdf/ctaFrames` (does not affect shipped PDFs). */
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  server: {
    port: 5188,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@generation': path.resolve(__dirname, '../../src'),
    },
  },
})
