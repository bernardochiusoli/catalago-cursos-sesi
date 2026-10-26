/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento, /api e /openapi são redirecionados para a API .NET local
// (porta 5080, veja backend/Catalogo.Api/Properties/launchSettings.json).
const API = process.env.VITE_PROXY_API ?? 'http://localhost:5080'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': API,
      '/openapi': API,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
