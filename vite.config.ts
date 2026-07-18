import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site is served from /<repo-name>/
export default defineConfig({
  plugins: [react()],
  base: '/bingo-shiny-hunt/',
});
