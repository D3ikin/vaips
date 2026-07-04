<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from '../composables/useStore.js'

const { store } = useStore()

const props = defineProps({
  totalPrice: { type: Number, required: true },
})

// выбранная монета (id из store.wallets), синхронизируется с родителем
const coinId = defineModel({ type: String })

const rates = ref(null) // { coingeckoId: цена в рублях }
const ratesFailed = ref(false)
const copied = ref(false)

const wallet = computed(
  () => store.wallets.find((w) => w.id === coinId.value) ?? store.wallets[0]
)

const cryptoAmount = computed(() => {
  const rate = rates.value?.[wallet.value.coingeckoId]
  if (!rate) return null
  return (props.totalPrice / rate).toFixed(wallet.value.decimals)
})

onMounted(async () => {
  try {
    const ids = store.wallets.map((w) => w.coingeckoId).join(',')
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=rub`
    )
    const data = await res.json()
    rates.value = Object.fromEntries(
      store.wallets.map((w) => [w.coingeckoId, data[w.coingeckoId]?.rub])
    )
  } catch {
    ratesFailed.value = true
  }
})

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(wallet.value.address)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // адрес виден на экране — можно скопировать вручную
  }
}
</script>

<template>
  <div class="crypto">
    <div class="coins">
      <button
        v-for="w in store.wallets"
        :key="w.id"
        class="coin-btn"
        :class="{ active: w.id === coinId }"
        @click="coinId = w.id"
      >
        {{ w.icon }} {{ w.name }}
        <span class="coin-net">{{ w.network }}</span>
      </button>
    </div>

    <div class="amount">
      <span class="amount-label">К оплате</span>
      <strong v-if="cryptoAmount" class="amount-value">
        ≈ {{ cryptoAmount }} {{ wallet.name }}
      </strong>
      <strong v-else-if="ratesFailed" class="amount-value muted">
        {{ totalPrice }} {{ store.currency }} — сумму в крипте уточнит менеджер
      </strong>
      <strong v-else class="amount-value muted">загружаем курс…</strong>
    </div>

    <div class="address-row">
      <code class="address">{{ wallet.address }}</code>
      <button class="copy-btn" :class="{ copied }" @click="copyAddress">
        {{ copied ? '✓' : '⧉' }}
      </button>
    </div>

    <p class="crypto-note">
      ⚠️ Отправляйте только <strong>{{ wallet.name }} в сети {{ wallet.network }}</strong>.
      После оплаты пришлите менеджеру хеш транзакции вместе с заказом.
    </p>
  </div>
</template>

<style scoped>
.crypto {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.coins {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.coin-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--card);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.15s;
}

.coin-btn.active {
  color: var(--text);
  border-color: var(--accent);
  background: rgba(139, 92, 246, 0.12);
}

.coin-net {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 2px 6px;
  border-radius: 6px;
}

.amount {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.amount-label {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.amount-value {
  font-size: 1.05rem;
}

.amount-value.muted {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.address-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
  margin-bottom: 12px;
}

.address {
  flex: 1;
  min-width: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.78rem;
  word-break: break-all;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
}

.copy-btn {
  flex-shrink: 0;
  width: 42px;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 10px;
  font-size: 1rem;
}

.copy-btn.copied {
  border-color: #16a34a;
  color: #4ade80;
}

.crypto-note {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.crypto-note strong {
  color: #fbbf24;
}
</style>
