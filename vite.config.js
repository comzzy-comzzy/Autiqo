import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      jsonwebtoken: '/src/lib/jsonwebtoken-browser.js'
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
