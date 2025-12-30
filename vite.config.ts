import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ Fixes MIME type and path issues on Netlify
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '::',
    port: 8080,
    proxy: process.env.NODE_ENV === 'development'
      ? { '/api': 'http://localhost:5000' } // only for local dev
      : undefined,
  },
});
