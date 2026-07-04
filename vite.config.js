import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GH_PAGES=1 — сборка для GitHub Pages, где сайт живёт по адресу /vaips/
  base: process.env.GH_PAGES ? '/vaips/' : '/',
  server: {
    // в dev-режиме API и загруженные картинки берём с локального сервера
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
})
