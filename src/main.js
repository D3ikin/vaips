import { createApp } from 'vue'
import App from './App.vue'
import { loadStore } from './composables/useStore.js'
import './assets/main.css'

// сначала подтягиваем данные магазина, потом монтируем приложение
loadStore().finally(() => {
  createApp(App).mount('#app')
})
