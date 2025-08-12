import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          // Optional: class properties & other Babel plugins
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Mempermudah import file
    },
  },
  css: {
    postcss: './postcss.config.js', // Tailwind & Autoprefixer
  },
  server: {
    port: 5173,
    open: true, // otomatis buka browser
    proxy: {
      // Contoh proxy API
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // peringatan ukuran bundle
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  define: {
    // Untuk environment variables agar tidak undefined
    'process.env': {},
  },
});
// pages/Unauthorized.tsx