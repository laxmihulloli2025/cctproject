import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Automatically adapt base path for Vercel, Render, Netlify (root /) and GitHub Pages (/cctproject/)
  base: process.env.VERCEL || process.env.RENDER || process.env.NETLIFY ? '/' : (process.env.GITHUB_ACTIONS ? '/cctproject/' : './'),
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
