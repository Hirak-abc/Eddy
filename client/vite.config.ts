import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        // Must match the port the Express server actually binds. server/.env
        // sets PORT=5001 (5000 is taken by macOS AirPlay Receiver on this
        // machine). Override with VITE_DEV_API_TARGET if your port differs.
        target: process.env.VITE_DEV_API_TARGET ?? 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
