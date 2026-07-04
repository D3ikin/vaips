<script setup>
import { useStore } from '../composables/useStore.js'

const { tgChannelLabel, tgChannelUrl } = useStore()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="cta">
        <div class="cta-content">
          <h2>Подпишись на наш Telegram-канал</h2>
          <p>
            Новинки раньше всех, розыгрыши и <strong>скидка 10% на первый
            заказ</strong> для подписчиков. Все акции публикуем только в канале.
          </p>
          <a :href="tgChannelUrl" target="_blank" rel="noopener" class="btn btn-tg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.57 8.16l-1.97 9.28c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.29.29-.6.29l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95l11.57-4.46c.53-.2 1 .13.83.94z"/>
            </svg>
            {{ tgChannelLabel }}
          </a>
        </div>
        <div class="cta-visual" aria-hidden="true">📲</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: linear-gradient(135deg, rgba(42, 171, 238, 0.15), rgba(139, 92, 246, 0.15));
  border: 1px solid rgba(42, 171, 238, 0.3);
  border-radius: 24px;
  padding: 48px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
}

.cta h2 {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: 12px;
}

.cta p {
  color: var(--text-muted);
  max-width: 520px;
  margin-bottom: 24px;
}

.cta p strong {
  color: var(--text);
}

.cta-visual {
  font-size: 6rem;
}

@media (max-width: 640px) {
  .cta {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }
  .cta-visual {
    display: none;
  }
}
</style>
