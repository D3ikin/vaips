<script setup>
import { useStore } from '../composables/useStore.js'

const { store, tgChannelUrl, tgManagerUrl } = useStore()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">💨 {{ store.shopName }}</div>
          <p class="footer-note">
            Одноразовые электронные сигареты с доставкой.
            Заказ и консультации — в Telegram.
          </p>
        </div>
        <div class="footer-links">
          <a href="#catalog">Каталог</a>
          <a href="#delivery">Доставка</a>
          <a href="#faq">Вопросы</a>
          <a :href="tgChannelUrl" target="_blank" rel="noopener">Telegram-канал</a>
          <a :href="tgManagerUrl" target="_blank" rel="noopener">Написать менеджеру</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="age-badge">18+</span>
        <p>
          Продукция содержит никотин, вызывающий зависимость. Продажа
          несовершеннолетним запрещена. © {{ year }} {{ store.shopName }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 32px;
  background: var(--bg-soft);
}

.footer-grid {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.footer-logo {
  font-weight: 800;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.footer-note {
  color: var(--text-muted);
  font-size: 0.9rem;
  max-width: 320px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--text);
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.age-badge {
  flex-shrink: 0;
  border: 2px solid #f87171;
  color: #f87171;
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.85rem;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>
