<script setup>
import { useStore } from '../composables/useStore.js'
import ProductCard from './ProductCard.vue'

const { store } = useStore()
</script>

<template>
  <section id="catalog" class="section">
    <div class="container">
      <div class="model-panel">
        <div class="model-info">
          <div class="model-brand">{{ store.model.brand }}</div>
          <h2 class="section-title">{{ store.model.name }}</h2>
          <p class="model-desc">
            Флагманская одноразка: {{ store.model.puffs.toLocaleString('ru-RU') }}
            тяг, дисплей с зарядом и уровнем жидкости, подзарядка Type-C.
            Одна цена — {{ store.model.price }} {{ store.currency }} за любой вкус.
          </p>
          <ul class="model-specs">
            <li v-for="s in store.model.specs" :key="s.label">
              <span class="spec-icon">{{ s.icon }}</span> {{ s.label }}
            </li>
          </ul>
        </div>
      </div>

      <h3 class="flavors-title">Выбери свой вкус <span class="flavors-count">{{ store.flavors.length }}</span></h3>
      <div class="grid">
        <ProductCard v-for="f in store.flavors" :key="f.id" :flavor="f" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.model-panel {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(34, 211, 238, 0.08));
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 48px;
}

.model-brand {
  color: var(--accent);
  font-weight: 800;
  letter-spacing: 3px;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.model-desc {
  color: var(--text-muted);
  max-width: 640px;
  margin: 8px 0 24px;
}

.model-specs {
  list-style: none;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.model-specs li {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
}

.spec-icon {
  margin-right: 4px;
}

.flavors-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.flavors-count {
  background: var(--accent-grad);
  color: #fff;
  font-size: 0.8rem;
  min-width: 26px;
  height: 26px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .model-panel {
    padding: 28px 22px;
  }
}
</style>
