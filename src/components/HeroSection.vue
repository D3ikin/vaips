<script setup>
import { computed } from 'vue'
import { useStore } from '../composables/useStore.js'

const { store, tgChannelUrl } = useStore()

// первые три вкуса каталога парят в hero-блоке
const heroFlavors = computed(() => store.flavors.slice(0, 3))
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <span class="hero-tag">✦ Оригинальный {{ store.model.brand }}</span>
        <h1>
          {{ store.model.name }}<br />
          <span class="grad-text">{{ store.model.puffs.toLocaleString('ru-RU') }} тяг · {{ store.flavors.length }} вкусов</span>
        </h1>
        <p>
          Флагманская одноразка с LED-дисплеем и подзарядкой Type-C.
          Заказ в два клика через Telegram — без регистраций и предоплат.
        </p>
        <div class="hero-actions">
          <a href="#catalog" class="btn btn-primary">Смотреть каталог</a>
          <a :href="tgChannelUrl" target="_blank" rel="noopener" class="btn btn-tg">
            Telegram-канал
          </a>
        </div>
        <ul class="hero-perks">
          <li>🚀 Доставка в день заказа</li>
          <li>✅ Проверка на оригинальность</li>
          <li>🎁 Скидки подписчикам канала</li>
        </ul>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="glow"></div>
        <img
          v-for="(f, i) in heroFlavors"
          :key="f.id"
          :src="f.image"
          :alt="f.name"
          class="vape-img"
          :class="`v${i + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 80px 0 64px;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.hero-tag {
  display: inline-block;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent);
  border: 1px solid rgba(139, 92, 246, 0.35);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
}

h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 20px;
}

.grad-text {
  background: var(--accent-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 480px;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.hero-perks {
  list-style: none;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.hero-visual {
  position: relative;
  height: 420px;
}

.glow {
  position: absolute;
  inset: 20%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent 70%);
  filter: blur(40px);
}

.vape-img {
  position: absolute;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
  animation: float 5s ease-in-out infinite;
}

/* три устройства ступенькой, без наложения друг на друга */
.v1 { --rot: -8deg; top: 24%; left: 0; height: 200px; }
.v2 { --rot: 3deg; top: 0; left: 50%; margin-left: -115px; height: 230px; animation-delay: 1.2s; z-index: 2; }
.v3 { --rot: 8deg; top: 34%; right: 0; height: 200px; animation-delay: 2.4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
  50% { transform: translateY(-16px) rotate(var(--rot, 0deg)); }
}

@media (max-width: 820px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    display: none;
  }
}
</style>
