<script setup>
import { ref } from 'vue'
import { useStore } from '../composables/useStore.js'
import { useCart } from '../composables/useCart.js'

const { store } = useStore()

const props = defineProps({
  flavor: { type: Object, required: true },
})

const { add } = useCart()
const added = ref(false)

function addToCart() {
  add(props.flavor)
  added.value = true
  setTimeout(() => (added.value = false), 1200)
}
</script>

<template>
  <article class="card">
    <div
      class="card-visual"
      :style="{ background: `radial-gradient(circle at 50% 20%, ${flavor.colors[0]}33, transparent 70%), linear-gradient(160deg, ${flavor.colors[0]}22, ${flavor.colors[1]}18)` }"
    >
      <img
        :src="flavor.image"
        :alt="`${store.model.name} — ${flavor.name}`"
        loading="lazy"
        class="card-img"
      />
      <span v-if="flavor.badge" class="card-badge">{{ flavor.badge }}</span>
    </div>
    <div class="card-body">
      <div class="card-ru">{{ flavor.ru }}</div>
      <h3 class="card-name">{{ flavor.name }}</h3>
      <div class="card-footer">
        <span class="card-price">{{ store.model.price }} {{ store.currency }}</span>
        <button
          class="btn btn-primary card-add"
          :class="{ added }"
          @click="addToCart"
        >
          {{ added ? '✓ Добавлено' : 'В корзину' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.card-visual {
  position: relative;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-img {
  height: 210px;
  object-fit: contain;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.45));
  transition: transform 0.25s;
}

.card:hover .card-img {
  transform: scale(1.05) rotate(-2deg);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--accent-grad);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.card-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-ru {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 4px 0 14px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}

.card-price {
  font-size: 1.2rem;
  font-weight: 800;
}

.card-add {
  padding: 10px 18px;
  font-size: 0.9rem;
}

.card-add.added {
  background: #16a34a;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35);
}
</style>
