<script setup>
import { ref } from 'vue'
import { useStore } from '../composables/useStore.js'

const { store } = useStore()

const confirmed = ref(localStorage.getItem('age-confirmed') === '1')
const denied = ref(false)

function confirm() {
  localStorage.setItem('age-confirmed', '1')
  confirmed.value = true
}

function deny() {
  denied.value = true
}
</script>

<template>
  <div v-if="!confirmed" class="age-gate">
    <div class="age-modal">
      <div class="age-icon">🔞</div>
      <h2>Вам есть 18 лет?</h2>
      <p>
        Сайт {{ store.shopName }} содержит информацию о никотиносодержащей
        продукции и предназначен только для совершеннолетних.
      </p>
      <template v-if="!denied">
        <div class="age-actions">
          <button class="btn btn-primary" @click="confirm">Да, мне есть 18</button>
          <button class="btn btn-ghost" @click="deny">Нет</button>
        </div>
      </template>
      <p v-else class="age-denied">
        Доступ разрешён только совершеннолетним. Пожалуйста, покиньте сайт.
      </p>
    </div>
  </div>
</template>

<style scoped>
.age-gate {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(11, 11, 18, 0.92);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.age-modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 32px;
  max-width: 440px;
  text-align: center;
}

.age-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.age-modal h2 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.age-modal p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.age-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.age-denied {
  color: #f87171;
  font-weight: 600;
}
</style>
