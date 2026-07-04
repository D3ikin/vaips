<script setup>
const steps = [
  {
    icon: '🛍️',
    title: 'Выберите товар',
    text: 'Добавьте нужные позиции и вкусы в корзину прямо на сайте.',
  },
  {
    icon: '✈️',
    title: 'Отправьте заказ в Telegram',
    text: 'Состав заказа скопируется автоматически — просто вставьте его в чат с менеджером.',
  },
  {
    icon: '💬',
    title: 'Подтвердите детали',
    text: 'Менеджер уточнит адрес и удобное время, ответит на вопросы.',
  },
  {
    icon: '📦',
    title: 'Получите заказ',
    text: 'Доставка в день заказа по городу или отправка в другие города.',
  },
]
</script>

<template>
  <section id="delivery" class="section">
    <div class="container">
      <h2 class="section-title">Как сделать заказ</h2>
      <p class="section-subtitle">
        Никаких регистраций и предоплат — всё общение в Telegram.
      </p>
      <div class="steps">
        <div v-for="(s, i) in steps" :key="i" class="step">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-icon">{{ s.icon }}</div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.step {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 22px;
}

.step-num {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--accent-grad);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.step h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.step p {
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
