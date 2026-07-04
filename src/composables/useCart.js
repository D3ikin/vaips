import { reactive, computed } from 'vue'
import { store } from './useStore.js'

// Корзина — глобальное состояние. Одна позиция = один вкус.
const state = reactive({
  items: [], // { flavor, qty }
  isOpen: false,
})

export function useCart() {
  const totalCount = computed(() =>
    state.items.reduce((sum, i) => sum + i.qty, 0)
  )

  const totalPrice = computed(() =>
    state.items.reduce((sum, i) => sum + i.qty * store.model.price, 0)
  )

  function add(flavor) {
    const existing = state.items.find((i) => i.flavor.id === flavor.id)
    if (existing) {
      existing.qty++
    } else {
      state.items.push({ flavor, qty: 1 })
    }
  }

  function changeQty(item, delta) {
    item.qty += delta
    if (item.qty <= 0) remove(item)
  }

  function remove(item) {
    const idx = state.items.indexOf(item)
    if (idx !== -1) state.items.splice(idx, 1)
  }

  function clear() {
    state.items.length = 0
  }

  function open() {
    state.isOpen = true
  }

  function close() {
    state.isOpen = false
  }

  return { state, totalCount, totalPrice, add, changeQty, remove, clear, open, close }
}
