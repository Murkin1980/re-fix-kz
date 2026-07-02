import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://re-fix.kz',
  build: {
    format: 'file'
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild'
    }
  }
});
