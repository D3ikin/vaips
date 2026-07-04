import { reactive, computed } from 'vue'
import defaults from '../data/defaults.js'

// Глобальное хранилище данных магазина.
// Инициализируется вшитыми данными, затем перезаписывается ответом API —
// так сайт работает даже если сервер недоступен.
export const store = reactive(JSON.parse(JSON.stringify(defaults)))

let loadPromise = null

export function loadStore() {
  if (!loadPromise) {
    loadPromise = fetch('/api/store')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.model && Array.isArray(data.flavors)) {
          Object.assign(store, data)
        }
      })
      .catch(() => {
        // API недоступен — остаёмся на данных по умолчанию
      })
  }
  return loadPromise
}

const stripAt = (s) => (s || '').replace(/^@/, '')

// Пути к картинкам вида '/products/…' работают и когда сайт лежит
// в подпапке (GitHub Pages: /vaips/) — подставляем базовый путь сборки.
export const assetUrl = (p) =>
  p && p.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + p : p

export function useStore() {
  const tgChannelUrl = computed(() => `https://t.me/${stripAt(store.tgChannel)}`)
  const tgManagerUrl = computed(() => `https://t.me/${stripAt(store.tgManager)}`)
  const tgManagerName = computed(() => stripAt(store.tgManager))
  // для инвайт-кода приватного канала показываем текст, а не «@+XXXX»
  const tgChannelLabel = computed(() =>
    store.tgChannel.startsWith('+') ? 'Перейти в канал' : `@${stripAt(store.tgChannel)}`
  )

  return { store, tgChannelUrl, tgManagerUrl, tgManagerName, tgChannelLabel }
}
