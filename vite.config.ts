import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be turned off by setting DISABLE_HMR=true, which some hosted
      // environments do to prevent flicker while files are being written.
      hmr: process.env.DISABLE_HMR !== 'true',
      // When HMR is off, skip file watching too so we are not burning CPU.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
