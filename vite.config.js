import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // в dev-режиме API и загруженные картинки берём с локального сервера
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
})
