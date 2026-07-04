<script setup>
import { ref } from 'vue'

const faqs = [
  {
    q: 'Продукция оригинальная?',
    a: 'Да, работаем только с проверенными поставщиками. Каждую партию проверяем по кодам на упаковке — можете проверить свой девайс на сайте производителя.',
  },
  {
    q: 'Как оплатить заказ?',
    a: 'Оплата при получении или переводом — детали обсуждаются с менеджером в Telegram. Предоплата не требуется.',
  },
  {
    q: 'Сколько ждать доставку?',
    a: 'По городу доставляем в день заказа. В другие города отправляем СДЭК или Почтой — обычно 2–5 дней.',
  },
  {
    q: 'Можно вернуть товар?',
    a: 'Если девайс оказался бракованным — заменим бесплатно. Напишите менеджеру в течение 24 часов после получения.',
  },
  {
    q: 'Есть ли скидки?',
    a: 'Да! Подписчикам Telegram-канала — скидка 10% на первый заказ, плюс регулярные акции и розыгрыши в канале.',
  },
]

const openIdx = ref(0)

function toggle(i) {
  openIdx.value = openIdx.value === i ? -1 : i
}
</script>

<template>
  <section id="faq" class="section">
    <div class="container faq-container">
      <h2 class="section-title">Частые вопросы</h2>
      <p class="section-subtitle">Не нашли ответ — напишите нам в Telegram.</p>
      <div class="faq-list">
        <div
          v-for="(f, i) in faqs"
          :key="i"
          class="faq-item"
          :class="{ open: openIdx === i }"
        >
          <button class="faq-q" @click="toggle(i)">
            {{ f.q }}
            <span class="faq-arrow">▾</span>
          </button>
          <div v-show="openIdx === i" class="faq-a">{{ f.a }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-container {
  max-width: 760px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.faq-item.open {
  border-color: var(--accent);
}

.faq-q {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: none;
  color: var(--text);
  font-weight: 700;
  font-size: 1rem;
  text-align: left;
  padding: 18px 22px;
}

.faq-arrow {
  transition: transform 0.2s;
  color: var(--text-muted);
}

.faq-item.open .faq-arrow {
  transform: rotate(180deg);
  color: var(--accent);
}

.faq-a {
  padding: 0 22px 18px;
  color: var(--text-muted);
  font-size: 0.95rem;
}
</style>
