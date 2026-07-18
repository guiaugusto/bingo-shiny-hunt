import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site is served from /<repo-name>/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/bingo-shiny-hunt/',
  server: {
    // Bind mounts (e.g. Docker Desktop on Windows/Mac) don't always emit
    // native fs events, so hot reload needs polling to pick up changes.
    watch: {
      usePolling: mode === 'docker',
    },
  },
}));
