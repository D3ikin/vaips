<script setup>
import { computed, ref } from 'vue'
import { useStore } from '../composables/useStore.js'
import { useCart } from '../composables/useCart.js'
import CryptoPayment from './CryptoPayment.vue'

const { store, tgManagerName, tgManagerUrl } = useStore()
const { state, totalPrice, changeQty, remove, close } = useCart()

const orderSent = ref(false)
const payMethod = ref('cash') // 'cash' | 'crypto'
const cryptoCoinId = ref(store.wallets[0]?.id)

const paymentLine = computed(() => {
  if (payMethod.value === 'crypto') {
    const w = store.wallets.find((w) => w.id === cryptoCoinId.value)
    return `Оплата: криптовалютой ${w.name} (${w.network}), хеш транзакции пришлю в чат`
  }
  return 'Оплата: при получении / перевод'
})

function buildOrderText() {
  const lines = state.items.map(
    (i) =>
      `• ${store.model.name} — ${i.flavor.name} × ${i.qty} = ${i.qty * store.model.price} ${store.currency}`
  )
  return [
    `Заказ с сайта ${store.shopName}:`,
    ...lines,
    `Итого: ${totalPrice.value} ${store.currency}`,
    paymentLine.value,
  ].join('\n')
}

async function checkout() {
  const text = buildOrderText()
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // если буфер обмена недоступен — заказ всё равно виден в открытом чате
  }
  orderSent.value = true
  window.open(tgManagerUrl.value, '_blank', 'noopener')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="state.isOpen" class="overlay" @click.self="close">
        <aside class="drawer">
          <div class="drawer-head">
            <h3>Корзина</h3>
            <button class="close-btn" @click="close" aria-label="Закрыть">✕</button>
          </div>

          <div v-if="!state.items.length" class="empty">
            <span class="empty-icon">🛒</span>
            <p>Корзина пуста</p>
            <a href="#catalog" class="btn btn-primary" @click="close">К каталогу</a>
          </div>

          <template v-else>
            <ul class="items">
              <li v-for="item in state.items" :key="item.flavor.id" class="item">
                <div
                  class="item-thumb"
                  :style="{ background: `linear-gradient(135deg, ${item.flavor.colors[0]}33, ${item.flavor.colors[1]}22)` }"
                >
                  <img :src="item.flavor.image" :alt="item.flavor.name" class="item-img" />
                </div>
                <div class="item-info">
                  <div class="item-name">{{ item.flavor.name }}</div>
                  <div class="item-flavor">{{ item.flavor.ru }}</div>
                  <div class="item-price">{{ store.model.price }} {{ store.currency }}</div>
                </div>
                <div class="item-controls">
                  <button class="qty-btn" @click="changeQty(item, -1)">−</button>
                  <span class="qty">{{ item.qty }}</span>
                  <button class="qty-btn" @click="changeQty(item, 1)">+</button>
                  <button class="remove-btn" @click="remove(item)" aria-label="Удалить">🗑</button>
                </div>
              </li>
            </ul>

            <div class="drawer-footer">
              <div class="total">
                <span>Итого</span>
                <strong>{{ totalPrice }} {{ store.currency }}</strong>
              </div>

              <div class="pay-methods">
                <button
                  class="pay-btn"
                  :class="{ active: payMethod === 'cash' }"
                  @click="payMethod = 'cash'"
                >
                  💳 При получении
                </button>
                <button
                  class="pay-btn"
                  :class="{ active: payMethod === 'crypto' }"
                  @click="payMethod = 'crypto'"
                >
                  🪙 Криптой онлайн
                </button>
              </div>

              <CryptoPayment
                v-if="payMethod === 'crypto'"
                v-model="cryptoCoinId"
                :total-price="totalPrice"
              />

              <button class="btn btn-tg checkout-btn" @click="checkout">
                Оформить через Telegram
              </button>
              <p v-if="orderSent" class="hint success">
                ✅ Заказ скопирован в буфер обмена — вставьте его в чат
                @{{ tgManagerName }} и отправьте.
              </p>
              <p v-else-if="payMethod === 'crypto'" class="hint">
                Оплатите на адрес выше, затем нажмите кнопку — заказ
                скопируется, откроется чат с менеджером. Вставьте заказ и
                добавьте хеш транзакции.
              </p>
              <p v-else class="hint">
                Нажмите кнопку — состав заказа скопируется, откроется чат с
                менеджером. Просто вставьте и отправьте.
              </p>
            </div>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: min(420px, 100%);
  background: var(--bg-soft);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.drawer-head h3 {
  font-size: 1.25rem;
}

.close-btn {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
}

.items {
  list-style: none;
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-thumb {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.item-img {
  height: 48px;
  object-fit: contain;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.item-flavor {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.item-price {
  font-size: 0.85rem;
  font-weight: 600;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  font-weight: 700;
}

.qty {
  min-width: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.remove-btn {
  background: none;
  font-size: 0.9rem;
  margin-left: 4px;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.pay-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.pay-btn {
  background: var(--card);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 10px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.15s;
}

.pay-btn.active {
  color: var(--text);
  border-color: var(--accent);
  background: rgba(139, 92, 246, 0.12);
}

.checkout-btn {
  width: 100%;
}

.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.hint.success {
  color: #4ade80;
}
</style>
