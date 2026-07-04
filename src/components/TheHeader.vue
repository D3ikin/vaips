<script setup>
import { useStore } from '../composables/useStore.js'
import { useCart } from '../composables/useCart.js'

const { store, tgChannelUrl } = useStore()
const { totalCount, open } = useCart()
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <a href="#" class="logo">
        <span class="logo-mark">💨</span> {{ store.shopName }}
      </a>
      <nav class="nav">
        <a href="#catalog">Каталог</a>
        <a href="#delivery">Доставка</a>
        <a href="#faq">Вопросы</a>
      </nav>
      <div class="header-actions">
        <a :href="tgChannelUrl" target="_blank" rel="noopener" class="tg-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.57 8.16l-1.97 9.28c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.29.29-.6.29l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95l11.57-4.46c.53-.2 1 .13.83.94z"/>
          </svg>
          <span class="tg-link-text">Наш канал</span>
        </a>
        <button class="cart-btn" @click="open" aria-label="Корзина">
          🛒
          <span v-if="totalCount" class="cart-badge">{{ totalCount }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(11, 11, 18, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 16px;
}

.logo {
  font-weight: 800;
  font-size: 1.25rem;
  text-decoration: none;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav {
  display: flex;
  gap: 28px;
}

.nav a {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.15s;
}

.nav a:hover {
  color: var(--text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tg-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--tg);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.cart-btn {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--accent-grad);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

@media (max-width: 640px) {
  .nav,
  .tg-link-text {
    display: none;
  }
}
</style>
