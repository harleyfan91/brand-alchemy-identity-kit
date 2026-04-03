import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')

// Workspace packages live under ../../packages; Vite's default root is apps/web, so resolution
// and fs access to those folders need explicit aliases + allow (fixes "Failed to resolve import").
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@identity-kit/shared': path.resolve(repoRoot, 'packages/shared/src/index.ts'),
      '@identity-kit/brand-assets': path.resolve(repoRoot, 'packages/brand-assets/src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  optimizeDeps: {
    include: ['@identity-kit/shared', '@identity-kit/brand-assets'],
  },
})
