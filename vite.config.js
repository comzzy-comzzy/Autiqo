import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      jsonwebtoken: fileURLToPath(new URL('./src/lib/jsonwebtoken-browser.js', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
