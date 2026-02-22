/// <reference types="vitest"/>
/// <reference types="vite/client"/>
/// <reference types="jest"/>

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ⬅ bitno za Docker
    port: 5173, // Fiksirani port
    strictPort: true, // Ako je port zauzet, baci grešku
    watch: {
      usePolling: true, // ⬅ rešava problem sa Windows + volume
      interval: 300
    },
    proxy: {
      '/profile': 'http://127.0.0.1:8000',
      '/login': 'http://127.0.0.1:8000',
      '/register': 'http://127.0.0.1:8000',
      '/logout': 'http://127.0.0.1:8000',
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/test/setup.ts'
  }
});
